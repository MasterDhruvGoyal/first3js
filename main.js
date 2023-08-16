//imports
import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

//creating the basics
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene,camera);
//------------------------------//

//Creating the torus
const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial({color: 0xfd3f01});
const torus = new THREE.Mesh(geometry,material);

scene.add(torus)
//------------------//

//importing asteroid 3d model and putting on scene
let asteroid;
const gltfLoader = new GLTFLoader();
gltfLoader.load('./assets/asteroid_01/scene.gltf', function(gltf){
  const model = gltf.scene;
  model.scale.set(.01,.01,.01);
  model.position.set(10,10,10)
  scene.add(model);
  asteroid = model;
});
//------------------//

//creating the light source
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)

//all around light
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)
//----------------------------------//

//helps to visualize the lights and to make a grid (but they are onlly helpers)

/*const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)*/

//allows you to move arroound in the 3d space
const controls = new OrbitControls(camera, renderer.domElement);
//----------------------------------//

//creates a star and generator that spreads them out
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry,material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(300));

  star.position.set(x,y,z);
  scene.add(star)
}
Array(1200).fill().forEach(addStar)
//-----------------------//

//loads space background
const spaceTexture = new THREE.TextureLoader().load('space2.jpg');
scene.background = spaceTexture;

//creates the box and places the image of a face on there
const dhruvTexture = new THREE.TextureLoader().load('Unknown.jpg')
const dhruv = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: dhruvTexture})
);
scene.add(dhruv);

//creates the moon and image for it using texture mapping. used a normal image to give it depth
const moonTexture = new THREE.TextureLoader().load('moon4.jpg')
const normalTexture = new THREE.TextureLoader().load('MoonNormalMap.png')
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);
scene.add(moon)
//setting moon position
moon.position.z = 30
moon.position.setX(-30)
//-----------------------------//

//this function calculates distance on scroll and uses that to move each element
function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.7;
  moon.rotation.y += 0.1;
  moon.rotation.z += 0.8;

  dhruv.rotation.y += 0.01;
  dhruv.rotation.z += 0.01;

  camera.position.z = t * -0.035;
  camera.position.x = t * 0.02;
  camera.position.y = t * -0.002;

  asteroid.position.x = t * .025;
  asteroid.rotation.x += 0.1;
  asteroid.rotation.y += 0.1;
  asteroid.rotation.z += 0.1;
}
document.body.onscroll = moveCamera
//---------------------------//

//animates the torus and updates controls constantly  
function animate(){
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01
  torus.rotation.y += 0.005
  torus.rotation.z += 0.01
  controls.update
  renderer.render(scene,camera);
}

animate()