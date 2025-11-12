var p = Object.defineProperty;
var m = (l, e, t) => e in l ? p(l, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[e] = t;
var i = (l, e, t) => m(l, typeof e != "symbol" ? e + "" : e, t);
import { PerspectiveCamera as f, Object3D as g, WebGLRenderer as w, Scene as b, Color as v, Fog as S, AmbientLight as d, HemisphereLight as E, DirectionalLight as y, Clock as k, TextureLoader as C, RepeatWrapping as u } from "three";
import { World as x, NaiveBroadphase as L } from "cannon-es";
import { GLTFLoader as T } from "three/addons/loaders/GLTFLoader";
import * as z from "three/addons/utils/SkeletonUtils";
class R extends f {
  constructor(t, o) {
    const { fov: s, near: r, far: n, position: a, following: h } = t;
    super(s.portrait, 1, r, n);
    i(this, "wrapper");
    this.position.copy(a), this.userData.fov = s, this.wrapper = null, h && this.addWrapper(o, h);
  }
  addWrapper(t, o) {
    const { x: s = 0, y: r = 0, z: n = 0 } = o.position;
    this.wrapper = new g(), this.wrapper.position.set(s, r, n), this.wrapper.add(this), t.add(this.wrapper), this.lookAt(s, r, n);
  }
  resize(t, o) {
    const { fov: s } = this.userData;
    this.aspect = t / o, this.fov = this.aspect > 1 ? s.landscape : s.portrait, this.updateProjectionMatrix();
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
    const t = "ontouchstart" in document.documentElement || (navigator == null ? void 0 : navigator.maxTouchPoints) >= 1, [o, s, r] = t ? this.touchEvents : this.mouseEvents;
    this.domElement.addEventListener(o, (n) => {
      var a;
      if (!(!this.enabled || !this.handler)) {
        n instanceof TouchEvent && ((a = n == null ? void 0 : n.touches) == null ? void 0 : a.length) > 1 && n.preventDefault(), this.handler.down(this.getEvent(n));
        for (const h of this.callbacks.down)
          h(this.handler.status);
      }
    }), this.domElement.addEventListener(s, (n) => {
      if (!(!this.enabled || !this.handler) && this.handler.pressed) {
        this.handler.move(this.getEvent(n));
        for (const a of this.callbacks.move)
          a(this.handler.status);
      }
    }), this.domElement.addEventListener(r, (n) => {
      if (!(!this.enabled || !this.handler)) {
        this.handler.up(this.getEvent(n));
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
    this.timeStep = 1 / 60, this.lastCallTime = 0, this.maxSubSteps = 3, this.world = new x(), this.world.broadphase = new L(), this.world.gravity.set(t.x, t.y, t.z);
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
class P extends w {
  constructor(t) {
    const {
      width: o,
      height: s,
      parentId: r,
      color: n = "#333333",
      opacity: a = 1,
      needResetState: h = !1
    } = t;
    super(t);
    i(this, "needResetState");
    this.needResetState = h, this.setSize(o, s), this.setClearColor(n, a);
    const c = document.getElementById(r);
    c == null || c.append(this.domElement);
  }
  resize(t, o) {
    this.setSize(t, o);
  }
}
class D extends b {
  constructor(t) {
    super();
    i(this, "lights", []);
    const { bg: o, fog: s, lights: r } = t;
    this.name = "root", o && this.addBackground(o), r && this.addLights(r), s && this.addFog(s);
  }
  addBackground(t) {
    this.background = new v(t);
  }
  addFog(t) {
    const { color: o = "#ffffff", near: s = 1, far: r = 100 } = t;
    this.fog = new S(o, s, r);
  }
  addLights(t = []) {
    for (const o of t) {
      const { data: s } = o, r = this.createLightInstance(o);
      s != null && s.position && r.position.copy(s.position), this.add(r), this.lights.push(r);
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
class B {
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
  init(e = 960, t = 960, o) {
    const { scene: s, camera: r, renderer: n, physics: a } = o;
    this.scene = new D(s), this.camera = new R(r, this.scene), this.renderer = new P({ ...n, width: e, height: t }), this.physics = new A(a), this.input = new U(this.renderer.domElement), this.renderer.setAnimationLoop(this.update.bind(this)), this.resize(e, t), this.input.init();
  }
  onUpdate(e) {
    this.onUpdateCallbacks.push(e);
  }
  onResize(e) {
    this.onResizeCallbacks.push(e);
  }
  resize(e, t) {
    this.camera.resize(e, t), this.renderer.resize(e, t);
    for (const o of this.onResizeCallbacks)
      o(e, t);
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
    this.baseUrl = e, this.storage = {}, this.loader = new T();
  }
  loadAll(e = []) {
    return Promise.allSettled(e.map(this.load, this));
  }
  load({ key: e, file: t }) {
    return new Promise((o) => {
      this.loader.load(t, (s) => {
        o(s), this.storage[e] = {
          model: s.scene,
          animations: s.animations
        };
      });
    });
  }
  get(e, t) {
    const { model: o } = this.storage[e], s = t ? o.getObjectByName(t) : o;
    if (!s)
      throw new Error(`no mesh named ${e} found`);
    return o.getObjectByProperty("type", "SkinnedMesh") ? z.clone(s) : s.clone();
  }
  getAnimation(e, t = 0) {
    return this.storage[e].animations[t];
  }
  getAnimations(e, t) {
    const o = this.storage[e].animations;
    return t ? o.filter((s) => s.name.includes(t)) : o;
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
    return new Promise((o) => {
      this.loader.load(t, (s) => {
        o(s), this.storage[e] = s;
      });
    });
  }
  get(e, t = {}) {
    const {
      clone: o = !1,
      flipY: s = !1,
      repeatX: r = 0,
      repeatY: n = r
    } = t;
    let a = this.storage[e];
    return a = o ? a.clone() : a, a.flipY = s, r && (a.repeat.set(r, n), a.wrapS = u, a.wrapT = u), a;
  }
}
class W {
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
const Y = new W(), $ = new B();
export {
  Y as assets,
  $ as core
};
