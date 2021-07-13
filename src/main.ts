import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import "./style.css"

import { Howl } from 'howler'

// renderer setup
const canvas = <HTMLCanvasElement>document.querySelector('#c')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// music
var sound = new Howl({
    src: ['../assets/HOME_Resonance.mp3'],
    autoplay: true,
    loop: true,
    volume: 0,
})

// mute/unmute
const mute = <HTMLDivElement>document.querySelector('#mute')
mute.addEventListener('click', () => {
    if (mute.classList.contains('off')) {
        sound.volume(0)
        mute.classList.remove('off')
    } else {
        sound.volume(0.1)
        mute.classList.add('off')
    }
})

// camera init
const fov = 75
const aspect = canvas.clientWidth / canvas.clientHeight
const near = 0.1
const far = 100
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 5
camera.position.y = 2

// init scene
const scene = new THREE.Scene()

// light it up
const lightColor = 0xffffff
const lightIntensity = 3
const light = new THREE.DirectionalLight(lightColor, lightIntensity)
light.position.set(0, 8, -20)
scene.add(light)

// background gradient
const texLoader = new THREE.TextureLoader()
const bgTexture = texLoader.load('../assets/gradient.png')
scene.background = bgTexture

// floor
var grid = new THREE.GridHelper(200, 100, 0xffffff, 0xffffff)
scene.add(grid)
scene.fog = new THREE.FogExp2(0x000000, 0.0128)
renderer.setClearColor(scene.fog.color, 1)

// sun object
const geometry = new THREE.SphereGeometry(4, 32, 32)
const material = new THREE.MeshBasicMaterial({ color: 0xffc001 })
const sphere = new THREE.Mesh(geometry, material)
sphere.position.set(0, 8, -20)
scene.add(sphere)

// car object
const gltfLoader = new GLTFLoader()
const url = '../assets/car.gltf'
gltfLoader.load(url, (gltf) => {
    const root = gltf.scene
    root.rotateY(Math.PI)
    scene.add(root)
})

// do the render
var speed = 1

renderer.render(scene, camera)
function render(time: number) {
    time *= 0.001

    // fake movement for a while
    grid.position.z = (time * speed) % 10
    if (grid.position.z > 10) grid.position.z = 0

    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()

    renderer.render(scene, camera)
    requestAnimationFrame(render)
}
requestAnimationFrame(render)

// kachow i am speed
canvas.addEventListener('keydown', (e) => {
    if (e.keyCode === 87) {
        speed = 10
        sound.rate(1.5)
    } else if (e.keyCode === 83) {
        speed = 0.5
        sound.rate(0.8)
    }
})

// reset speed to default
canvas.addEventListener('keyup', (e) => {
    if (e.keyCode === 87 || e.keyCode === 83) {
        speed = 1
        sound.rate(1)
    }
})


