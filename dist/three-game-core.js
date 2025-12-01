import { PerspectiveCamera as g, Object3D as y, WebGLRenderer as S, Scene as v, Color as b, Fog as E, AmbientLight as p, HemisphereLight as x, DirectionalLight as T, Box3 as z, Vector3 as L, Clock as C, TextureLoader as R, RepeatWrapping as u } from "three";
import { World as D, NaiveBroadphase as A } from "cannon-es";
import { GLTFLoader as U } from "three/addons/loaders/GLTFLoader";
import * as j from "three/addons/utils/SkeletonUtils";
class k extends g {
  wrapper;
  constructor(e, t) {
    const { fov: s, near: i, far: a, position: o, wrapper: r } = e;
    super(s.portrait, 1, i, a), this.position.copy(o), this.userData.fov = s, this.wrapper = null, r && this.addWrapper(t, r);
  }
  addWrapper(e, t) {
    const { x: s = 0, y: i = 0, z: a = 0 } = t.position;
    this.wrapper = new y(), this.wrapper.position.set(s, i, a), this.wrapper.add(this), e.add(this.wrapper), this.lookAt(s, i, a);
  }
  resize(e, t) {
    const { fov: s } = this.userData;
    this.aspect = e / t, this.fov = this.aspect > 1 ? s.landscape : s.portrait, this.updateProjectionMatrix();
  }
}
class l {
  listeners = [];
  add(e, t) {
    this.listeners.push(t ? e.bind(t) : e);
  }
  addOnce(e, t) {
    const s = this.listeners.length, i = (...a) => {
      t ? e.call(t, ...a) : e(...a), this.listeners.splice(s, 1);
    };
    this.listeners.push(i);
  }
  remove() {
    this.listeners = [];
  }
  dispatch(...e) {
    for (const t of this.listeners)
      t(...e);
  }
}
class M {
  domElement;
  enabled = !1;
  handler = null;
  mouseEvents = ["mousedown", "mousemove", "mouseup"];
  touchEvents = ["touchstart", "touchmove", "touchend"];
  onDown = new l();
  onUp = new l();
  onMove = new l();
  constructor(e) {
    this.domElement = e;
  }
  init() {
    const t = "ontouchstart" in document.documentElement || navigator?.maxTouchPoints >= 1, [s, i, a] = t ? this.touchEvents : this.mouseEvents;
    this.domElement.addEventListener(s, (o) => {
      !this.enabled || !this.handler || (o instanceof TouchEvent && o?.touches?.length > 1 && o.preventDefault(), this.handler.down(this.getEvent(o)), this.onDown.dispatch(this.handler.status));
    }), this.domElement.addEventListener(i, (o) => {
      !this.enabled || !this.handler || !this.handler.pressed || (this.handler.move(this.getEvent(o)), this.onMove.dispatch(this.handler.status));
    }), this.domElement.addEventListener(a, (o) => {
      !this.enabled || !this.handler || (this.handler.up(this.getEvent(o)), this.onUp.dispatch(this.handler.status));
    });
  }
  setHandler(e) {
    this.handler = e, this.enabled = !0;
  }
  getEvent(e) {
    return e instanceof TouchEvent ? e.changedTouches[0] : e;
  }
}
class O {
  timeStep;
  lastCallTime;
  maxSubSteps;
  world;
  constructor(e) {
    const { gravity: t = { x: 0, y: 0, z: 0 } } = e;
    this.timeStep = 1 / 60, this.lastCallTime = 0, this.maxSubSteps = 3, this.world = new D(), this.world.broadphase = new A(), this.world.gravity.set(t.x, t.y, t.z);
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
class P extends S {
  needResetState;
  constructor(e) {
    const { width: t, height: s, parentId: i, color: a, opacity: o, needResetState: r } = e;
    super(e), this.needResetState = r ?? !1, this.setSize(t, s, !1), this.setClearColor(a, o), i ? document.getElementById(i)?.append(this.domElement) : document.body.append(this.domElement);
  }
  resize(e, t) {
    this.setSize(e, t, !1);
  }
}
class B extends v {
  lights = [];
  constructor(e) {
    super();
    const { bg: t, fog: s, lights: i } = e;
    this.name = "root", t && this.addBackground(t), i && this.addLights(i), s && this.addFog(s);
  }
  addBackground(e) {
    this.background = new b(e);
  }
  addFog(e) {
    const { color: t = "#ffffff", near: s = 1, far: i = 100 } = e;
    this.fog = new E(t, s, i);
  }
  addLights(e = []) {
    for (const t of e) {
      const s = this.createLightInstance(t);
      "data" in t && "position" in t.data && s.position.copy(t.data.position), this.add(s), this.lights.push(s);
    }
  }
  createLightInstance(e) {
    switch (e.type) {
      case "directional":
        return new T(e.color, e.intensity);
      case "hemisphere":
        return new x(e.skyColor, e.groundColor, e.intensity);
      case "ambient":
        return new p(e.color, e.intensity);
      default:
        return new p("#ff0000", 1);
    }
  }
}
function F(n, e = {}) {
  const { position: t, rotation: s, scale: i, scaleFactor: a } = e;
  if (t) {
    const { x: o = 0, y: r = 0, z: h = 0 } = t;
    n.position.set(o, r, h);
  }
  if (s) {
    const { x: o = 0, y: r = 0, z: h = 0 } = s;
    n.rotation.set(o, r, h);
  }
  if (i) {
    const { x: o = 1, y: r = 1, z: h = 1 } = i;
    n.scale.set(o, r, h);
  }
  a && n.scale.multiplyScalar(a);
}
function I(n) {
  const e = new z().setFromObject(n), t = new L();
  return e.getSize(t), t;
}
function m(n = 1024) {
  const e = window.innerWidth / window.innerHeight;
  return e > 1 ? {
    width: n,
    height: Math.round(n / e)
  } : {
    width: Math.round(n * e),
    height: n
  };
}
function W(n, e) {
  let t, s;
  return (...i) => {
    s ? (clearTimeout(t), t = setTimeout(
      () => {
        Date.now() - s >= e && (n(...i), s = Date.now());
      },
      e - (Date.now() - s)
    )) : (n(...i), s = Date.now());
  };
}
function c(n, e) {
  if (!d(n) || !d(e))
    return e;
  const t = { ...n };
  for (const s in e)
    d(e[s]) && s in n ? t[s] = c(n[s], e[s]) : t[s] = e[s];
  return t;
}
function d(n) {
  return n && typeof n == "object" && !Array.isArray(n);
}
const q = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyTransform: F,
  deepMerge: c,
  getObjectSize: I,
  getScreenSize: m,
  throttleTrailing: W
}, Symbol.toStringTag, { value: "Module" })), _ = {
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
class G {
  scene;
  camera;
  renderer;
  physics;
  input;
  clock = new C();
  onUpdate = new l();
  onResize = new l();
  init(e, t, s = {}) {
    const i = c(_, s), { scene: a, camera: o, renderer: r, physics: h } = i;
    this.scene = new B(a), this.camera = new k(o, this.scene), this.renderer = new P({ ...r, width: e, height: t }), this.input = new M(this.renderer.domElement), h && (this.physics = new O(h)), this.renderer.setAnimationLoop(this.update.bind(this)), this.resize(e, t), this.input.init(), r?.needResetState || this.onUpdate.add(this.render, this), window.addEventListener("resize", () => {
      const { width: f, height: w } = m();
      this.resize(f, w);
    });
  }
  resize(e, t) {
    this.camera.resize(e, t), this.renderer.resize(e, t), this.onResize.dispatch(e, t);
  }
  render() {
    this.renderer.needResetState && this.renderer.resetState(), this.renderer.render(this.scene, this.camera);
  }
  update(e) {
    this.physics?.update(e), this.onUpdate.dispatch(e, this.clock.getDelta());
  }
}
class H {
  baseUrl;
  storage;
  loader;
  constructor(e) {
    this.baseUrl = e, this.storage = {}, this.loader = new U();
  }
  loadAll(e = []) {
    return Promise.allSettled(e.map(this.load, this));
  }
  load({ key: e, file: t }) {
    return new Promise((s) => {
      this.loader.load(t, (i) => {
        s(i), this.storage[e] = {
          model: i.scene,
          animations: i.animations
        };
      });
    });
  }
  get(e, t) {
    const { model: s } = this.storage[e], i = t ? s.getObjectByName(t) : s;
    if (!i)
      throw new Error(`no mesh named ${e} found`);
    return s.getObjectByProperty("type", "SkinnedMesh") ? j.clone(i) : i.clone();
  }
  getAnimation(e, t = 0) {
    return this.storage[e].animations[t];
  }
  getAnimations(e, t) {
    const s = this.storage[e].animations;
    return t ? s.filter((i) => i.name.includes(t)) : s;
  }
}
class Y {
  baseUrl;
  storage;
  loader;
  constructor(e) {
    this.baseUrl = e, this.storage = {}, this.loader = new R();
  }
  loadAll(e = []) {
    return Promise.allSettled(e.map(this.load, this));
  }
  load({ key: e, file: t }) {
    return new Promise((s) => {
      this.loader.load(t, (i) => {
        s(i), this.storage[e] = i;
      });
    });
  }
  get(e, t = {}) {
    const { clone: s = !1, flipY: i = !1, repeatX: a = 0, repeatY: o = a } = t;
    let r = this.storage[e];
    return r = s ? r.clone() : r, r.flipY = i, a && (r.repeat.set(a, o), r.wrapS = u, r.wrapT = u), r;
  }
}
class $ {
  models;
  textures;
  constructor() {
    this.models = new H("./src/assets/models/"), this.textures = new Y("./src/assets/textures/");
  }
  async load({ models: e, textures: t }) {
    await Promise.allSettled([
      this.models.loadAll(e),
      this.textures.loadAll(t)
    ]), console.log("MODELS:", this.models.storage), console.log("TEXTURES:", this.textures.storage);
  }
}
const J = new $(), K = new G();
export {
  J as assets,
  K as core,
  q as utils
};
