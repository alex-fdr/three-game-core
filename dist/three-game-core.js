var u = Object.defineProperty;
var p = (l, e, t) => e in l ? u(l, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[e] = t;
var i = (l, e, t) => p(l, typeof e != "symbol" ? e + "" : e, t);
import { PerspectiveCamera as m, Object3D as f, WebGLRenderer as w, Scene as g, Color as b, Fog as v, AmbientLight as c, HemisphereLight as E, DirectionalLight as S, Clock as y, TextureLoader as k, RepeatWrapping as d } from "three";
import { World as C, NaiveBroadphase as T } from "cannon-es";
import { GLTFLoader as L } from "three/addons/loaders/GLTFLoader";
import * as x from "three/addons/utils/SkeletonUtils";
function z(l, e) {
  let t, o;
  return (...s) => {
    o ? (clearTimeout(t), t = setTimeout(
      () => {
        Date.now() - o >= e && (l(...s), o = Date.now());
      },
      e - (Date.now() - o)
    )) : (l(...s), o = Date.now());
  };
}
class D extends m {
  constructor(t, o) {
    const { fov: s, near: n, far: a, position: r, following: h } = t;
    super(s.portrait, 1, n, a);
    i(this, "wrapper");
    this.position.copy(r), this.userData.fov = s, this.wrapper = null, h && this.addWrapper(o, h);
  }
  addWrapper(t, o) {
    const { x: s = 0, y: n = 0, z: a = 0 } = o.position;
    this.wrapper = new f(), this.wrapper.position.set(s, n, a), this.wrapper.add(this), t.add(this.wrapper), this.lookAt(s, n, a);
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
    const t = "ontouchstart" in document.documentElement || (navigator == null ? void 0 : navigator.maxTouchPoints) >= 1, [o, s, n] = t ? this.touchEvents : this.mouseEvents;
    this.domElement.addEventListener(o, (a) => {
      var r;
      if (!(!this.enabled || !this.handler)) {
        a instanceof TouchEvent && ((r = a == null ? void 0 : a.touches) == null ? void 0 : r.length) > 1 && a.preventDefault(), this.handler.down(this.getEvent(a));
        for (const h of this.callbacks.down)
          h(this.handler.status);
      }
    }), this.domElement.addEventListener(s, (a) => {
      if (this.handler && this.handler.pressed) {
        this.handler.move(this.getEvent(a));
        for (const r of this.callbacks.move)
          r(this.handler.status);
      }
    }), this.domElement.addEventListener(n, (a) => {
      if (this.handler) {
        this.handler.up(this.getEvent(a));
        for (const r of this.callbacks.up)
          r(this.handler.status);
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
    this.timeStep = 1 / 60, this.lastCallTime = 0, this.maxSubSteps = 3, this.world = new C(), this.world.broadphase = new T(), this.world.gravity.set(t.x, t.y, t.z);
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
  constructor(e) {
    const {
      width: t,
      height: o,
      parentId: s,
      color: n = "#333333",
      opacity: a = 1
    } = e;
    super(e), this.setSize(t, o), this.setClearColor(n, a);
    const r = document.getElementById(s);
    r == null || r.append(this.domElement);
  }
  resize(e, t) {
    this.setSize(e, t);
  }
}
class R extends g {
  constructor(t) {
    super();
    i(this, "lights", []);
    const { bg: o, fog: s, lights: n } = t;
    this.name = "root", o && this.addBackground(o), n && this.addLights(n), s && this.addFog(s);
  }
  addBackground(t) {
    this.background = new b(t);
  }
  addFog(t) {
    const { color: o = "#ffffff", near: s = 1, far: n = 100 } = t;
    this.fog = new v(o, s, n);
  }
  addLights(t = []) {
    for (const o of t) {
      const { data: s } = o, n = this.createLightInstance(o);
      s != null && s.position && n.position.copy(s.position), this.add(n), this.lights.push(n);
    }
  }
  createLightInstance(t) {
    switch (t.type) {
      case "directional":
        return new S(t.color, t.intensity);
      case "hemisphere":
        return new E(t.skyColor, t.groundColor, t.intensity);
      case "ambient":
        return new c(t.color, t.intensity);
      default:
        return new c("#ff0000", 1);
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
    i(this, "clock", new y());
    i(this, "onUpdateCallbacks", []);
    i(this, "onResizeCallbacks", []);
  }
  init(e = 960, t = 960, o) {
    const { scene: s, camera: n, renderer: a, physics: r } = o;
    this.scene = new R(s), this.camera = new D(n, this.scene), this.renderer = new P({ ...a, width: e, height: t }), this.physics = new A(r), this.input = new U(this.renderer.domElement), this.renderer.setAnimationLoop(this.update.bind(this)), this.resize(e, t), this.input.init();
    const h = z(() => {
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
    for (const o of this.onResizeCallbacks)
      o(e, t);
  }
  update(e) {
    for (const t of this.onUpdateCallbacks)
      t(e, this.clock.getDelta());
  }
}
class W {
  constructor(e) {
    i(this, "baseUrl");
    i(this, "storage");
    i(this, "loader");
    this.baseUrl = e, this.storage = {}, this.loader = new L();
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
    return o.getObjectByProperty("type", "SkinnedMesh") ? x.clone(s) : s.clone();
  }
  getAnimation(e, t = 0) {
    return this.storage[e].animations[t];
  }
  getAnimations(e, t) {
    const o = this.storage[e].animations;
    return t ? o.filter((s) => s.name.includes(t)) : o;
  }
}
class I {
  constructor(e) {
    i(this, "baseUrl");
    i(this, "storage");
    i(this, "loader");
    this.baseUrl = e, this.storage = {}, this.loader = new k();
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
      repeatX: n = 0,
      repeatY: a = n
    } = t;
    let r = this.storage[e];
    return r = o ? r.clone() : r, r.flipY = s, n && (r.repeat.set(n, a), r.wrapS = d, r.wrapT = d), r;
  }
}
class M {
  constructor() {
    i(this, "models");
    i(this, "textures");
    this.models = new W("./src/assets/models/"), this.textures = new I("./src/assets/textures/");
  }
  async load({ models: e, textures: t }) {
    await Promise.allSettled([
      this.models.loadAll(e),
      this.textures.loadAll(t)
    ]), console.log("MODELS:", this.models.storage), console.log("TEXTURES:", this.textures.storage);
  }
}
const G = new M(), Y = new B();
export {
  G as assets,
  Y as core
};
