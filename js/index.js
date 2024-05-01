import Config from "./config.js";
import { getSpectrum, init as initAudio } from "./audio.js";
import { getMultiplier } from "./helpers/utils.js";
import TrapNation from "./components/TrapNation.js";
import Component from "./components/Component.js";

const mouse = { x: 0, y: 0 };

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const components = [
  //
  new TrapNation(100, 100, 400, 400, context),
  new TrapNation(300, 500, 100, 100, context),
];

let hoverComp = null,
  dragComp = null;

function resizeCanvas(w = window.innerWidth, h = window.innerHeight) {
  canvas.width = w;
  canvas.height = h;
}

window.addEventListener("resize", () => {
  resizeCanvas();
});

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener("mousedown", () => {});

canvas.addEventListener("mouseup", () => {});

resizeCanvas();
initAudio();
draw();

function draw() {
  requestAnimationFrame(draw);

  context.clearRect(0, 0, canvas.width, canvas.height);

  let spectrum = getSpectrum();
  spectrum = spectrum.slice(Config.startBin, Config.startBin + Config.keepBins);
  let multiplier = getMultiplier(spectrum, Config.keepBins);

  components.forEach((comp) => {
    comp.draw(spectrum, multiplier);
  });

  if (hoverComp) {
    Component.drawBoundingBox(hoverComp, dragComp ? "yellow" : "red");
  }
}
