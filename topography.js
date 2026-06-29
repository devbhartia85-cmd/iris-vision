const topoScene = new THREE.Scene();
const topoCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const topoRenderer = new THREE.WebGLRenderer({ antialias: true });

topoRenderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(topoRenderer.domElement);

topoCamera.position.z = 5;

const geometry = new THREE.PlaneGeometry(10, 10, 100, 100);
geometry.rotateX(-Math.PI / 2);

for (let i = 0; i < geometry.attributes.position.count; i++) {
  const y = Math.random() * 0.5;
  geometry.attributes.position.setY(i, y);
}

const material = new THREE.MeshStandardMaterial({
  color: 0x00ffaa,
  wireframe: false
});

const terrain = new THREE.Mesh(geometry, material);
topoScene.add(terrain);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 5);
topoScene.add(light);

function animateTopo() {
  requestAnimationFrame(animateTopo);
  terrain.rotation.y += 0.002;
  topoRenderer.render(topoScene, topoCamera);
}

animateTopo();