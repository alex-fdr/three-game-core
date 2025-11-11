var p = Object.defineProperty;
var m = (l, e, t) => e in l ? p(l, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[e] = t;
var i = (l, e, t) => m(l, typeof e != "symbol" ? e + "" : e, t);
import { PerspectiveCamera as f, Object3D as w, WebGLRenderer as g, Scene as b, Color as v, Fog as S, AmbientLight as d, HemisphereLight as E, DirectionalLight as y, Clock as k, TextureLoader as C, RepeatWrapping as u } from "three";
import { World as T, NaiveBroadphase as L } from "cannon-es";
import { GLTFLoader as x } from "three/addons/loaders/GLTFLoader";
import * as z from "three/addons/utils/SkeletonUtils";
function R(l, e) {
  let t, s;
  return (...o) => {
    s ? (clearTimeout(t), t = setTimeout(
      () => {
        Date.now() - s >= e && (l(...o), s = Date.now());
      },
      e - (Date.now() - s)
    )) : (l(...o), s = Date.now());
  };
}
class D extends f {
  constructor(t, s) {
    const { fov: o, near: n, far: r, position: a, following: h } = t;
    super(o.portrait, 1, n, r);
    i(this, "wrapper");
    this.position.copy(a), this.userData.fov = o, this.wrapper = null, h && this.addWrapper(s, h);
  }
  addWrapper(t, s) {
    const { x: o = 0, y: n = 0, z: r = 0 } = s.position;
    this.wrapper = new w(), this.wrapper.position.set(o, n, r), this.wrapper.add(this), t.add(this.wrapper), this.lookAt(o, n, r);
  }
  resize(t, s) {
    const { fov: o } = this.userData;
    this.aspect = t / s, this.fov = this.aspect > 1 ? o.landscape : o.portrait, this.updateProjectionMatrix();
  }
}
class U {
  constructor(e) {
    i(this, "domElement");
    i(this, "enabled", !1);
    i(this, "handler", null);
    i(this, "mouseEvents", ["mousedown", "mousemove", "mouseup"]);
    i(this, "touchEvents", ["touchstart", "touchmove", "touchend"]);
    i(this, "callbacks", { down: [], move: [], up: [] });
    this.domElement = e;
  }
  init() {
    const t = "ontouchstart" in document.documentElement || (navigator == null ? void 0 : navigator.maxTouchPoints) >= 1, [s, o, n] = t ? this.touchEvents : this.mouseEvents;
    this.domElement.addEventListener(s, (r) => {
      var a;
      if (!(!this.enabled || !this.handler)) {
        r instanceof TouchEvent && ((a = r == null ? void 0 : r.touches) == null ? void 0 : a.length) > 1 && r.preventDefault(), this.handler.down(this.getEvent(r));
        for (const h of this.callbacks.down)
          h(this.handler.status);
      }
    }), this.domElement.addEventListener(o, (r) => {
      if (!(!this.enabled || !this.handler) && this.handler.pressed) {
        this.handler.move(this.getEvent(r));
        for (const a of this.callbacks.move)
          a(this.handler.status);
      }
    }), this.domElement.addEventListener(n, (r) => {
      if (!(!this.enabled || !this.handler)) {
        this.handler.up(this.getEvent(r));
        for (const a of this.callbacks.up)
          a(this.handler.status);
      }
    });
  }
  setHandler(e) {
    this.handler = e, this.enabled = !0;
  }
  getEvent(e) {
    return e instanceof TouchEvent ? e.changedTouches[0] : e;
  }
  onDown(e) {
    this.callbacks.down.push(e);
  }
  onMove(e) {
    this.callbacks.move.push(e);
  }
  onUp(e) {
    this.callbacks.up.push(e);
  }
}
class A {
  constructor(e) {
    i(this, "timeStep");
    i(this, "lastCallTime");
    i(this, "maxSubSteps");
    i(this, "world");
    const { gravity: t } = e;
    this.timeStep = 1 / 60, this.lastCallTime = 0, this.maxSubSteps = 3, this.world = new T(), this.world.broadphase = new L(), this.world.gravity.set(t.x, t.y, t.z);
  }
  update(e) {
    if (!this.lastCallTime) {
      this.world.step(this.timeStep), this.lastCallTime = e;
      return;
    }
    const t = (e - this.lastCallTime) / 1e3;
    this.world.step(this.timeStep, t, this.maxSubSteps), this.lastCallTime = e;
  }
}
class P extends g {
  constructor(t) {
    const {
      width: s,
      height: o,
      parentId: n,
      color: r = "#333333",
      opacity: a = 1,
      needResetState: h = !1
    } = t;
    super(t);
    i(this, "needResetState");
    this.needResetState = h, this.setSize(s, o), this.setClearColor(r, a);
    const c = document.getElementById(n);
    c == null || c.append(this.domElement);
  }
  resize(t, s) {
    this.setSize(t, s);
  }
}
class B extends b {
  constructor(t) {
    super();
    i(this, "lights", []);
    const { bg: s, fog: o, lights: n } = t;
    this.name = "root", s && this.addBackground(s), n && this.addLights(n), o && this.addFog(o);
  }
  addBackground(t) {
    this.background = new v(t);
  }
  addFog(t) {
    const { color: s = "#ffffff", near: o = 1, far: n = 100 } = t;
    this.fog = new S(s, o, n);
  }
  addLights(t = []) {
    for (const s of t) {
      const { data: o } = s, n = this.createLightInstance(s);
      o != null && o.position && n.position.copy(o.position), this.add(n), this.lights.push(n);
    }
  }
  createLightInstance(t) {
    switch (t.type) {
      case "directional":
        return new y(t.color, t.intensity);
      case "hemisphere":
        return new E(t.skyColor, t.groundColor, t.intensity);
      case "ambient":
        return new d(t.color, t.intensity);
      default:
        return new d("#ff0000", 1);
    }
  }
}
class W {
  constructor() {
    i(this, "scene");
    i(this, "camera");
    i(this, "renderer");
    i(this, "physics");
    i(this, "input");
    i(this, "clock", new k());
    i(this, "onUpdateCallbacks", []);
    i(this, "onResizeCallbacks", []);
  }
  init(e = 960, t = 960, s) {
    const { scene: o, camera: n, renderer: r, physics: a } = s;
    this.scene = new B(o), this.camera = new D(n, this.scene), this.renderer = new P({ ...r, width: e, height: t }), this.physics = new A(a), this.input = new U(this.renderer.domElement), this.renderer.setAnimationLoop(this.update.bind(this)), this.resize(e, t), this.input.init();
    const h = R(() => {
      this.resize(window.innerWidth, window.innerHeight);
    }, 1e3);
    window.addEventListener("resize", h);
  }
  onUpdate(e) {
    this.onUpdateCallbacks.push(e);
  }
  onResize(e) {
    this.onResizeCallbacks.push(e);
  }
  resize(e, t) {
    this.camera.resize(e, t), this.renderer.resize(e, t);
    for (const s of this.onResizeCallbacks)
      s(e, t);
  }
  render() {
    this.renderer.needResetState && this.renderer.resetState(), this.renderer.render(this.scene, this.camera);
  }
  update(e) {
    this.physics.update(e);
    for (const t of this.onUpdateCallbacks)
      t(e, this.clock.getDelta());
  }
}
class I {
  constructor(e) {
    i(this, "baseUrl");
    i(this, "storage");
    i(this, "loader");
    this.baseUrl = e, this.storage = {}, this.loader = new x();
  }
  loadAll(e = []) {
    return Promise.allSettled(e.map(this.load, this));
  }
  load({ key: e, file: t }) {
    return new Promise((s) => {
      this.loader.load(t, (o) => {
        s(o), this.storage[e] = {
          model: o.scene,
          animations: o.animations
        };
      });
    });
  }
  get(e, t) {
    const { model: s } = this.storage[e], o = t ? s.getObjectByName(t) : s;
    if (!o)
      throw new Error(`no mesh named ${e} found`);
    return s.getObjectByProperty("type", "SkinnedMesh") ? z.clone(o) : o.clone();
  }
  getAnimation(e, t = 0) {
    return this.storage[e].animations[t];
  }
  getAnimations(e, t) {
    const s = this.storage[e].animations;
    return t ? s.filter((o) => o.name.includes(t)) : s;
  }
}
class M {
  constructor(e) {
    i(this, "baseUrl");
    i(this, "storage");
    i(this, "loader");
    this.baseUrl = e, this.storage = {}, this.loader = new C();
  }
  loadAll(e = []) {
    return Promise.allSettled(e.map(this.load, this));
  }
  load({ key: e, file: t }) {
    return new Promise((s) => {
      this.loader.load(t, (o) => {
        s(o), this.storage[e] = o;
      });
    });
  }
  get(e, t = {}) {
    const {
      clone: s = !1,
      flipY: o = !1,
      repeatX: n = 0,
      repeatY: r = n
    } = t;
    let a = this.storage[e];
    return a = s ? a.clone() : a, a.flipY = o, n && (a.repeat.set(n, r), a.wrapS = u, a.wrapT = u), a;
  }
}
class j {
  constructor() {
    i(this, "models");
    i(this, "textures");
    this.models = new I("./src/assets/models/"), this.textures = new M("./src/assets/textures/");
  }
  async load({ models: e, textures: t }) {
    await Promise.allSettled([
      this.models.loadAll(e),
      this.textures.loadAll(t)
    ]), console.log("MODELS:", this.models.storage), console.log("TEXTURES:", this.textures.storage);
  }
}
const Y = new j(), $ = new W();
export {
  Y as assets,
  $ as core
};
