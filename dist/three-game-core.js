import { PerspectiveCamera as d, Object3D as u, WebGLRenderer as p, Scene as m, Color as f, Fog as w, AmbientLight as h, HemisphereLight as g, DirectionalLight as b, Clock as v, TextureLoader as S, RepeatWrapping as c } from "three";
import { World as E, NaiveBroadphase as y } from "cannon-es";
import { GLTFLoader as k } from "three/addons/loaders/GLTFLoader";
import * as C from "three/addons/utils/SkeletonUtils";
function T(a, e) {
  let t, s;
  return (...o) => {
    s ? (clearTimeout(t), t = setTimeout(
      () => {
        Date.now() - s >= e && (a(...o), s = Date.now());
      },
      e - (Date.now() - s)
    )) : (a(...o), s = Date.now());
  };
}
class L extends d {
  wrapper;
  constructor(e, t) {
    const { fov: s, near: o, far: n, position: i, following: r } = e;
    super(s.portrait, 1, o, n), this.position.copy(i), this.userData.fov = s, this.wrapper = null, r && this.addWrapper(t, r);
  }
  addWrapper(e, t) {
    const { x: s = 0, y: o = 0, z: n = 0 } = t.position;
    this.wrapper = new u(), this.wrapper.position.set(s, o, n), this.wrapper.add(this), e.add(this.wrapper), this.lookAt(s, o, n);
  }
  resize(e, t) {
    const { fov: s } = this.userData;
    this.aspect = e / t, this.fov = this.aspect > 1 ? s.landscape : s.portrait, this.updateProjectionMatrix();
  }
}
class x {
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
    const t = "ontouchstart" in document.documentElement || navigator?.maxTouchPoints >= 1, [s, o, n] = t ? this.touchEvents : this.mouseEvents;
    this.domElement.addEventListener(s, (i) => {
      if (!(!this.enabled || !this.handler)) {
        i instanceof TouchEvent && i?.touches?.length > 1 && i.preventDefault(), this.handler.down(this.getEvent(i));
        for (const r of this.callbacks.down)
          r(this.handler.status);
      }
    }), this.domElement.addEventListener(o, (i) => {
      if (this.handler && this.handler.pressed) {
        this.handler.move(this.getEvent(i));
        for (const r of this.callbacks.move)
          r(this.handler.status);
      }
    }), this.domElement.addEventListener(n, (i) => {
      if (this.handler) {
        this.handler.up(this.getEvent(i));
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
class z {
  timeStep;
  lastCallTime;
  maxSubSteps;
  world;
  constructor(e) {
    const { gravity: t } = e;
    this.timeStep = 1 / 60, this.lastCallTime = 0, this.maxSubSteps = 3, this.world = new E(), this.world.broadphase = new y(), this.world.gravity.set(t.x, t.y, t.z);
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
class U extends p {
  resetStateBeforeUpdate;
  constructor(e) {
    const {
      width: t,
      height: s,
      parentId: o,
      color: n = "#333333",
      opacity: i = 1,
      resetStateBeforeUpdate: r = !1
    } = e;
    super(e), this.resetStateBeforeUpdate = r, this.setSize(t, s), this.setClearColor(n, i), document.getElementById(o)?.append(this.domElement);
  }
  resize(e, t) {
    this.setSize(e, t);
  }
}
class D extends m {
  lights = [];
  constructor(e) {
    super();
    const { bg: t, fog: s, lights: o } = e;
    this.name = "root", t && this.addBackground(t), o && this.addLights(o), s && this.addFog(s);
  }
  addBackground(e) {
    this.background = new f(e);
  }
  addFog(e) {
    const { color: t = "#ffffff", near: s = 1, far: o = 100 } = e;
    this.fog = new w(t, s, o);
  }
  addLights(e = []) {
    for (const t of e) {
      const { data: s } = t, o = this.createLightInstance(t);
      s?.position && o.position.copy(s.position), this.add(o), this.lights.push(o);
    }
  }
  createLightInstance(e) {
    switch (e.type) {
      case "directional":
        return new b(e.color, e.intensity);
      case "hemisphere":
        return new g(e.skyColor, e.groundColor, e.intensity);
      case "ambient":
        return new h(e.color, e.intensity);
      default:
        return new h("#ff0000", 1);
    }
  }
}
class A {
  scene;
  camera;
  renderer;
  physics;
  input;
  clock = new v();
  onUpdateCallbacks = [];
  onResizeCallbacks = [];
  init(e = 960, t = 960, s) {
    const { scene: o, camera: n, renderer: i, physics: r } = s;
    this.scene = new D(o), this.camera = new L(n, this.scene), this.renderer = new U({ ...i, width: e, height: t }), this.physics = new z(r), this.input = new x(this.renderer.domElement), this.renderer.setAnimationLoop(this.update.bind(this)), this.resize(e, t), this.input.init();
    const l = T(() => {
      this.resize(window.innerWidth, window.innerHeight);
    }, 1e3);
    window.addEventListener("resize", l);
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
  update(e) {
    this.physics.update(e), this.renderer.resetStateBeforeUpdate && this.renderer.resetState(), this.renderer.render(this.scene, this.camera);
    for (const t of this.onUpdateCallbacks)
      t(e, this.clock.getDelta());
  }
}
class B {
  baseUrl;
  storage;
  loader;
  constructor(e) {
    this.baseUrl = e, this.storage = {}, this.loader = new k();
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
    return s.getObjectByProperty("type", "SkinnedMesh") ? C.clone(o) : o.clone();
  }
  getAnimation(e, t = 0) {
    return this.storage[e].animations[t];
  }
  getAnimations(e, t) {
    const s = this.storage[e].animations;
    return t ? s.filter((o) => o.name.includes(t)) : s;
  }
}
class P {
  baseUrl;
  storage;
  loader;
  constructor(e) {
    this.baseUrl = e, this.storage = {}, this.loader = new S();
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
      repeatY: i = n
    } = t;
    let r = this.storage[e];
    return r = s ? r.clone() : r, r.flipY = o, n && (r.repeat.set(n, i), r.wrapS = c, r.wrapT = c), r;
  }
}
class R {
  models;
  textures;
  constructor() {
    this.models = new B("./src/assets/models/"), this.textures = new P("./src/assets/textures/");
  }
  async load({ models: e, textures: t }) {
    await Promise.allSettled([
      this.models.loadAll(e),
      this.textures.loadAll(t)
    ]), console.log("MODELS:", this.models.storage), console.log("TEXTURES:", this.textures.storage);
  }
}
const j = new R(), F = new A();
export {
  j as assets,
  F as core
};
