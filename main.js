import './style.css';
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

const scene = new THREE.Scene();

const camera  = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

const renderer = new THREE.WebGLRenderer({
  canvas:document.querySelector("#bg"), 
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight)

camera.position.setZ(30)

const planetTexture = new THREE.TextureLoader().load("/planet.png")
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(10 , 30,30,100),
  new THREE.MeshStandardMaterial({
    map:planetTexture
  })
);

scene.add(sphere);


const pointLight = new THREE.PointLight(0xffffff,200)
pointLight.position.set(10,10,10)

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight,ambientLight);

const lightHelper =  new THREE.PointLightHelper(pointLight)
scene.add(lightHelper);

const gridHelper =  new THREE.GridHelper(200,50)
//scene.add(gridHelper);

const controls = new OrbitControls(camera,renderer.domElement)
function animate(){
  requestAnimationFrame(animate);

  sphere.rotation.y +=0.005
  sphere.rotation.x +=0.002
  controls.update()
  renderer.render(scene,camera);
}


function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24) 
  const material = new THREE.MeshStandardMaterial({color:0xffffff})
  const star = new THREE.Mesh(geometry,material)

  const [x,y,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100))
  star.position.set(x,y,z)

  scene.add(star)
}

Array(50).fill().forEach(addStar)

// const spaceTexture = new THREE.TextureLoader().load("/space.jpg")
// scene.background = spaceTexture;

animate();