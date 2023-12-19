import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const objects = []; //list of scene objects
let raycaster; //raygun

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let camera, scene, renderer, controls;

init();
animate();
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 1;

    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');
    scene.background = new THREE.Color(0xADD8E6)
    instructions.addEventListener('click', function () {
        controls.lock();
    });
    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });
    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });

    scene.add(controls.getObject());

    const onKeyDown = function (event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;
            case 'Space':
                if (canJump === true) velocity.y += 30;
                canJump = false;
                break;
        }
    }

    const onKeyUp = function (event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
        }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 1)


    const geometry = new THREE.PlaneGeometry(20, 20, 64, 64);
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 35, 0)
    scene.add(plane);
    objects.push(plane);

    plane.rotateX(-1.57)

    const geometry1 = new THREE.BoxGeometry(3, 3, 3);
    const material1 = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry1, material1);
    cube.position.set(13, 34, 0)
    scene.add(cube);
    objects.push(cube);

    const geometry2 = new THREE.BoxGeometry(3, 3, 3);
    const material2 = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cube1 = new THREE.Mesh(geometry2, material2);
    cube1.position.set(22, 32, 0)
    scene.add(cube1);
    objects.push(cube1);

    const geometry3 = new THREE.BoxGeometry(3, 3, 3);
    const material3 = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cube2 = new THREE.Mesh(geometry3, material3);
    cube2.position.set(31, 34, 0)
    scene.add(cube2);
    objects.push(cube2);

    const geometry4 = new THREE.BoxGeometry(3, 3, 3);
    const material4 = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cube3 = new THREE.Mesh(geometry4, material4);
    cube3.position.set(31, 34, 0)
    scene.add(cube3);
    objects.push(cube3);

    const ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight)

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}



function animate() {
    requestAnimationFrame(animate);
    const time = performance.now()

    if (controls.isLocked === true) {
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 1;

        const intersections = raycaster.intersectObjects(objects, false);
        const onObject = intersections.length > 0;
        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * 100.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 100.0 * delta;

        if (onObject === true) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        controls.getObject().position.y += (velocity.y * delta);
        if (controls.getObject().position.y < -1) {
            velocity.y = 0;
            controls.getObject().position.set(0,40,0);
            canJump = true;
        }
    }
    prevTime = time
    renderer.render(scene, camera);


} 
