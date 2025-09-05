import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

let renderer3d, scene3d, camera3d;
let ball1, ball2, ball3, ball4, ball5, ball6;
const dt = 0.0005;
let frameCount = 0;
let stepsPerFrame = 25;
let animationId = null;
let controls; 
const maxTrailPoints = 7500;
const trailPositions1 = [];
const trailPositions2 = [];
const trailPositions3 = [];
const trailPositions4 = [];
const trailPositions5 = [];
const trailPositions6 = [];

let running = true;
let trailSkip = 0;

let x1 = 1, y1 = 1, z1 = 1;
let x2 = 2, y2 = 3, z2 = 4;
let x3 = 2.5, y3 = 2, z3 = 3;
let x4 = 1.5, y4 = 0.5, z4 = 2;
let x5 = 0.5, y5 = 0.9, z5 = 1.25;
let x6 = 5, y6 = 5, z6 = 2;

const palettes = {
  r: ["#ff2200", "#cf7916", "#af6238", "#ffef5f", "#ff0000", "#fda32d"]
};

let initColors = palettes.r;

const trailGeometry1 = new THREE.BufferGeometry();
const trailMaterial1 = new THREE.LineBasicMaterial({ color: 0xffffff });
const trailLine1 = new THREE.Line(trailGeometry1, trailMaterial1);

const trailGeometry2 = new THREE.BufferGeometry();
const trailMaterial2 = new THREE.LineBasicMaterial({ color: 0xffffff });
const trailLine2 = new THREE.Line(trailGeometry2, trailMaterial2);

const trailGeometry3 = new THREE.BufferGeometry();
const trailMaterial3 = new THREE.LineBasicMaterial({ color: 0xffffff });
const trailLine3 = new THREE.Line(trailGeometry3, trailMaterial3);

const trailGeometry4 = new THREE.BufferGeometry();
const trailMaterial4 = new THREE.LineBasicMaterial({ color: 0xffffff });
const trailLine4 = new THREE.Line(trailGeometry4, trailMaterial4);

const trailGeometry5 = new THREE.BufferGeometry();
const trailMaterial5 = new THREE.LineBasicMaterial({ color: 0xffffff });
const trailLine5 = new THREE.Line(trailGeometry5, trailMaterial5);

const trailGeometry6 = new THREE.BufferGeometry();
const trailMaterial6 = new THREE.LineBasicMaterial({ color: 0xffffff });
const trailLine6 = new THREE.Line(trailGeometry6, trailMaterial6);

class ThreeDimensionalSystems {
  constructor() {
    this.choice = "lorenz";
    this.options = new Map([
      ["lorenz", (x, y, z) => this.lorenz(x, y, z)],
      ["rossler", (x, y, z) => this.rossler(x, y, z)],
      ["chen", (x, y, z) => this.chen(x, y, z)],
      ["thomas", (x, y, z) => this.thomas(x, y, z)],
      ["lu", (x, y, z) => this.lu(x, y, z)],
      ["dadras", (x, y, z) => this.dadras(x, y, z)],
      ["aizawa", (x, y, z) => this.aizawa(x, y, z)],
      ["halvorsen", (x, y, z) => this.halvorsen(x, y, z)],
      ["chenLee", (x, y, z) => this.chenLee(x, y, z)],
      ["newton", (x, y, z) => this.newton(x, y, z)],
      ["shimizu", (x, y, z) => this.shimizu(x, y, z)],
      ["arneodo", (x, y, z) => this.arneodo(x, y, z)],
      ["threeScroll", (x, y, z) => this.threeScroll(x, y, z)],
      ["dequanLi", (x, y, z) => this.dequanLi(x, y, z)],
      ["hoover", (x, y, z) => this.hoover(x, y, z)],

    ]);

         this.timeScales = new Map([
       ["lorenz", 1], ["rossler", 1], ["chen", 0.4], ["thomas", 10],
       ["lu", 1], ["dadras", 1], ["aizawa", 1], ["halvorsen", 1],
       ["chenLee", 1], ["newton", 7], ["shimizu", 7], ["arneodo", 3],
       ["threeScroll", 0.5], ["dequanLi", 0.15], ["hoover", 1]
     ]);

         this.initParams = new Map([
       ["lorenz", [10, 28, 8/3]], ["rossler", [0.2, 0.2, 5.7]],
       ["chen", [35, 3, 28]], ["thomas", [0, 0.208186, 0.5]],
       ["lu", [36, 3, 20]], ["dadras", [2, 0.5, 3]],
       ["aizawa", [0.95, 0.7, 0.6]], ["halvorsen", [1.4, 0, 0]],
       ["chenLee", [5, -10, -0.38]], ["newton", [0.4, 0.175, 0]],
       ["shimizu", [0.75, 0.428, 0]], ["arneodo", [5.5, 3.5, 1]],
       ["threeScroll", [40, 40, 20]], ["dequanLi", [40, 1.833, 0.16]],
       ["hoover", [1, 1, 1]]
     ]);

         this.params = new Map([
       ["lorenz", [10, 28, 8/3]], ["rossler", [0.2, 0.2, 5.7]],
       ["chen", [35, 3, 28]], ["thomas", [0, 0.208186, 0]],
       ["lu", [36, 3, 20]], ["dadras", [2, 0.5, 3]],
       ["aizawa", [0.95, 0.7, 0.6]], ["halvorsen", [1.4, 0, 0]],
       ["chenLee", [5, -10, -0.38]], ["newton", [0.4, 0.175, 0]],
       ["shimizu", [0.75, 0.428, 0]], ["arneodo", [5.5, 3.5, 1]],
       ["threeScroll", [40, 40, 20]], ["dequanLi", [40, 1.833, 0.16]],
       ["hoover", [1, 1, 1]]
     ]);

         this.renderScale = new Map([
       ["lorenz", 0.05], ["rossler", 0.25], ["chen", 0.048], ["thomas", 0.55],
       ["lu", 0.05], ["dadras", 0.3], ["aizawa", 1.5], ["halvorsen", 0.2],
       ["chenLee", 0.04], ["newton", 4], ["shimizu", 1], ["arneodo", 0.75],
       ["threeScroll", 0.015], ["dequanLi", 0.01], ["hoover", 0.3]
     ]);

    this.initialConditions = new Map([
      ["lorenz", [[1, 1, 1], [2, 3, 4], [2.5,2,3], [1.5, 3, 0], [0.5, 0.9, 1.25], [2, 0.9, 0.75]]],
      ["rossler", [[1, 1, 1], [2, 3, 4], [2.5, 2, 3], [1.5, 3, 0], [0.5, 0.9, 1.25], [2, 0.9, 0.75]]],
      ["chen", [[0.5, 1.5, 0], [0.11, 0.01, 0], [0.09, -0.01, 0], [1.5, 3, 0], [0.5, 0.9, 1.25], [2, 0.9, 0.75]]],
      ["thomas", [[0, 1, 4], [2, 3, 4], [2.5,2,3], [1.5, 3, 0], [0.5, 0.9, 1.25], [2, 0.9, 0.75]]],
      ["lu", [[0.5, 1.5, 0], [0.11, 0.01, 0], [0.09, -0.01, 0], [1.5, 3, 0], [0.5, 0.9, 1.25], [2, 0.9, 0.75]]],
      ["dadras", [[0.1, 0, 0], [0.2, 0, 0], [0.3, 0, 0], [1.5, 3, 0], [0.5, 0.9, 1.25], [2, 0.9, 0.75]]],
      ["aizawa", [[0.5, 1.5, 0], [0.11, 0.01, 0], [0.09, -0.01, 0], [1.5, 0.5, 1.1], [0.5, 0.9, 1.25], [0, 0.9, 0.75]]],
      ["halvorsen", [[-0.5, 2, 1], [2, 3, 4], [2.5,2,3], [1.5, 3, 0], [0.5, 0.9, 1.25], [2, 0.9, 0.75]]],
      ["chenLee", [[0, 0.4, 0.1], [-0.2, 0.4, 0.1], [-0.2, 0.5, 0.15], [-0.2, 0.52, 0.16], [-0.21, 0.53, 0.16], [-0.2, 0.53, 0.17]]],
      ["newton", [[0, 0.4, 0.1], [-0.2, 0.4, 0.1], [-0.2, 0.5, 0.15], [-0.2, 0.52, 0.16], [-0.21, 0.53, 0.16], [-0.2, 0.53, 0.17]]],
      ["shimizu", [[0, 0.4, 0.1], [-0.2, 0.4, 0.1], [-0.2, 0.5, 0.15], [-0.2, 0.52, 0.16], [-0.21, 0.53, 0.16], [-0.2, 0.53, 0.17]]],
      ["arneodo", [[0.5, 0.01, 0.2], [-0.2, 0.4, 0.1], [-0.2, 0.5, 0.15], [-0.2, 0.52, 0.16], [-0.21, 0.53, 0.16], [-0.2, 0.53, 0.17]]],
      ["threeScroll", [[0.5, 0.01, 0.2], [-0.2, 0.4, 0.1], [-0.2, 0.5, 0.15], [-0.2, 0.52, 0.16], [-0.21, 0.53, 0.16], [-0.2, 0.53, 0.17]]],
      ["dequanLi", [[0.5, 0.01, 0.2], [3, 0.4, 5], [1, 5, 0.15], [6, 5, 0.16], [5, 0.53, 3.6], [-0.2, 0.53, 1.7]]],
             ["hoover", [[0.1, 0.1, 0.1], [0.2, 0.2, 0.2], [0.3, 0.3, 0.3], [0.4, 0.4, 0.4], [0.5, 0.5, 0.5], [0.6, 0.6, 0.6]]]
    ]);
  }

  lorenz(x, y, z) {
    const [sigma, rho, beta] = this.params.get("lorenz");
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;
    return [dx, dy, dz];
  }

  rossler(x, y, z){
    const [a, b, c] = this.params.get("rossler");
    const dx = -y - z;
    const dy = x + a * y;
    const dz = b + z * (x - c);
    return [dx, dy, dz];
  }

  chen(x, y, z) {
    const [a,b,c] = this.params.get("chen");
    const dx = a * (y - x);
    const dy = (c-a)*x-x*z+c*y;
    const dz = x*y-b*z;
    return [dx, dy, dz];
  }

  thomas(x, y, z) {
    const [a, b, k] = this.params.get("thomas");
    const dx = Math.sin(y) - b*x;
    const dy = Math.sin(z) - b*y;
    const dz = Math.sin(x) - b*z;
    return [dx, dy, dz];
  }

  lu(x,y,z){
    const [a,b,c] = this.params.get("lu");
    const dx = a*(y-x);
    const dy = -x*z + c*y;
    const dz = x*y - b*z;
    return [dx, dy, dz];
  }

  dadras(x,y,z){
    const [a, b, c] = this.params.get("dadras");
    const dx = y -a*x;
    const dy = c*x-x*z+y;
    const dz = x*y -b*z;
    return [dx, dy, dz];
  }

  aizawa(x, y, z) {
    const d = 3.5, e = 0.25, f = 0.1;
    const [a, b, c] = this.params.get("aizawa");
    const dx = (z - b) * x - d * y;
    const dy = d*x + (z-b)*y;
    const dz = c + a*z - (z**3)/3 - (x**2 + y**2)*(1+e*z)+f*z*x**3;
    return [dx, dy, dz];
  }

  halvorsen(x, y, z) {
    const [a, b, c] = this.params.get("halvorsen");
    const dx = -a*x - 4*y - 4*z - y**2;
    const dy = -a*y -4*z - 4*x - z**2;
    const dz = -a*z- 4*x- 4*y - x**2;
    return [dx, dy, dz];
  }

  chenLee(x,y,z){
    const [a, b, c] = this.params.get("chenLee");
    const dx = a*x -y*z;
    const dy = b*y +x*z;
    const dz = c*z + (x*y)/3;
    return [dx, dy, dz];
  }

  newton(x,y,z){
    const [alpha, beta, lambda] = this.params.get("newton");
    const dx = -alpha*x +y+10*y*z;
    const dy = -x-0.4*y+5*x*z;
    const dz = beta*z-5*x*y;
    return [dx, dy, dz];
  }

  shimizu(x,y,z){
    const [alpha, beta, c] = this.params.get("shimizu");
    const dx = y;
    const dy = x*(1-z)-alpha*y;
    const dz = -beta*z + x**2;
    return [dx, dy, dz];
  }

  arneodo(x,y,z){
    const [alpha, beta, lambda] = this.params.get("arneodo");
    const dx = y
    const dy = z;
    const dz = -alpha*x-beta*y-z+lambda*x**3;
    return [dx, dy, dz];
  }

  threeScroll(x,y,z){
    const [a, b, c] = this.params.get("threeScroll");
    const d = 1.5, e = 10;
    const dx = a*(y-x)+d*z;
    const dy = b*x -x*z + c*y;
    const dz = x*y - e*z;
    return [dx, dy, dz];
  }

     dequanLi(x,y,z){
     const [a, b, c] = this.params.get("dequanLi");
     const d=0.65, e = 55, f = 20;
     const dx = a*(y-x)+c*x*z;
     const dy = e*x+f*y-x*z;
     const dz = b*z+x*y-d*x**2;
     return [dx, dy, dz];
   }

   hoover(x,y,z){
     const [a, b, c] = this.params.get("hoover");
     const dx = y;
     const dy = -x + y*z;
     const dz = a - y*y;
     return [dx, dy, dz];
   }





  eulerStep(x, y, z) {
    const fn = this.options.get(this.choice);
    const scale = this.timeScales.get(this.choice);
    const [dx, dy, dz] = fn(x, y, z);
    return [x + dx * dt * scale, y + dy * dt * scale, z + dz * dt * scale];
  }
}

const system = new ThreeDimensionalSystems();

function updateTrail(position, trailArray, trailGeometry) {
  trailArray.push(position.clone());
  if (trailArray.length > maxTrailPoints) {
    trailArray.shift();
  }

  const positionsArray = new Float32Array(trailArray.length * 3);
  trailArray.forEach((pos, i) => {
    positionsArray[i * 3] = pos.x;
    positionsArray[i * 3 + 1] = pos.y;
    positionsArray[i * 3 + 2] = pos.z;
  });

  trailGeometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));
  trailGeometry.setDrawRange(0, trailArray.length);
  trailGeometry.attributes.position.needsUpdate = true;
}

function clearTrail(trailArray, trailGeometry) {
  trailArray.length = 0;
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
  trailGeometry.setDrawRange(0, 0);
  trailGeometry.attributes.position.needsUpdate = true;
}

function reset(){
  [x1, y1, z1] = system.initialConditions.get(system.choice)[0];
  [x2, y2, z2] = system.initialConditions.get(system.choice)[1];
  [x3, y3, z3] = system.initialConditions.get(system.choice)[2];
  [x4, y4, z4] = system.initialConditions.get(system.choice)[3];
  [x5, y5, z5] = system.initialConditions.get(system.choice)[4];
  [x6, y6, z6] = system.initialConditions.get(system.choice)[5];

  clearTrail(trailPositions1, trailGeometry1);
  clearTrail(trailPositions2, trailGeometry2);
  clearTrail(trailPositions3, trailGeometry3);
  clearTrail(trailPositions4, trailGeometry4);
  clearTrail(trailPositions5, trailGeometry5);
  clearTrail(trailPositions6, trailGeometry6);
  running = true;
}

function animate() {
  animationId = requestAnimationFrame(animate);
  if (frameCount++ % 1 !== 0) return;
  
  if (frameCount % 60 === 0) {
    console.log("Animation running, frame:", frameCount);
  }

  if(running){

    for(let i = 0; i < stepsPerFrame; i++) {
      [x1, y1, z1] = system.eulerStep(x1, y1, z1);
      [x2, y2, z2] = system.eulerStep(x2, y2, z2);
      [x3, y3, z3] = system.eulerStep(x3, y3, z3);
      [x4, y4, z4] = system.eulerStep(x4, y4, z4);
      [x5, y5, z5] = system.eulerStep(x5, y5, z5);
      [x6, y6, z6] = system.eulerStep(x6, y6, z6);

      const scale = system.renderScale.get(system.choice);
      ball1.position.set(x1 * scale, y1 * scale, z1 * scale);
      ball2.position.set(x2 * scale, y2 * scale, z2 * scale);
      ball3.position.set(x3 * scale, y3 * scale, z3 * scale);
      ball4.position.set(x4 * scale, y4 * scale, z4 * scale);
      ball5.position.set(x5 * scale, y5 * scale, z5 * scale);
      ball6.position.set(x6 * scale, y6 * scale, z6 * scale);

      if (trailSkip++ % 3 === 0){
        updateTrail(ball1.position, trailPositions1, trailGeometry1);
        updateTrail(ball2.position, trailPositions2, trailGeometry2);
        updateTrail(ball3.position, trailPositions3, trailGeometry3);
        updateTrail(ball4.position, trailPositions4, trailGeometry4);
        updateTrail(ball5.position, trailPositions5, trailGeometry5);
        updateTrail(ball6.position, trailPositions6, trailGeometry6);
      }
    }
  }
  controls.update();
  renderer3d.render(scene3d, camera3d);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, THREE version:", THREE.REVISION);
  
  const canvas3d = document.getElementById("canvas3d");
  canvas3d.width = window.innerWidth;
  canvas3d.height = window.innerHeight;
  
  console.log("Canvas size:", canvas3d.width, "x", canvas3d.height);

  const height = canvas3d.height;
  const width = canvas3d.width;

  scene3d = new THREE.Scene();
  scene3d.background = new THREE.Color(0x000000);
  camera3d = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera3d.position.set(0.1, 0, 8);
  camera3d.up.set(0, 1, 0);
  camera3d.lookAt(0, 0, 0);

  renderer3d = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true });
  renderer3d.setSize(width, height);
  renderer3d.setPixelRatio(window.devicePixelRatio);

  controls = new TrackballControls(camera3d, renderer3d.domElement);
  controls.rotateSpeed = 2.1;
  controls.zoomSpeed = 1;
  controls.panSpeed = 0.8;
  controls.dynamicDampingFactor = 0.3;
  controls.noPan = false;
  controls.minDistance = 0.5;
  controls.maxDistance = 15;
  controls.target.set(0, 0, 0);
  controls.update();

  // Create spheres
  const geometry = new THREE.SphereGeometry(0.02, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const material2 = new THREE.MeshBasicMaterial({ color: 0xffffff });
  ball1 = new THREE.Mesh(geometry, material);
  ball2 = new THREE.Mesh(geometry, material2);
  const ball3Geometry = new THREE.SphereGeometry(0.02, 32, 32);
  const ball3Material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const ball4Geometry = new THREE.SphereGeometry(0.02, 32, 32);
  const ball4Material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const ball5Geometry = new THREE.SphereGeometry(0.02, 32, 32);
  const ball5Material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const ball6Geometry = new THREE.SphereGeometry(0.02, 32, 32);
  const ball6Material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  ball3 = new THREE.Mesh(ball3Geometry, ball3Material);
  ball4 = new THREE.Mesh(ball4Geometry, ball4Material);
  ball5 = new THREE.Mesh(ball5Geometry, ball5Material);
  ball6 = new THREE.Mesh(ball6Geometry, ball6Material);
  scene3d.add(ball1);
  scene3d.add(ball2);
  scene3d.add(ball3);
  scene3d.add(ball4);
  scene3d.add(ball5);
  scene3d.add(ball6);
  ball1.position.set(x1, y1, z1);
  ball2.position.set(x2, y2, z2);
  ball3.position.set(x3, y3, z3);
  ball4.position.set(x4, y4, z4);
  ball5.position.set(x5, y5, z5);
  ball6.position.set(x6, y6, z6);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene3d.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 2);
  scene3d.add(directionalLight);

  const gridXZ = new THREE.GridHelper(15, 15);
  scene3d.add(gridXZ);

  const gridYZ = new THREE.GridHelper(15, 15);
  gridYZ.rotation.z = Math.PI / 2;
  scene3d.add(gridYZ);

  const gridXY = new THREE.GridHelper(15, 15);
  gridXY.rotation.x = Math.PI / 2;
  scene3d.add(gridXY);
  gridXY.visible = false;

  scene3d.add(trailLine1);
  scene3d.add(trailLine2);
  scene3d.add(trailLine3);
  scene3d.add(trailLine4);
  scene3d.add(trailLine5);
  scene3d.add(trailLine6);

  const systemSelect = document.getElementById("system-select-3d");

  systemSelect.addEventListener("change", (e) => {
    const [p1Old, p2Old, p3Old] = system.initParams.get(system.choice);
    system.params.set(system.choice, [p1Old, p2Old, p3Old]);
    system.choice = e.target.value;
    reset();
  });

  [x1, y1, z1] = system.initialConditions.get(system.choice)[0];
  [x2, y2, z2] = system.initialConditions.get(system.choice)[1];
  [x3, y3, z3] = system.initialConditions.get(system.choice)[2];
  [x4, y4, z4] = system.initialConditions.get(system.choice)[3];
  [x5, y5, z5] = system.initialConditions.get(system.choice)[4];
  [x6, y6, z6] = system.initialConditions.get(system.choice)[5];

  console.log("Starting animation...");
  
  // Help button functionality
  const helpBtn = document.getElementById("help-btn");
  const helpModal = document.getElementById("help-modal");
  const closeBtn = document.querySelector(".close");
  
  helpBtn.addEventListener("click", () => {
    helpModal.style.display = "block";
  });
  
  closeBtn.addEventListener("click", () => {
    helpModal.style.display = "none";
  });
  
  window.addEventListener("click", (event) => {
    if (event.target === helpModal) {
      helpModal.style.display = "none";
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    canvas3d.width = window.innerWidth;
    canvas3d.height = window.innerHeight;
    
    camera3d.aspect = window.innerWidth / window.innerHeight;
    camera3d.updateProjectionMatrix();
    
    renderer3d.setSize(window.innerWidth, window.innerHeight);
  });
  
  try {
    animate();
  } catch (error) {
    console.error("Error starting animation:", error);
  }
});

// Global keyboard controls
window.addEventListener("keydown", (event) => {
  console.log("Main script: Key pressed:", event.key);
  switch(event.key.toLowerCase()) {
    case " ":
      event.preventDefault();
      if (typeof running !== 'undefined') {
        running = !running;
        console.log("Animation paused/resumed:", !running);
      }
      break;
    case "r":
      event.preventDefault();
      if (typeof camera3d !== 'undefined' && typeof controls !== 'undefined') {
        camera3d.position.set(0.1, 0, 8);  // Reset to original camera position
        camera3d.lookAt(0, 0, 0);
        controls.reset();
        console.log("Camera reset to original position");
      }
      break;
  }
});
