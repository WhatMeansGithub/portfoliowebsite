import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass';


// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);


const pointlight = new THREE.PointLight(0xffffff, 1);
pointlight.position.set(5, 5, 5);

const ambientlight = new THREE.AmbientLight(0xffffff);
scene.add(pointlight, ambientlight);


/*
const lightHelper = new THREE.PointLightHelper(pointlight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);
*/
const controls = new OrbitControls(camera, renderer.domElement);

const pointLight = new THREE.PointLight(0xffffff, 1); // White light with intensity 1
scene.add(pointLight); // Add a single point light to the scene

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);



function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: "yellow", emissive: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);
    scene.add(star);

    // Replicate the light position for each star using instanced rendering
    pointLight.position.copy(star.position);
}

// Create stars and replicate light positions
Array(200).fill().forEach(addStar);


// Background

const spaceTexture = new THREE.TextureLoader().load('./images/8k_stars_milky_way.jpg');
scene.background = spaceTexture;


// Avatar


/// Planets

/*
const mercuryTexture = new THREE.TextureLoader().load('8k_mercury.jpg');

const mercury = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: mercuryTexture })
);
scene.add(mercury);
*/

const earthTexture = new THREE.TextureLoader().load('./images/8081_earthmap4k.jpg');
const normalTexture = new THREE.TextureLoader().load('./images/8081_earthbump4k.jpg');
const earthspecTexture = new THREE.TextureLoader().load('.images/8081_earthspec.jpg');
const earthcloudTexture = new THREE.TextureLoader().load('./images/earthcloudmaptrans.jpg');

const cloudMaterial = new THREE.MeshStandardMaterial({ 
  map: earthcloudTexture,
  transparent: true, // Enable transparency
  opacity: 0.2,      // Adjust opacity level
  blending: THREE.AdditiveBlending // Set blending mode
});

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ 
    map: earthTexture,
    normalMap: normalTexture,
    specularMap: earthspecTexture
  })
);
scene.add(earth);

const cloudSphere = new THREE.Mesh(
  new THREE.SphereGeometry(3.05, 32, 32), // slightly larger than earth for cloud coverage
  cloudMaterial
);
scene.add(cloudSphere);


addStar();

function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.01;
  cloudSphere.rotation.y += 0.011;

  
  controls.update();

  renderer.render(scene, camera);
}

animate();