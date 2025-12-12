import { PerspectiveCamera as m, Object3D as g, WebGLRenderer as w, Scene as v, Color as y, Fog as S, AmbientLight as p, HemisphereLight as E, DirectionalLight as b, Box3 as z, Vector3 as L, Clock as x, TextureLoader as T, RepeatWrapping as u } from "three";
import { GLTFLoader as R } from "three/addons/loaders/GLTFLoader";
import * as A from "three/addons/utils/SkeletonUtils";
class k extends m {
  wrapper;
  constructor(e, t) {
    const { fov: s, near: n, far: o, position: r, wrapper: a } = e;
    super(s.portrait, 1, n, o), this.position.copy(r), this.userData.fov = s, this.wrapper = null, a && this.addWrapper(t, a);
  }
  addWrapper(e, t) {
    const { x: s = 0, y: n = 0, z: o = 0 } = t.position;
    this.wrapper = new g(), this.wrapper.position.set(s, n, o), this.wrapper.add(this), e.add(this.wrapper), this.lookAt(s, n, o);
  }
  resize(e, t) {
    const { fov: s } = this.userData;
    this.aspect = e / t, this.fov = this.aspect > 1 ? s.landscape : s.portrait, this.updateProjectionMatrix();
  }
}
class d {
  listeners = [];
  add(e, t) {
    this.listeners.push(t ? e.bind(t) : e);
  }
  addOnce(e, t) {
    const s = this.listeners.length, n = (...o) => {
      t ? e.call(t, ...o) : e(...o), this.listeners.splice(s, 1);
    };
    this.listeners.push(n);
  }
  remove() {
    this.listeners = [];
  }
  dispatch(...e) {
    for (const t of this.listeners)
      t(...e);
  }
}
class U {
  domElement;
  enabled = !1;
  handler = null;
  mouseEvents = ["mousedown", "mousemove", "mouseup"];
  touchEvents = ["touchstart", "touchmove", "touchend"];
  onDown = new d();
  onUp = new d();
  onMove = new d();
  constructor(e) {
    this.domElement = e;
  }
  init() {
    const t = "ontouchstart" in document.documentElement || navigator?.maxTouchPoints >= 1, [s, n, o] = t ? this.touchEvents : this.mouseEvents;
    this.domElement.addEventListener(s, (r) => {
      !this.enabled || !this.handler || (r instanceof TouchEvent && r?.touches?.length > 1 && r.preventDefault(), this.handler.down(this.getEvent(r)), this.onDown.dispatch(this.handler.status));
    }), this.domElement.addEventListener(n, (r) => {
      !this.enabled || !this.handler || !this.handler.pressed || (this.handler.move(this.getEvent(r)), this.onMove.dispatch(this.handler.status));
    }), this.domElement.addEventListener(o, (r) => {
      !this.enabled || !this.handler || (this.handler.up(this.getEvent(r)), this.onUp.dispatch(this.handler.status));
    });
  }
  setHandler(e) {
    this.handler = e, this.enabled = !0;
  }
  getEvent(e) {
    return e instanceof TouchEvent ? e.changedTouches[0] : e;
  }
}
class j extends w {
  needResetState;
  constructor(e) {
    const { width: t, height: s, parentId: n, color: o, opacity: r, needResetState: a } = e;
    super(e), this.needResetState = a ?? !1, this.setSize(t, s, !1), this.setClearColor(o, r), n ? document.getElementById(n)?.append(this.domElement) : document.body.append(this.domElement);
  }
  resize(e, t) {
    this.setSize(e, t, !1);
  }
}
class C extends v {
  lights = [];
  constructor(e) {
    super();
    const { bg: t, fog: s, lights: n } = e;
    this.name = "root", t && this.addBackground(t), n && this.addLights(n), s && this.addFog(s);
  }
  addBackground(e) {
    this.background = new y(e);
  }
  addFog(e) {
    const { color: t = "#ffffff", near: s = 1, far: n = 100 } = e;
    this.fog = new S(t, s, n);
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
        return new b(e.color, e.intensity);
      case "hemisphere":
        return new E(e.skyColor, e.groundColor, e.intensity);
      case "ambient":
        return new p(e.color, e.intensity);
      default:
        return new p("#ff0000", 1);
    }
  }
}
const M = {
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
  }
};
function O(i, e = {}) {
  const { position: t, rotation: s, scale: n, scaleFactor: o } = e;
  if (t) {
    const { x: r = 0, y: a = 0, z: h = 0 } = t;
    i.position.set(r, a, h);
  }
  if (s) {
    const { x: r = 0, y: a = 0, z: h = 0 } = s;
    i.rotation.set(r, a, h);
  }
  if (n) {
    const { x: r = 1, y: a = 1, z: h = 1 } = n;
    i.scale.set(r, a, h);
  }
  o && i.scale.multiplyScalar(o);
}
function c(i, e) {
  if (!l(i) || !l(e))
    return e;
  const t = { ...i };
  for (const s in e)
    l(e[s]) && s in i ? t[s] = c(i[s], e[s]) : t[s] = e[s];
  return t;
}
function l(i) {
  return i && typeof i == "object" && !Array.isArray(i);
}
function D(i) {
  const e = new z().setFromObject(i), t = new L();
  return e.getSize(t), t;
}
function f(i = 1024) {
  const e = window.innerWidth / window.innerHeight;
  return e > 1 ? {
    width: i,
    height: Math.round(i / e)
  } : {
    width: Math.round(i * e),
    height: i
  };
}
const G = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyTransform: O,
  deepMerge: c,
  getObjectSize: D,
  getScreenSize: f
}, Symbol.toStringTag, { value: "Module" }));
class P {
  scene;
  camera;
  renderer;
  input;
  clock = new x();
  onUpdate = new d();
  onResize = new d();
  init(e, t, s = {}) {
    const n = c(M, s);
    this.scene = new C(n.scene), this.camera = new k(n.camera, this.scene), this.renderer = new j({ ...n.renderer, width: e, height: t }), this.input = new U(this.renderer.domElement), this.renderer.setAnimationLoop(this.update.bind(this)), this.resize(e, t), this.input.init(), n.renderer?.needResetState || this.onUpdate.add(this.render, this), window.addEventListener("resize", () => {
      const { width: o, height: r } = f();
      this.resize(o, r);
    });
  }
  resize(e, t) {
    this.camera.resize(e, t), this.renderer.resize(e, t), this.onResize.dispatch(e, t);
  }
  render() {
    this.renderer.needResetState && this.renderer.resetState(), this.renderer.render(this.scene, this.camera);
  }
  update(e) {
    this.onUpdate.dispatch(e, this.clock.getDelta());
  }
}
class B {
  baseUrl;
  storage = {};
  loader = new R();
  constructor(e) {
    this.baseUrl = e;
  }
  loadAll(e = []) {
    return Promise.allSettled(e.map(this.load, this));
  }
  load({ key: e, file: t }) {
    return new Promise((s) => {
      this.loader.load(t, (n) => {
        s(n), this.storage[e] = {
          model: n.scene,
          animations: n.animations
        };
      });
    });
  }
  get(e, t) {
    const { model: s } = this.storage[e], n = t ? s.getObjectByName(t) : s;
    if (!n)
      throw new Error(`no mesh named ${e} found`);
    return s.getObjectByProperty("type", "SkinnedMesh") ? A.clone(n) : n.clone();
  }
  getAnimation(e, t = 0) {
    return this.storage[e].animations[t];
  }
  getAnimations(e, t) {
    const s = this.storage[e].animations;
    return t ? s.filter((n) => n.name.includes(t)) : s;
  }
}
class F {
  baseUrl;
  storage = {};
  loader = new T();
  constructor(e) {
    this.baseUrl = e;
  }
  loadAll(e = []) {
    return Promise.allSettled(e.map(this.load, this));
  }
  load({ key: e, file: t }) {
    return new Promise((s) => {
      this.loader.load(t, (n) => {
        s(n), this.storage[e] = n;
      });
    });
  }
  get(e, t = {}) {
    const { clone: s = !1, flipY: n = !1, repeatX: o = 0, repeatY: r = o } = t;
    let a = this.storage[e];
    return a = s ? a.clone() : a, a.flipY = n, o && (a.repeat.set(o, r), a.wrapS = u, a.wrapT = u), a;
  }
}
class I {
  models;
  textures;
  constructor() {
    this.models = new B("./src/assets/models/"), this.textures = new F("./src/assets/textures/");
  }
  async load({ models: e, textures: t }) {
    await Promise.allSettled([
      this.models.loadAll(e),
      this.textures.loadAll(t)
    ]), console.log("MODELS:", this.models.storage), console.log("TEXTURES:", this.textures.storage);
  }
}
const H = new I(), Y = new P();
export {
  d as Signal,
  H as assets,
  Y as core,
  G as utils
};
