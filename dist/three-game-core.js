var g = Object.defineProperty;
var y = (n, t, e) => t in n ? g(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var r = (n, t, e) => y(n, typeof t != "symbol" ? t + "" : t, e);
import { PerspectiveCamera as S, Object3D as v, WebGLRenderer as b, Scene as E, Color as x, Fog as z, AmbientLight as m, HemisphereLight as L, DirectionalLight as T, Box3 as C, Vector3 as R, Clock as A, TextureLoader as k, RepeatWrapping as f } from "three";
import { World as U, NaiveBroadphase as j } from "cannon-es";
import { GLTFLoader as M } from "three/addons/loaders/GLTFLoader";
import * as O from "three/addons/utils/SkeletonUtils";
class P extends S {
  constructor(e, s) {
    const { fov: i, near: o, far: a, position: h, wrapper: l } = e;
    super(i.portrait, 1, o, a);
    r(this, "wrapper");
    this.position.copy(h), this.userData.fov = i, this.wrapper = null, l && this.addWrapper(s, l);
  }
  addWrapper(e, s) {
    const { x: i = 0, y: o = 0, z: a = 0 } = s.position;
    this.wrapper = new v(), this.wrapper.position.set(i, o, a), this.wrapper.add(this), e.add(this.wrapper), this.lookAt(i, o, a);
  }
  resize(e, s) {
    const { fov: i } = this.userData;
    this.aspect = e / s, this.fov = this.aspect > 1 ? i.landscape : i.portrait, this.updateProjectionMatrix();
  }
}
class d {
  constructor() {
    r(this, "listeners", []);
  }
  add(t, e) {
    this.listeners.push(e ? t.bind(e) : t);
  }
  addOnce(t, e) {
    const s = this.listeners.length, i = (...o) => {
      e ? t.call(e, ...o) : t(...o), this.listeners.splice(s, 1);
    };
    this.listeners.push(i);
  }
  remove() {
    this.listeners = [];
  }
  dispatch(...t) {
    for (const e of this.listeners)
      e(...t);
  }
}
class D {
  constructor(t) {
    r(this, "domElement");
    r(this, "enabled", !1);
    r(this, "handler", null);
    r(this, "mouseEvents", ["mousedown", "mousemove", "mouseup"]);
    r(this, "touchEvents", ["touchstart", "touchmove", "touchend"]);
    r(this, "onDown", new d());
    r(this, "onUp", new d());
    r(this, "onMove", new d());
    this.domElement = t;
  }
  init() {
    const e = "ontouchstart" in document.documentElement || (navigator == null ? void 0 : navigator.maxTouchPoints) >= 1, [s, i, o] = e ? this.touchEvents : this.mouseEvents;
    this.domElement.addEventListener(s, (a) => {
      var h;
      !this.enabled || !this.handler || (a instanceof TouchEvent && ((h = a == null ? void 0 : a.touches) == null ? void 0 : h.length) > 1 && a.preventDefault(), this.handler.down(this.getEvent(a)), this.onDown.dispatch(this.handler.status));
    }), this.domElement.addEventListener(i, (a) => {
      !this.enabled || !this.handler || !this.handler.pressed || (this.handler.move(this.getEvent(a)), this.onMove.dispatch(this.handler.status));
    }), this.domElement.addEventListener(o, (a) => {
      !this.enabled || !this.handler || (this.handler.up(this.getEvent(a)), this.onUp.dispatch(this.handler.status));
    });
  }
  setHandler(t) {
    this.handler = t, this.enabled = !0;
  }
  getEvent(t) {
    return t instanceof TouchEvent ? t.changedTouches[0] : t;
  }
}
class B {
  constructor(t) {
    r(this, "timeStep", 1 / 60);
    r(this, "lastCallTime", 0);
    r(this, "maxSubSteps", 3);
    r(this, "world");
    const { gravity: e = { x: 0, y: 0, z: 0 } } = t;
    this.world = new U(), this.world.broadphase = new j(), this.world.gravity.set(e.x, e.y, e.z);
  }
  update(t) {
    if (!this.lastCallTime) {
      this.world.step(this.timeStep), this.lastCallTime = t;
      return;
    }
    const e = (t - this.lastCallTime) / 1e3;
    this.world.step(this.timeStep, e, this.maxSubSteps), this.lastCallTime = t;
  }
}
class F extends b {
  constructor(e) {
    const { width: s, height: i, parentId: o, color: a, opacity: h, needResetState: l } = e;
    super(e);
    r(this, "needResetState");
    if (this.needResetState = l ?? !1, this.setSize(s, i, !1), this.setClearColor(a, h), o) {
      const c = document.getElementById(o);
      c == null || c.append(this.domElement);
    } else
      document.body.append(this.domElement);
  }
  resize(e, s) {
    this.setSize(e, s, !1);
  }
}
class I extends E {
  constructor(e) {
    super();
    r(this, "lights", []);
    const { bg: s, fog: i, lights: o } = e;
    this.name = "root", s && this.addBackground(s), o && this.addLights(o), i && this.addFog(i);
  }
  addBackground(e) {
    this.background = new x(e);
  }
  addFog(e) {
    const { color: s = "#ffffff", near: i = 1, far: o = 100 } = e;
    this.fog = new z(s, i, o);
  }
  addLights(e = []) {
    for (const s of e) {
      const i = this.createLightInstance(s);
      "data" in s && "position" in s.data && i.position.copy(s.data.position), this.add(i), this.lights.push(i);
    }
  }
  createLightInstance(e) {
    switch (e.type) {
      case "directional":
        return new T(e.color, e.intensity);
      case "hemisphere":
        return new L(e.skyColor, e.groundColor, e.intensity);
      case "ambient":
        return new m(e.color, e.intensity);
      default:
        return new m("#ff0000", 1);
    }
  }
}
const W = {
  scene: {
    lights: [
      {
        type: "ambient",
        color: "#ffffff",
        intensity: 1
      }
    ]
  },
  camera: {
    near: 1,
    far: 1e3,
    fov: { portrait: 45, landscape: 45 },
    position: { x: 0, y: 0, z: 5 }
  },
  renderer: {
    width: 1024,
    height: 1024,
    color: "#333333",
    opacity: 1,
    parentId: "",
    needResetState: !1
  },
  physics: {}
};
function _(n, t = {}) {
  const { position: e, rotation: s, scale: i, scaleFactor: o } = t;
  if (e) {
    const { x: a = 0, y: h = 0, z: l = 0 } = e;
    n.position.set(a, h, l);
  }
  if (s) {
    const { x: a = 0, y: h = 0, z: l = 0 } = s;
    n.rotation.set(a, h, l);
  }
  if (i) {
    const { x: a = 1, y: h = 1, z: l = 1 } = i;
    n.scale.set(a, h, l);
  }
  o && n.scale.multiplyScalar(o);
}
function u(n, t) {
  if (!p(n) || !p(t))
    return t;
  const e = { ...n };
  for (const s in t)
    p(t[s]) && s in n ? e[s] = u(n[s], t[s]) : e[s] = t[s];
  return e;
}
function p(n) {
  return n && typeof n == "object" && !Array.isArray(n);
}
function G(n) {
  const t = new C().setFromObject(n), e = new R();
  return t.getSize(e), e;
}
function w(n = 1024) {
  const t = window.innerWidth / window.innerHeight;
  return t > 1 ? {
    width: n,
    height: Math.round(n / t)
  } : {
    width: Math.round(n * t),
    height: n
  };
}
const K = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyTransform: _,
  deepMerge: u,
  getObjectSize: G,
  getScreenSize: w
}, Symbol.toStringTag, { value: "Module" }));
class H {
  constructor() {
    r(this, "scene");
    r(this, "camera");
    r(this, "renderer");
    r(this, "physics");
    r(this, "input");
    r(this, "clock", new A());
    r(this, "onUpdate", new d());
    r(this, "onResize", new d());
  }
  init(t, e, s = {}) {
    var o;
    const i = u(W, s);
    this.scene = new I(i.scene), this.camera = new P(i.camera, this.scene), this.renderer = new F({ ...i.renderer, width: t, height: e }), this.input = new D(this.renderer.domElement), i.physics && (this.physics = new B(i.physics)), this.renderer.setAnimationLoop(this.update.bind(this)), this.resize(t, e), this.input.init(), (o = i.renderer) != null && o.needResetState || this.onUpdate.add(this.render, this), window.addEventListener("resize", () => {
      const { width: a, height: h } = w();
      this.resize(a, h);
    });
  }
  resize(t, e) {
    this.camera.resize(t, e), this.renderer.resize(t, e), this.onResize.dispatch(t, e);
  }
  render() {
    this.renderer.needResetState && this.renderer.resetState(), this.renderer.render(this.scene, this.camera);
  }
  update(t) {
    var e;
    (e = this.physics) == null || e.update(t), this.onUpdate.dispatch(t, this.clock.getDelta());
  }
}
class Y {
  constructor(t) {
    r(this, "baseUrl");
    r(this, "storage", {});
    r(this, "loader", new M());
    this.baseUrl = t;
  }
  loadAll(t = []) {
    return Promise.allSettled(t.map(this.load, this));
  }
  load({ key: t, file: e }) {
    return new Promise((s) => {
      this.loader.load(e, (i) => {
        s(i), this.storage[t] = {
          model: i.scene,
          animations: i.animations
        };
      });
    });
  }
  get(t, e) {
    const { model: s } = this.storage[t], i = e ? s.getObjectByName(e) : s;
    if (!i)
      throw new Error(`no mesh named ${t} found`);
    return s.getObjectByProperty("type", "SkinnedMesh") ? O.clone(i) : i.clone();
  }
  getAnimation(t, e = 0) {
    return this.storage[t].animations[e];
  }
  getAnimations(t, e) {
    const s = this.storage[t].animations;
    return e ? s.filter((i) => i.name.includes(e)) : s;
  }
}
class $ {
  constructor(t) {
    r(this, "baseUrl");
    r(this, "storage", {});
    r(this, "loader", new k());
    this.baseUrl = t;
  }
  loadAll(t = []) {
    return Promise.allSettled(t.map(this.load, this));
  }
  load({ key: t, file: e }) {
    return new Promise((s) => {
      this.loader.load(e, (i) => {
        s(i), this.storage[t] = i;
      });
    });
  }
  get(t, e = {}) {
    const { clone: s = !1, flipY: i = !1, repeatX: o = 0, repeatY: a = o } = e;
    let h = this.storage[t];
    return h = s ? h.clone() : h, h.flipY = i, o && (h.repeat.set(o, a), h.wrapS = f, h.wrapT = f), h;
  }
}
class X {
  constructor() {
    r(this, "models");
    r(this, "textures");
    this.models = new Y("./src/assets/models/"), this.textures = new $("./src/assets/textures/");
  }
  async load({ models: t, textures: e }) {
    await Promise.allSettled([
      this.models.loadAll(t),
      this.textures.loadAll(e)
    ]), console.log("MODELS:", this.models.storage), console.log("TEXTURES:", this.textures.storage);
  }
}
const Q = new X(), Z = new H();
export {
  Q as assets,
  Z as core,
  K as utils
};
