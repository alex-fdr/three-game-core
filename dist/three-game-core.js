import { PerspectiveCamera as u, Object3D as m, WebGLRenderer as f, Scene as g, Color as w, Fog as b, AmbientLight as c, HemisphereLight as v, DirectionalLight as y, Clock as S, TextureLoader as E, RepeatWrapping as d } from "three";
import { World as k, NaiveBroadphase as x } from "cannon-es";
import { GLTFLoader as C } from "three/addons/loaders/GLTFLoader";
import * as L from "three/addons/utils/SkeletonUtils";
class T extends u {
  wrapper;
  constructor(e, t) {
    const { fov: s, near: i, far: a, position: n, wrapper: o } = e;
    super(s.portrait, 1, i, a), this.position.copy(n), this.userData.fov = s, this.wrapper = null, o && this.addWrapper(t, o);
  }
  addWrapper(e, t) {
    const { x: s = 0, y: i = 0, z: a = 0 } = t.position;
    this.wrapper = new m(), this.wrapper.position.set(s, i, a), this.wrapper.add(this), e.add(this.wrapper), this.lookAt(s, i, a);
  }
  resize(e, t) {
    const { fov: s } = this.userData;
    this.aspect = e / t, this.fov = this.aspect > 1 ? s.landscape : s.portrait, this.updateProjectionMatrix();
  }
}
class z {
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
    this.domElement.addEventListener(s, (n) => {
      if (!(!this.enabled || !this.handler)) {
        n instanceof TouchEvent && n?.touches?.length > 1 && n.preventDefault(), this.handler.down(this.getEvent(n));
        for (const o of this.callbacks.down)
          o(this.handler.status);
      }
    }), this.domElement.addEventListener(i, (n) => {
      if (!(!this.enabled || !this.handler) && this.handler.pressed) {
        this.handler.move(this.getEvent(n));
        for (const o of this.callbacks.move)
          o(this.handler.status);
      }
    }), this.domElement.addEventListener(a, (n) => {
      if (!(!this.enabled || !this.handler)) {
        this.handler.up(this.getEvent(n));
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
class R {
  timeStep;
  lastCallTime;
  maxSubSteps;
  world;
  constructor(e) {
    const {
      gravity: t = { x: 0, y: 0, z: 0 }
    } = e;
    this.timeStep = 1 / 60, this.lastCallTime = 0, this.maxSubSteps = 3, this.world = new k(), this.world.broadphase = new x(), this.world.gravity.set(t.x, t.y, t.z);
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
class A extends f {
  needResetState;
  constructor(e) {
    const { width: t, height: s, parentId: i, color: a, opacity: n, needResetState: o } = e;
    super(e), this.needResetState = o ?? !1, this.setSize(t, s, !1), this.setClearColor(a, n), i ? document.getElementById(i)?.append(this.domElement) : document.body.append(this.domElement);
  }
  resize(e, t) {
    this.setSize(e, t, !1);
  }
}
class U extends g {
  lights = [];
  constructor(e) {
    super();
    const { bg: t, fog: s, lights: i } = e;
    this.name = "root", t && this.addBackground(t), i && this.addLights(i), s && this.addFog(s);
  }
  addBackground(e) {
    this.background = new w(e);
  }
  addFog(e) {
    const { color: t = "#ffffff", near: s = 1, far: i = 100 } = e;
    this.fog = new b(t, s, i);
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
        return new y(e.color, e.intensity);
      case "hemisphere":
        return new v(e.skyColor, e.groundColor, e.intensity);
      case "ambient":
        return new c(e.color, e.intensity);
      default:
        return new c("#ff0000", 1);
    }
  }
}
function p(r, e) {
  if (!h(r) || !h(e))
    return e;
  const t = { ...r };
  for (const s in e)
    h(e[s]) && s in r ? t[s] = p(r[s], e[s]) : t[s] = e[s];
  return t;
}
function h(r) {
  return r && typeof r == "object" && !Array.isArray(r);
}
const P = {
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
class D {
  scene;
  camera;
  renderer;
  physics;
  input;
  clock = new S();
  onUpdateCallbacks = [];
  onResizeCallbacks = [];
  init(e = 1024, t = 1024, s = {}) {
    const i = p(P, s), { scene: a, camera: n, renderer: o, physics: l } = i;
    this.scene = new U(a), this.camera = new T(n, this.scene), this.renderer = new A({ ...o, width: e, height: t }), this.input = new z(this.renderer.domElement), l && (this.physics = new R(l)), this.renderer.setAnimationLoop(this.update.bind(this)), this.resize(e, t), this.input.init(), o?.needResetState || this.onUpdate(() => this.render());
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
    this.physics?.update(e);
    for (const t of this.onUpdateCallbacks)
      t(e, this.clock.getDelta());
  }
}
class B {
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
    return s.getObjectByProperty("type", "SkinnedMesh") ? L.clone(i) : i.clone();
  }
  getAnimation(e, t = 0) {
    return this.storage[e].animations[t];
  }
  getAnimations(e, t) {
    const s = this.storage[e].animations;
    return t ? s.filter((i) => i.name.includes(t)) : s;
  }
}
class I {
  baseUrl;
  storage;
  loader;
  constructor(e) {
    this.baseUrl = e, this.storage = {}, this.loader = new E();
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
    const {
      clone: s = !1,
      flipY: i = !1,
      repeatX: a = 0,
      repeatY: n = a
    } = t;
    let o = this.storage[e];
    return o = s ? o.clone() : o, o.flipY = i, a && (o.repeat.set(a, n), o.wrapS = d, o.wrapT = d), o;
  }
}
class j {
  models;
  textures;
  constructor() {
    this.models = new B("./src/assets/models/"), this.textures = new I("./src/assets/textures/");
  }
  async load({ models: e, textures: t }) {
    await Promise.allSettled([
      this.models.loadAll(e),
      this.textures.loadAll(t)
    ]), console.log("MODELS:", this.models.storage), console.log("TEXTURES:", this.textures.storage);
  }
}
const O = new j(), G = new D();
export {
  O as assets,
  G as core
};
