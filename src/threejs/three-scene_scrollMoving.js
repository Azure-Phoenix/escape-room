import React, { Component } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

class ThreeScene extends Component {
  canvasRef = React.createRef();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 0, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  loader = new GLTFLoader();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  componentDidMount() {
    // Canvas
    const canvas = this.canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Camera
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.position.set(0, 2.5, 0);
    this.camera.updateProjectionMatrix();

    // Renderer
    this.renderer.setSize(canvas.width, canvas.height);
    canvas.appendChild(this.renderer.domElement);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 3.3, 0);
    this.scene.add(pointLight);

    /**
     * Objects
     */
    // Axes
    // const axes = new THREE.AxesHelper(10);
    // this.scene.add(axes);

    // Room
    this.loader.load("room.glb", (gltf) => {
      const model = gltf.scene;
      this.scene.add(model);
      // console.log(model);
    });

    // Controls
    // this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.orbitControls.update();
    this.pointerlockControls = new PointerLockControls(
      this.camera,
      this.renderer.domElement
    );

    const animate = () => {
      requestAnimationFrame(animate);
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.renderer.render(this.scene, this.camera);
    };
    animate();

    const moveforward = (delta) => {
      this.camera.position.set(
        this.camera.position.x + this.raycaster.ray.direction.x * delta,
        this.camera.position.y + this.raycaster.ray.direction.y * delta,
        this.camera.position.z + this.raycaster.ray.direction.z * delta,
      );

    }

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(canvas.width, canvas.height);
    });

    canvas.addEventListener("click", () => {
      this.pointerlockControls.lock();
    });

    canvas.addEventListener("wheel", (event) => {
      const delta = - event.deltaY * 0.001; // forward: -100, backward: +100
      moveforward(delta);
    });

    canvas.addEventListener("mousemove", (event) => {
      // console.log(this.raycaster.ray.direction);
      // this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      // this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      // this.mouse.set(0, 0);
      // console.log(this.mouse);
    });
  }

  render() {
    return <div ref={this.canvasRef} />;
  }
}

export default ThreeScene;
