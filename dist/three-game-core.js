import { PerspectiveCamera as m, Object3D as g, WebGLRenderer as w, Scene as y, Color as S, Fog as b, AmbientLight as h, HemisphereLight as z, DirectionalLight as x, Box3 as L, Vector3 as R, Clock as A, TextureLoader as j, RepeatWrapping as p } from "three";
import { GLTFLoader as k } from "three/addons/loaders/GLTFLoader";
import * as C from "three/addons/utils/SkeletonUtils";
class O extends m {
  wrapper;
  constructor(e, t) {
    const { fov: s, near: r, far: o, position: a, wrapper: n } = e;
    super(s.portrait, 1, r, o), this.position.copy(a), this.userData.fov = s, this.wrapper = null, n && this.addWrapper(t, n);
  }
  addWrapper(e, t) {
    const { x: s = 0, y: r = 0, z: o = 0 } = t.position;
    this.wrapper = new g(), this.wrapper.position.set(s, r, o), this.wrapper.add(this), e.add(this.wrapper), this.lookAt(s, r, o);
  }
  resize(e, t) {
    const { fov: s } = this.userData;
    this.aspect = e / t, this.fov = this.aspect > 1 ? s.landscape : s.portrait, this.updateProjectionMatrix();
  }
}
class f {
  listeners = [];
  add(e, t) {
    this.listeners.push(t ? e.bind(t) : e);
  }
  addOnce(e, t) {
    const s = this.listeners.length, r = (...o) => {
      t ? e.call(t, ...o) : e(...o), this.listeners.splice(s, 1);
    };
    this.listeners.push(r);
  }
  remove() {
    this.listeners = [];
  }
  dispatch(...e) {
    for (const t of this.listeners)
      t(...e);
  }
}
class v extends w {
  needResetState;
  constructor(e) {
    const { width: t, height: s, parentId: r, color: o, opacity: a, needResetState: n } = e;
    super(e), this.needResetState = n ?? !1, this.setSize(t, s, !1), this.setClearColor(o, a), r ? document.getElementById(r)?.append(this.domElement) : document.body.append(this.domElement);
  }
  resize(e, t) {
    this.setSize(e, t, !1);
  }
}
class E extends y {
  lights = [];
  constructor(e) {
    super();
    const { bg: t, fog: s, lights: r } = e;
    this.name = "root", t && this.addBackground(t), r && this.addLights(r), s && this.addFog(s);
  }
  addBackground(e) {
    this.background = new S(e);
  }
  addFog(e) {
    const { color: t = "#ffffff", near: s = 1, far: r = 100 } = e;
    this.fog = new b(t, s, r);
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
        return new x(e.color, e.intensity);
      case "hemisphere":
        return new z(e.skyColor, e.groundColor, e.intensity);
      case "ambient":
        return new h(e.color, e.intensity);
      default:
        return new h("#ff0000", 1);
    }
  }
}
const T = {
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
function U(i, e = {}) {
  const { position: t, rotation: s, scale: r, scaleFactor: o } = e;
  if (t) {
    const { x: a = 0, y: n = 0, z: c = 0 } = t;
    i.position.set(a, n, c);
  }
  if (s) {
    const { x: a = 0, y: n = 0, z: c = 0 } = s;
    i.rotation.set(a, n, c);
  }
  if (r) {
    const { x: a = 1, y: n = 1, z: c = 1 } = r;
    i.scale.set(a, n, c);
  }
  o && i.scale.multiplyScalar(o);
}
function d(i, e) {
  if (!l(i) || !l(e))
    return e;
  const t = { ...i };
  for (const s in e)
    l(e[s]) && s in i ? t[s] = d(i[s], e[s]) : t[s] = e[s];
  return t;
}
function l(i) {
  return i && typeof i == "object" && !Array.isArray(i);
}
function M(i) {
  const e = new L().setFromObject(i), t = new R();
  return e.getSize(t), t;
}
function u(i = 1024) {
  const e = window.innerWidth / window.innerHeight;
  return e > 1 ? {
    width: i,
    height: Math.round(i / e)
  } : {
    width: Math.round(i * e),
    height: i
  };
}
const _ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyTransform: U,
  deepMerge: d,
  getObjectSize: M,
  getScreenSize: u
}, Symbol.toStringTag, { value: "Module" }));
class P {
  scene;
  camera;
  renderer;
  clock = new A();
  onUpdate = new f();
  onResize = new f();
  init(e, t, s = {}) {
    const r = d(T, s);
    this.scene = new E(r.scene), this.camera = new O(r.camera, this.scene), this.renderer = new v({ ...r.renderer, width: e, height: t }), this.renderer.setAnimationLoop(this.update.bind(this)), this.resize(e, t), r.renderer?.needResetState || this.onUpdate.add(this.render, this), window.addEventListener("resize", () => {
      const { width: o, height: a } = u();
      this.resize(o, a);
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
  loader = new k();
  constructor(e) {
    this.baseUrl = e;
  }
  loadAll(e = []) {
    return Promise.allSettled(e.map(this.load, this));
  }
  load({ key: e, file: t }) {
    return new Promise((s) => {
      this.loader.load(t, (r) => {
        s(r), this.storage[e] = {
          model: r.scene,
          animations: r.animations
        };
      });
    });
  }
  get(e, t) {
    const { model: s } = this.storage[e], r = t ? s.getObjectByName(t) : s;
    if (!r)
      throw new Error(`no mesh named ${e} found`);
    return s.getObjectByProperty("type", "SkinnedMesh") ? C.clone(r) : r.clone();
  }
  getAnimation(e, t = 0) {
    return this.storage[e].animations[t];
  }
  getAnimations(e, t) {
    const s = this.storage[e].animations;
    return t ? s.filter((r) => r.name.includes(t)) : s;
  }
}
class D {
  baseUrl;
  storage = {};
  loader = new j();
  constructor(e) {
    this.baseUrl = e;
  }
  loadAll(e = []) {
    return Promise.allSettled(e.map(this.load, this));
  }
  load({ key: e, file: t }) {
    return new Promise((s) => {
      this.loader.load(t, (r) => {
        s(r), this.storage[e] = r;
      });
    });
  }
  get(e, t = {}) {
    const { clone: s = !1, flipY: r = !1, repeatX: o = 0, repeatY: a = o } = t;
    let n = this.storage[e];
    if (!n)
      throw new Error(`no texture named ${e} found`);
    return n = s ? n.clone() : n, n.flipY = r, o && (n.repeat.set(o, a), n.wrapS = p, n.wrapT = p), n;
  }
}
class F {
  models;
  textures;
  constructor() {
    this.models = new B("./src/assets/models/"), this.textures = new D("./src/assets/textures/");
  }
  async load({ models: e, textures: t }) {
    await Promise.allSettled([
      this.models.loadAll(e),
      this.textures.loadAll(t)
    ]), console.log("MODELS:", this.models.storage), console.log("TEXTURES:", this.textures.storage);
  }
}
const $ = new F(), G = new P();
export {
  f as Signal,
  $ as assets,
  G as core,
  _ as utils
};
