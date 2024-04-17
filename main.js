import './style.css';
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
// First, import the necessary modules
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';


//Animation stuff
let animationFrame = 0
let isMovingPlanet = false
let finishedMovingPlanet = false
let isSpeeding = false
let starMovementSpeed = 0.3
let starLength = 0.5
let planetRotationSpeed = 0.0009

const scene = new THREE.Scene();

const camera  = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
let allStars = []

const renderer = new THREE.WebGLRenderer({
  canvas:document.querySelector("#bg"), 
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight)

//Compositte
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
// Add a BloomPass with desired parameters
const bloomPass = new BloomPass(
  /* strength */ 1,    // Bloom strength
  /* kernelSize */ 25, // Gaussian kernel size
  /* sigma */ 4,       // Gaussian standard deviation
  /* resolution */ 256 // Render resolution multiplier
);
composer.addPass(bloomPass);


camera.position.setZ(30)

const planetTexture = new THREE.TextureLoader().load("/planet.png")
const planetNormal = new THREE.TextureLoader().load("/planet-normal.png")

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(10 , 30,30,100),
  new THREE.MeshStandardMaterial({
    map:planetTexture,
    //normalMap:planetNormal
  })
);

scene.add(sphere);


const pointLight = new THREE.PointLight(0xffffff,1000)
pointLight.position.set(10,10,20)

const ambientLight = new THREE.AmbientLight(0xffffff,0.05)
scene.add(pointLight,ambientLight);

const lightHelper =  new THREE.PointLightHelper(pointLight)
scene.add(pointLight,lightHelper);

const gridHelper =  new THREE.GridHelper(200,50)
//scene.add(gridHelper);

const controls = new OrbitControls(camera,renderer.domElement)
function animate(){
  animationFrame++
  sphere.rotation.y +=planetRotationSpeed
  moveStars(starMovementSpeed)
  controls.update()

  //Transition Animation
  if(isMovingPlanet){
    starMovementSpeed+=0.2;
    planetRotationSpeed+=0.05
    sphere.position.x+=1.2;
    sphere.position.z+=1.2;
    if(sphere.position.x>20 && !isSpeeding) {isSpeeding = true; starLength++;}
    if(sphere.position.x >= 35){
      isMovingPlanet = false
      finishedMovingPlanet = true
    }
  }

  if(isSpeeding && starMovementSpeed<10){
    starMovementSpeed+=0.5
  }

  if(isSpeeding && starLength<50 &&animationFrame%3 == 0){
    starLength+=1.5
    changeStar()
  }
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}


function moveStars(speed){
  allStars.forEach((star)=>{
    star.position.z += speed;
    if(star.position.z>20){
      star.position.z = -100;
    }
  })
}

function changeStar(){
    allStars.forEach((star)=>{
      // Replace geometry with longer length
      const newGeometry = new THREE.CapsuleGeometry(0.1, starLength, 8, 10); // Adjust length as needed
      star.geometry.dispose(); // Dispose previous geometry to release memory
      star.geometry = newGeometry; // Assign new geometry
    })
    
}

function addStar(){
  const geometry = new THREE.CapsuleGeometry( 0.1, starLength, 8, 10 ); 
  const material = new THREE.MeshStandardMaterial({color:0xffffff,emissive:0x8bf7f7,emissiveIntensity:1})
  const star = new THREE.Mesh(geometry,material)

  const [x,y,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100))
  star.position.set(x,y,z-50)
  star.rotation.x = 300
  scene.add(star)
  allStars.push(star)
}

Array(70).fill().forEach(addStar)

// const spaceTexture = new THREE.TextureLoader().load("/space.jpg")
// scene.background = spaceTexture;
animate();


document.addEventListener("click",(e)=>{

  isMovingPlanet = true
  starMovementSpeed++

  // Find all elements with class .ui-container
  const uiContainers = document.querySelectorAll('.ui-container');

  // Add .remove class to each .ui-container element
  uiContainers.forEach(container => {
      container.classList.add('remove');
  });
})
