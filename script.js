const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, (window.innerWidth-320)/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth-320, window.innerHeight);
document.getElementById("scene").appendChild(renderer.domElement);

camera.position.z = 8;

const light = new THREE.PointLight(0xffffff, 1.2);
light.position.set(5,5,5);
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

const satellite = new THREE.Group();
scene.add(satellite);

// Satellite Main Body
const bodyGeometry = new THREE.BoxGeometry(2,2,2);
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
satellite.add(body);

// Solar Panels
const panelGeometry = new THREE.BoxGeometry(4,0.2,1.5);
const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x00aaff });
const panelLeft = new THREE.Mesh(panelGeometry, panelMaterial);
panelLeft.position.x = -3;
satellite.add(panelLeft);

const panelRight = new THREE.Mesh(panelGeometry, panelMaterial);
panelRight.position.x = 3;
satellite.add(panelRight);

// Antenna
const antennaGeometry = new THREE.ConeGeometry(0.7,1.5,32);
const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
antenna.position.y = 2;
satellite.add(antenna);

const components = [
  { name: "Main Bus", mesh: body, temp: 55 },
  { name: "Solar Panel Left", mesh: panelLeft, temp: 45 },
  { name: "Solar Panel Right", mesh: panelRight, temp: 50 },
  { name: "Antenna", mesh: antenna, temp: 40 }
];

function getColor(temp) {
  const mode = document.getElementById("mode").value;

  if(mode === "heat") {
    if(temp > 80) return 0xff0000;
    if(temp > 65) return 0xffa500;
    if(temp > 50) return 0xffff00;
    return 0x00ffff;
  }

  if(mode === "spectrum") {
    if(temp > 80) return 0xffffff;
    if(temp > 65) return 0xff0000;
    if(temp > 50) return 0x00ff00;
    return 0x0000ff;
  }

  if(mode === "risk") {
    return temp > 75 ? 0xff0000 : 0x00ff00;
  }
}

function updateTemps() {
  const intensity = document.getElementById("intensity").value;

  components.forEach(comp => {
    comp.temp += (Math.random() - 0.5) * 4 * intensity;
    comp.mesh.material.color.setHex(getColor(comp.temp));

    if(comp.temp > 80) {
      comp.mesh.scale.set(1.1,1.1,1.1);
    } else {
      comp.mesh.scale.set(1,1,1);
    }
  });

  renderTempList();
}

function renderTempList() {
  const list = document.getElementById("tempList");
  list.innerHTML = "";

  components.forEach(comp => {
    const li = document.createElement("li");
    li.textContent = comp.name + " - " + comp.temp.toFixed(1) + "°C";
    list.appendChild(li);
  });
}

setInterval(updateTemps, 3000);

function animate() {
  requestAnimationFrame(animate);
  satellite.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();