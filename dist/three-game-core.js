var l = Object.defineProperty;
var p = (a, e, t) => e in a ? l(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var n = (a, e, t) => p(a, typeof e != "symbol" ? e + "" : e, t);
import { PerspectiveCamera as u, Object3D as m, WebGLRenderer as f, Scene as w, Color as v, Fog as g, AmbientLight as d, HemisphereLight as b, DirectionalLight as E, Clock as y } from "three";
import { World as C, NaiveBroadphase as k } from "cannon-es";
class S extends u {
  constructor(t, i) {
    const { fov: s, near: o, far: r, position: h, following: c } = t;
    super(s.portrait, 1, o, r);
    n(this, "wrapper");
    this.position.copy(h), this.userData.fov = s, this.wrapper = null, c && this.addWrapper(i, c);
  }
  addWrapper(t, i) {
    const { x: s = 0, y: o = 0, z: r = 0 } = i.position;
    this.wrapper = new m(), this.wrapper.position.set(s, o, r), this.wrapper.add(this), t.add(this.wrapper), this.lookAt(s, o, r);
  }
  resize(t, i) {
    const { fov: s } = this.userData;
    this.aspect = t / i, this.fov = this.aspect > 1 ? s.landscape : s.portrait, this.updateProjectionMatrix();
  }
}
class T {
  constructor(e) {
    n(this, "domElement");
    n(this, "enabled", !1);
    n(this, "handler", null);
    n(this, "mouseEvents", ["mousedown", "mousemove", "mouseup"]);
    n(this, "touchEvents", ["touchstart", "touchmove", "touchend"]);
    n(this, "callbacks", { down: [], move: [], up: [] });
    this.domElement = e;
  }
  init() {
    const t = "ontouchstart" in document.documentElement || (navigator == null ? void 0 : navigator.maxTouchPoints) >= 1, [i, s, o] = t ? this.touchEvents : this.mouseEvents;
    this.domElement.addEventListener(i, (r) => {
      var h;
      if (!(!this.enabled || !this.handler)) {
        r instanceof TouchEvent && ((h = r == null ? void 0 : r.touches) == null ? void 0 : h.length) > 1 && r.preventDefault(), this.handler.down(this.getEvent(r));
        for (const c of this.callbacks.down)
          c(this.handler.status);
      }
    }), this.domElement.addEventListener(s, (r) => {
      if (this.handler && this.handler.pressed) {
        this.handler.move(this.getEvent(r));
        for (const h of this.callbacks.move)
          h(this.handler.status);
      }
    }), this.domElement.addEventListener(o, (r) => {
      if (this.handler) {
        this.handler.up(this.getEvent(r));
        for (const h of this.callbacks.up)
          h(this.handler.status);
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
class L {
  constructor(e) {
    n(this, "timeStep");
    n(this, "lastCallTime");
    n(this, "maxSubSteps");
    n(this, "world");
    const { gravity: t } = e;
    this.timeStep = 1 / 60, this.lastCallTime = 0, this.maxSubSteps = 3, this.world = new C(), this.world.broadphase = new k(), this.world.gravity.set(t.x, t.y, t.z);
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
class z extends f {
  constructor(e) {
    const { width: t, height: i, color: s, opacity: o, parentId: r } = e;
    super(e), this.setSize(t, i), this.setClearColor(s, o);
    const h = document.getElementById(r);
    h == null || h.append(this.domElement);
  }
  resize(e, t) {
    this.setSize(e, t);
  }
}
class x extends w {
  constructor(t) {
    super();
    n(this, "lights", []);
    const { bg: i, fog: s, lights: o } = t;
    this.name = "root", i && this.addBackground(i), o && this.addLights(o), s && this.addFog(s);
  }
  addBackground(t) {
    this.background = new v(t);
  }
  addFog(t) {
    const { color: i = "#ffffff", near: s = 1, far: o = 100 } = t;
    this.fog = new g(i, s, o);
  }
  addLights(t = []) {
    for (const i of t) {
      const { data: s } = i, o = this.createLightInstance(i);
      s != null && s.position && o.position.copy(s.position), this.add(o), this.lights.push(o);
    }
  }
  createLightInstance(t) {
    switch (t.type) {
      case "directional":
        return new E(t.color, t.intensity);
      case "hemisphere":
        return new b(t.skyColor, t.groundColor, t.intensity);
      case "ambient":
        return new d(t.color, t.intensity);
      default:
        return new d("#ff0000", 1);
    }
  }
}
function D(a, e) {
  let t, i;
  return (...s) => {
    i ? (clearTimeout(t), t = setTimeout(
      () => {
        Date.now() - i >= e && (a(...s), i = Date.now());
      },
      e - (Date.now() - i)
    )) : (a(...s), i = Date.now());
  };
}
class I {
  constructor() {
    n(this, "scene");
    n(this, "camera");
    n(this, "renderer");
    n(this, "physics");
    n(this, "input");
    n(this, "clock", new y());
    n(this, "onUpdateCallbacks", []);
  }
  init(e = 960, t = 960, i) {
    const { scene: s, camera: o, renderer: r, physics: h } = i;
    this.scene = new x(s), this.camera = new S(o, this.scene), this.renderer = new z({ ...r, width: e, height: t }), this.physics = new L(h), this.input = new T(this.renderer.domElement), this.renderer.setAnimationLoop(this.update.bind(this)), this.resize(e, t), this.input.init();
    const c = D(() => {
      this.resize(window.innerWidth, window.innerHeight);
    }, 1e3);
    window.addEventListener("resize", c);
  }
  onUpdate(e) {
    this.onUpdateCallbacks.push(e);
  }
  resize(e, t) {
    this.camera.resize(e, t), this.renderer.resize(e, t);
  }
  update(e) {
    this.physics.update(e), this.renderer.render(this.scene, this.camera);
    for (const t of this.onUpdateCallbacks)
      t(e, this.clock.getDelta());
  }
}
const H = new I();
export {
  H as core
};
