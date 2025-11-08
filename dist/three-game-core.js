import { PerspectiveCamera as l, Object3D as d, WebGLRenderer as p, Scene as u, Color as m, Fog as f, AmbientLight as h, HemisphereLight as w, DirectionalLight as v, Clock as g } from "three";
import { World as b, NaiveBroadphase as E } from "cannon-es";
function y(a, t) {
  let e, s;
  return (...i) => {
    s ? (clearTimeout(e), e = setTimeout(
      () => {
        Date.now() - s >= t && (a(...i), s = Date.now());
      },
      t - (Date.now() - s)
    )) : (a(...i), s = Date.now());
  };
}
class C extends l {
  wrapper;
  constructor(t, e) {
    const { fov: s, near: i, far: r, position: n, following: o } = t;
    super(s.portrait, 1, i, r), this.position.copy(n), this.userData.fov = s, this.wrapper = null, o && this.addWrapper(e, o);
  }
  addWrapper(t, e) {
    const { x: s = 0, y: i = 0, z: r = 0 } = e.position;
    this.wrapper = new d(), this.wrapper.position.set(s, i, r), this.wrapper.add(this), t.add(this.wrapper), this.lookAt(s, i, r);
  }
  resize(t, e) {
    const { fov: s } = this.userData;
    this.aspect = t / e, this.fov = this.aspect > 1 ? s.landscape : s.portrait, this.updateProjectionMatrix();
  }
}
class k {
  domElement;
  enabled = !1;
  handler = null;
  mouseEvents = ["mousedown", "mousemove", "mouseup"];
  touchEvents = ["touchstart", "touchmove", "touchend"];
  callbacks = { down: [], move: [], up: [] };
  constructor(t) {
    this.domElement = t;
  }
  init() {
    const e = "ontouchstart" in document.documentElement || navigator?.maxTouchPoints >= 1, [s, i, r] = e ? this.touchEvents : this.mouseEvents;
    this.domElement.addEventListener(s, (n) => {
      if (!(!this.enabled || !this.handler)) {
        n instanceof TouchEvent && n?.touches?.length > 1 && n.preventDefault(), this.handler.down(this.getEvent(n));
        for (const o of this.callbacks.down)
          o(this.handler.status);
      }
    }), this.domElement.addEventListener(i, (n) => {
      if (this.handler && this.handler.pressed) {
        this.handler.move(this.getEvent(n));
        for (const o of this.callbacks.move)
          o(this.handler.status);
      }
    }), this.domElement.addEventListener(r, (n) => {
      if (this.handler) {
        this.handler.up(this.getEvent(n));
        for (const o of this.callbacks.up)
          o(this.handler.status);
      }
    });
  }
  setHandler(t) {
    this.handler = t, this.enabled = !0;
  }
  getEvent(t) {
    return t instanceof TouchEvent ? t.changedTouches[0] : t;
  }
  onDown(t) {
    this.callbacks.down.push(t);
  }
  onMove(t) {
    this.callbacks.move.push(t);
  }
  onUp(t) {
    this.callbacks.up.push(t);
  }
}
class S {
  timeStep;
  lastCallTime;
  maxSubSteps;
  world;
  constructor(t) {
    const { gravity: e } = t;
    this.timeStep = 1 / 60, this.lastCallTime = 0, this.maxSubSteps = 3, this.world = new b(), this.world.broadphase = new E(), this.world.gravity.set(e.x, e.y, e.z);
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
class T extends p {
  constructor(t) {
    const { width: e, height: s, color: i, opacity: r, parentId: n } = t;
    super(t), this.setSize(e, s), this.setClearColor(i, r), document.getElementById(n)?.append(this.domElement);
  }
  resize(t, e) {
    this.setSize(t, e);
  }
}
class L extends u {
  lights = [];
  constructor(t) {
    super();
    const { bg: e, fog: s, lights: i } = t;
    this.name = "root", e && this.addBackground(e), i && this.addLights(i), s && this.addFog(s);
  }
  addBackground(t) {
    this.background = new m(t);
  }
  addFog(t) {
    const { color: e = "#ffffff", near: s = 1, far: i = 100 } = t;
    this.fog = new f(e, s, i);
  }
  addLights(t = []) {
    for (const e of t) {
      const { data: s } = e, i = this.createLightInstance(e);
      s?.position && i.position.copy(s.position), this.add(i), this.lights.push(i);
    }
  }
  createLightInstance(t) {
    switch (t.type) {
      case "directional":
        return new v(t.color, t.intensity);
      case "hemisphere":
        return new w(t.skyColor, t.groundColor, t.intensity);
      case "ambient":
        return new h(t.color, t.intensity);
      default:
        return new h("#ff0000", 1);
    }
  }
}
class z {
  scene;
  camera;
  renderer;
  physics;
  input;
  clock = new g();
  onUpdateCallbacks = [];
  init(t = 960, e = 960, s) {
    const { scene: i, camera: r, renderer: n, physics: o } = s;
    this.scene = new L(i), this.camera = new C(r, this.scene), this.renderer = new T({ ...n, width: t, height: e }), this.physics = new S(o), this.input = new k(this.renderer.domElement), this.renderer.setAnimationLoop(this.update.bind(this)), this.resize(t, e), this.input.init();
    const c = y(() => {
      this.resize(window.innerWidth, window.innerHeight);
    }, 1e3);
    window.addEventListener("resize", c);
  }
  onUpdate(t) {
    this.onUpdateCallbacks.push(t);
  }
  resize(t, e) {
    this.camera.resize(t, e), this.renderer.resize(t, e);
  }
  update(t) {
    this.physics.update(t), this.renderer.render(this.scene, this.camera);
    for (const e of this.onUpdateCallbacks)
      e(t, this.clock.getDelta());
  }
}
const I = new z();
export {
  I as core
};
