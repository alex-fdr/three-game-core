var m = Object.defineProperty;
var w = (i, e, t) => e in i ? m(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var r = (i, e, t) => w(i, typeof e != "symbol" ? e + "" : e, t);
import { Box3 as g, Vector3 as b, PerspectiveCamera as y, Object3D as S, WebGLRenderer as v, Scene as E, Color as x, Fog as T, AmbientLight as u, HemisphereLight as z, DirectionalLight as k, Clock as C, TextureLoader as L, RepeatWrapping as f } from "three";
import { World as R, NaiveBroadphase as A } from "cannon-es";
import { GLTFLoader as D } from "three/addons/loaders/GLTFLoader";
import * as U from "three/addons/utils/SkeletonUtils";
function j(i, e = {}) {
  const { position: t, rotation: s, scale: n, scaleFactor: l } = e;
  if (t) {
    const { x: a = 0, y: o = 0, z: h = 0 } = t;
    i.position.set(a, o, h);
  }
  if (s) {
    const { x: a = 0, y: o = 0, z: h = 0 } = s;
    i.rotation.set(a, o, h);
  }
  if (n) {
    const { x: a = 1, y: o = 1, z: h = 1 } = n;
    i.scale.set(a, o, h);
  }
  l && i.scale.multiplyScalar(l);
}
function P(i) {
  const e = new g().setFromObject(i), t = new b();
  return e.getSize(t), t;
}
function M(i = 1024) {
  const e = window.innerWidth / window.innerHeight;
  return e > 1 ? {
    width: i,
    height: Math.round(i / e)
  } : {
    width: Math.round(i * e),
    height: i
  };
}
function O(i, e) {
  let t, s;
  return (...n) => {
    s ? (clearTimeout(t), t = setTimeout(
      () => {
        Date.now() - s >= e && (i(...n), s = Date.now());
      },
      e - (Date.now() - s)
    )) : (i(...n), s = Date.now());
  };
}
function p(i, e) {
  if (!d(i) || !d(e))
    return e;
  const t = { ...i };
  for (const s in e)
    d(e[s]) && s in i ? t[s] = p(i[s], e[s]) : t[s] = e[s];
  return t;
}
function d(i) {
  return i && typeof i == "object" && !Array.isArray(i);
}
const K = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyTransform: j,
  deepMerge: p,
  getObjectSize: P,
  getScreenSize: M,
  throttleTrailing: O
}, Symbol.toStringTag, { value: "Module" }));
class B extends y {
  constructor(t, s) {
    const { fov: n, near: l, far: a, position: o, wrapper: h } = t;
    super(n.portrait, 1, l, a);
    r(this, "wrapper");
    this.position.copy(o), this.userData.fov = n, this.wrapper = null, h && this.addWrapper(s, h);
  }
  addWrapper(t, s) {
    const { x: n = 0, y: l = 0, z: a = 0 } = s.position;
    this.wrapper = new S(), this.wrapper.position.set(n, l, a), this.wrapper.add(this), t.add(this.wrapper), this.lookAt(n, l, a);
  }
  resize(t, s) {
    const { fov: n } = this.userData;
    this.aspect = t / s, this.fov = this.aspect > 1 ? n.landscape : n.portrait, this.updateProjectionMatrix();
  }
}
class F {
  constructor(e) {
    r(this, "domElement");
    r(this, "enabled", !1);
    r(this, "handler", null);
    r(this, "mouseEvents", ["mousedown", "mousemove", "mouseup"]);
    r(this, "touchEvents", ["touchstart", "touchmove", "touchend"]);
    r(this, "callbacks", { down: [], move: [], up: [] });
    this.domElement = e;
  }
  init() {
    const t = "ontouchstart" in document.documentElement || (navigator == null ? void 0 : navigator.maxTouchPoints) >= 1, [s, n, l] = t ? this.touchEvents : this.mouseEvents;
    this.domElement.addEventListener(s, (a) => {
      var o;
      if (!(!this.enabled || !this.handler)) {
        a instanceof TouchEvent && ((o = a == null ? void 0 : a.touches) == null ? void 0 : o.length) > 1 && a.preventDefault(), this.handler.down(this.getEvent(a));
        for (const h of this.callbacks.down)
          h(this.handler.status);
      }
    }), this.domElement.addEventListener(n, (a) => {
      if (!(!this.enabled || !this.handler) && this.handler.pressed) {
        this.handler.move(this.getEvent(a));
        for (const o of this.callbacks.move)
          o(this.handler.status);
      }
    }), this.domElement.addEventListener(l, (a) => {
      if (!(!this.enabled || !this.handler)) {
        this.handler.up(this.getEvent(a));
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
class I {
  constructor(e) {
    r(this, "timeStep");
    r(this, "lastCallTime");
    r(this, "maxSubSteps");
    r(this, "world");
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
class W extends v {
  constructor(t) {
    const { width: s, height: n, parentId: l, color: a, opacity: o, needResetState: h } = t;
    super(t);
    r(this, "needResetState");
    if (this.needResetState = h ?? !1, this.setSize(s, n, !1), this.setClearColor(a, o), l) {
      const c = document.getElementById(l);
      c == null || c.append(this.domElement);
    } else
      document.body.append(this.domElement);
  }
  resize(t, s) {
    this.setSize(t, s, !1);
  }
}
class _ extends E {
  constructor(t) {
    super();
    r(this, "lights", []);
    const { bg: s, fog: n, lights: l } = t;
    this.name = "root", s && this.addBackground(s), l && this.addLights(l), n && this.addFog(n);
  }
  addBackground(t) {
    this.background = new x(t);
  }
  addFog(t) {
    const { color: s = "#ffffff", near: n = 1, far: l = 100 } = t;
    this.fog = new T(s, n, l);
  }
  addLights(t = []) {
    for (const s of t) {
      const n = this.createLightInstance(s);
      "data" in s && "position" in s.data && n.position.copy(s.data.position), this.add(n), this.lights.push(n);
    }
  }
  createLightInstance(t) {
    switch (t.type) {
      case "directional":
        return new k(t.color, t.intensity);
      case "hemisphere":
        return new z(t.skyColor, t.groundColor, t.intensity);
      case "ambient":
        return new u(t.color, t.intensity);
      default:
        return new u("#ff0000", 1);
    }
  }
}
const G = {
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
class H {
  constructor() {
    r(this, "scene");
    r(this, "camera");
    r(this, "renderer");
    r(this, "physics");
    r(this, "input");
    r(this, "clock", new C());
    r(this, "onUpdateCallbacks", []);
    r(this, "onResizeCallbacks", []);
  }
  init(e, t, s = {}) {
    const n = p(G, s), { scene: l, camera: a, renderer: o, physics: h } = n;
    this.scene = new _(l), this.camera = new B(a, this.scene), this.renderer = new W({ ...o, width: e, height: t }), this.input = new F(this.renderer.domElement), h && (this.physics = new I(h)), this.renderer.setAnimationLoop(this.update.bind(this)), this.resize(e, t), this.input.init(), o != null && o.needResetState || this.onUpdate(() => this.render());
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
    var t;
    (t = this.physics) == null || t.update(e);
    for (const s of this.onUpdateCallbacks)
      s(e, this.clock.getDelta());
  }
}
class Y {
  constructor(e) {
    r(this, "baseUrl");
    r(this, "storage");
    r(this, "loader");
    this.baseUrl = e, this.storage = {}, this.loader = new D();
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
    return s.getObjectByProperty("type", "SkinnedMesh") ? U.clone(n) : n.clone();
  }
  getAnimation(e, t = 0) {
    return this.storage[e].animations[t];
  }
  getAnimations(e, t) {
    const s = this.storage[e].animations;
    return t ? s.filter((n) => n.name.includes(t)) : s;
  }
}
class $ {
  constructor(e) {
    r(this, "baseUrl");
    r(this, "storage");
    r(this, "loader");
    this.baseUrl = e, this.storage = {}, this.loader = new L();
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
    const { clone: s = !1, flipY: n = !1, repeatX: l = 0, repeatY: a = l } = t;
    let o = this.storage[e];
    return o = s ? o.clone() : o, o.flipY = n, l && (o.repeat.set(l, a), o.wrapS = f, o.wrapT = f), o;
  }
}
class X {
  constructor() {
    r(this, "models");
    r(this, "textures");
    this.models = new Y("./src/assets/models/"), this.textures = new $("./src/assets/textures/");
  }
  async load({ models: e, textures: t }) {
    await Promise.allSettled([
      this.models.loadAll(e),
      this.textures.loadAll(t)
    ]), console.log("MODELS:", this.models.storage), console.log("TEXTURES:", this.textures.storage);
  }
}
const Q = new X(), Z = new H();
export {
  Q as assets,
  Z as core,
  K as utils
};
