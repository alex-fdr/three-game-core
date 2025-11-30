import { PerspectiveCamera as g, Object3D as y, WebGLRenderer as S, Scene as b, Color as v, Fog as E, AmbientLight as d, HemisphereLight as x, DirectionalLight as T, Box3 as z, Vector3 as L, Clock as k, TextureLoader as C, RepeatWrapping as p } from "three";
import { World as R, NaiveBroadphase as A } from "cannon-es";
import { GLTFLoader as D } from "three/addons/loaders/GLTFLoader";
import * as j from "three/addons/utils/SkeletonUtils";
class O extends g {
  wrapper;
  constructor(e, t) {
    const { fov: s, near: i, far: a, position: r, wrapper: o } = e;
    super(s.portrait, 1, i, a), this.position.copy(r), this.userData.fov = s, this.wrapper = null, o && this.addWrapper(t, o);
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
class P {
  domElement;
  enabled = !1;
  handler = null;
  mouseEvents = ["mousedown", "mousemove", "mouseup"];
  touchEvents = ["touchstart", "touchmove", "touchend"];
  callbacks = { down: [], move: [], up: [] };
  constructor(e) {
    this.domElement = e;
  }
  init() {
    const t = "ontouchstart" in document.documentElement || navigator?.maxTouchPoints >= 1, [s, i, a] = t ? this.touchEvents : this.mouseEvents;
    this.domElement.addEventListener(s, (r) => {
      if (!(!this.enabled || !this.handler)) {
        r instanceof TouchEvent && r?.touches?.length > 1 && r.preventDefault(), this.handler.down(this.getEvent(r));
        for (const o of this.callbacks.down)
          o(this.handler.status);
      }
    }), this.domElement.addEventListener(i, (r) => {
      if (!(!this.enabled || !this.handler) && this.handler.pressed) {
        this.handler.move(this.getEvent(r));
        for (const o of this.callbacks.move)
          o(this.handler.status);
      }
    }), this.domElement.addEventListener(a, (r) => {
      if (!(!this.enabled || !this.handler)) {
        this.handler.up(this.getEvent(r));
        for (const o of this.callbacks.up)
          o(this.handler.status);
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
class U {
  timeStep;
  lastCallTime;
  maxSubSteps;
  world;
  constructor(e) {
    const { gravity: t = { x: 0, y: 0, z: 0 } } = e;
    this.timeStep = 1 / 60, this.lastCallTime = 0, this.maxSubSteps = 3, this.world = new R(), this.world.broadphase = new A(), this.world.gravity.set(t.x, t.y, t.z);
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
class M extends S {
  needResetState;
  constructor(e) {
    const { width: t, height: s, parentId: i, color: a, opacity: r, needResetState: o } = e;
    super(e), this.needResetState = o ?? !1, this.setSize(t, s, !1), this.setClearColor(a, r), i ? document.getElementById(i)?.append(this.domElement) : document.body.append(this.domElement);
  }
  resize(e, t) {
    this.setSize(e, t, !1);
  }
}
class B extends b {
  lights = [];
  constructor(e) {
    super();
    const { bg: t, fog: s, lights: i } = e;
    this.name = "root", t && this.addBackground(t), i && this.addLights(i), s && this.addFog(s);
  }
  addBackground(e) {
    this.background = new v(e);
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
        return new d(e.color, e.intensity);
      default:
        return new d("#ff0000", 1);
    }
  }
}
class u {
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
function F(n, e = {}) {
  const { position: t, rotation: s, scale: i, scaleFactor: a } = e;
  if (t) {
    const { x: r = 0, y: o = 0, z: l = 0 } = t;
    n.position.set(r, o, l);
  }
  if (s) {
    const { x: r = 0, y: o = 0, z: l = 0 } = s;
    n.rotation.set(r, o, l);
  }
  if (i) {
    const { x: r = 1, y: o = 1, z: l = 1 } = i;
    n.scale.set(r, o, l);
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
  if (!h(n) || !h(e))
    return e;
  const t = { ...n };
  for (const s in e)
    h(e[s]) && s in n ? t[s] = c(n[s], e[s]) : t[s] = e[s];
  return t;
}
function h(n) {
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
  clock = new k();
  onUpdate = new u();
  onResize = new u();
  init(e, t, s = {}) {
    const i = c(_, s), { scene: a, camera: r, renderer: o, physics: l } = i;
    this.scene = new B(a), this.camera = new O(r, this.scene), this.renderer = new M({ ...o, width: e, height: t }), this.input = new P(this.renderer.domElement), l && (this.physics = new U(l)), this.renderer.setAnimationLoop(this.update.bind(this)), this.resize(e, t), this.input.init(), o?.needResetState || this.onUpdate.add(this.render, this), window.addEventListener("resize", () => {
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
    this.baseUrl = e, this.storage = {}, this.loader = new D();
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
    this.baseUrl = e, this.storage = {}, this.loader = new C();
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
    const { clone: s = !1, flipY: i = !1, repeatX: a = 0, repeatY: r = a } = t;
    let o = this.storage[e];
    return o = s ? o.clone() : o, o.flipY = i, a && (o.repeat.set(a, r), o.wrapS = p, o.wrapT = p), o;
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
