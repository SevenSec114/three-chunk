import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { World } from './world';
import GUI from 'lil-gui';

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('lightblue');

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(5, 5, 5)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 20, 5);
scene.add(directionalLight);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.target.set(0, 0, 0);

// --- World --- 
const world = new World(scene);

// Programmatically generate the floor using our new API
world.setBlock(0, 0, 0, 1); // 1 = Stone
// And regenerate the chunk mesh once after all blocks are set
world.regenerate();

// --- GUI ---
const gui = new GUI();
const settings = { wireframe: false };
gui.add(settings, 'wireframe').onChange((value: boolean) => {
  world.toggleWireframe(value);
});

// Loop rendering
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})