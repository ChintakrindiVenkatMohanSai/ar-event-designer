/* DEVICE DETECTION */
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const isHTTPS = location.protocol === "https:";

const scene = document.querySelector("#scene");
const camera = document.querySelector("#camera");

/* MODE SWITCH */
if (isMobile && isHTTPS) {
  scene.setAttribute("arjs", "sourceType: webcam; debugUIEnabled: false");
  camera.setAttribute("position", "0 1.6 0");

  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="mode-label">📱 AR Mode</div>`
  );
} else {
  camera.setAttribute("look-controls", "enabled: true");
  camera.setAttribute("wasd-controls", "enabled: true");

  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="mode-label">🖥️ 3D Preview Mode</div>`
  );
}

/* ELEMENTS */
const walls = [
  document.querySelector("#wall1"),
  document.querySelector("#wall2"),
  document.querySelector("#wall3")
];
const floor = document.querySelector("#floor");
const stage = document.querySelector("#stage");
const ambientLight = document.querySelector("#ambientLight");
const spotLight = document.querySelector("#spotLight");

let weddingInterval = null;

/* WALL */
function setWallColor(color) {
  walls.forEach(w => w.setAttribute("material", `color:${color}; roughness:0.8`));
}

function setWallMaterial(type) {
  const mat = {
    matte: "roughness:0.9; metalness:0",
    glossy: "roughness:0.2; metalness:0.3",
    fabric: "roughness:0.95; metalness:0.05"
  };
  walls.forEach(w => w.setAttribute("material", mat[type]));
}

/* FLOOR */
function setFloor(type) {
  floor.setAttribute(
    "material",
    type === "matte"
      ? "color:#dfe6e9; roughness:0.9"
      : "color:#b2bec3; roughness:0.2"
  );
}

/* STAGE */
function setStage(type) {
  stage.setAttribute(
    "material",
    type === "normal"
      ? "color:#2d3436"
      : "color:#6c5ce7; emissive:#a29bfe"
  );
}

/* LIGHT */
function setLight(v) {
  ambientLight.setAttribute("light", `intensity:${v}`);
}

/* EVENTS */
function normalMode() {
  clearInterval(weddingInterval);
  spotLight.setAttribute("light", "intensity:0");
}

function weddingMode() {
  clearInterval(weddingInterval);
  spotLight.setAttribute("light", "type:spot; intensity:2; angle:45");
  spotLight.setAttribute("position", "0 3 -2");

  let hue = 0;
  weddingInterval = setInterval(() => {
    hue = (hue + 2) % 360;
    walls.forEach(w =>
      w.setAttribute(
        "material",
        `color:hsl(${hue},70%,85%); emissive:hsl(${hue},70%,60%)`
      )
    );
  }, 120);
}

/* SAVE / LOAD */
function saveDesign() {
  const data = {
    wall: walls[0].getAttribute("material"),
    floor: floor.getAttribute("material"),
    stage: stage.getAttribute("material"),
    light: ambientLight.getAttribute("light")
  };
  localStorage.setItem("ar_design", JSON.stringify(data));
  alert("Design saved");
}

function loadDesign() {
  const data = JSON.parse(localStorage.getItem("ar_design"));
  if (!data) return;

  walls.forEach(w => w.setAttribute("material", data.wall));
  floor.setAttribute("material", data.floor);
  stage.setAttribute("material", data.stage);
  ambientLight.setAttribute("light", data.light);
}
