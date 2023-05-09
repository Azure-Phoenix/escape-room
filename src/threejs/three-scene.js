import React, { Component } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { gsap } from "gsap";
import { Vector3 } from "three";

class ThreeScene extends Component {
  canvasRef = React.createRef();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 0, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  loader = new GLTFLoader();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  pointedObject = "";
  pointedObject_ = "";
  model = new THREE.Object3D();

  componentDidMount() {
    let mixer;
    const clock = new THREE.Clock(); // Define the clock variable
    let laptop,
      cabinet_L,
      cabinet_R,
      cabinet_D,
      cabinet_U,
      drawer_L,
      drawer_R,
      action;
    let cabinet_L_Position = new THREE.Vector3(2.5, 2, -0.5);
    let cabinet_R_Position = new THREE.Vector3(2.5, 2, 1.2);
    let cabinet_U_Position = new THREE.Vector3(2.7, 3, 0.35);
    let cabinet_D_Position = new THREE.Vector3(2.7, 3, 0.35);
    let drawer_R_Position = new THREE.Vector3(-1, 3.5, 2);
    let drawer_L_Position = new THREE.Vector3(1.24, 3.5, 2);
    let laptop_Position = new THREE.Vector3(0, 3.5, 3);
    let forward = true;
    let Wood_Desk001 = false;
    let Wood_Desk002 = false;
    let Wood_Desk003 = false;
    let Wood_Desk004 = false;
    let Tv_Cabinet001 = false;
    let Tv_Cabinet002 = false;
    let Base001 = false;
    let trueSelect = false;

    const blocker = document.getElementById("blocker");
    const instructions = document.getElementById("instructions");

    let cameraPosition = new THREE.Vector3();

    /**
     * Init for three.js
     */

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

    // Area Limit
    const room = new THREE.Box3(
      new THREE.Vector3(-5, 0, -5),
      new THREE.Vector3(5, 5, 5)
    ); // Define the boundaries of the room
    const table = new THREE.Box3(
      new THREE.Vector3(-1.5, 0, 3.7),
      new THREE.Vector3(1.8, 1.7, 5)
    ); // Define the boundaries of the room
    const cabinet = new THREE.Box3(
      new THREE.Vector3(4, 0, -1),
      new THREE.Vector3(5, 1.2, 2)
    ); // Define the boundaries of the room
    const sofa = new THREE.Box3(
      new THREE.Vector3(-2, 0.55, -5),
      new THREE.Vector3(5, 1.2, 2)
    ); // Define the boundaries of the room

    // Room
    this.loader.load("FinalScene7.gltf", (gltf) => {
      this.model = gltf.scene;
      this.scene.add(this.model);

      laptop = gltf.animations[2]; //
      cabinet_L = gltf.animations[14];
      cabinet_R = gltf.animations[15];
      cabinet_D = gltf.animations[16];
      cabinet_U = gltf.animations[17];
      drawer_L = gltf.animations[19]; //
      drawer_R = gltf.animations[20]; //

      // Create an animation mixer and add the clip to it
      mixer = new THREE.AnimationMixer(this.model);
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
      this.camera.getWorldPosition(cameraPosition);

      if (!room.containsPoint(cameraPosition)) {
        // If the camera position is outside the box, move it back inside the box
        // try {
        // const closestPoint = box.clampPoint(cameraPosition);
        cameraPosition.copy(this.camera.position).clamp(room.min, room.max);
        this.camera.position.copy(cameraPosition);
        // } catch {}
      }

      if (cabinet.containsPoint(cameraPosition)) {
        const nearestPoint = cabinet.clampPoint(
          this.camera.position,
          new THREE.Vector3()
        );

        // Calculate the vector from the this.camera position to the nearest point
        const offset = new THREE.Vector3().subVectors(this.camera.position, nearestPoint);

        // Move the this.camera to the nearest point outside the box
        this.camera.position.add(offset);
      }

      const intersects = this.raycaster.intersectObjects(
        this.scene.children,
        true
      );

      if (intersects.length > 0) {
        this.pointedObject = intersects[0].object.parent;
        try {
          this.pointedObject_ = intersects[3].object;
        } catch {}
      }

      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }

      this.renderer.render(this.scene, this.camera);
    };
    animate();

    window.addEventListener("click", (event) => {
      this.pointerlockControls.lock();

      if (this.pointedObject_.name === "Wood_Desk001") {
        action = mixer.clipAction(drawer_L);
        if (Wood_Desk001) {
          forward = false;
        } else {
          forward = true;
          gsap.fromTo(this.camera.position, this.camera.position, {
            duration: 1,
            x: drawer_L_Position.x,
            y: drawer_L_Position.y,
            z: drawer_L_Position.z,
          });
        }
        Wood_Desk001 = !Wood_Desk001;
        trueSelect = true;
      }
      if (this.pointedObject_.name === "Wood_Desk002") {
        action = mixer.clipAction(drawer_R);

        if (Wood_Desk002) {
          forward = false;
        } else {
          forward = true;
          gsap.fromTo(this.camera.position, this.camera.position, {
            duration: 1,
            x: drawer_R_Position.x,
            y: drawer_R_Position.y,
            z: drawer_R_Position.z,
          });
        }
        Wood_Desk002 = !Wood_Desk002;
        trueSelect = true;
      }
      if (this.pointedObject.name === "Tv_Cabinet003") {
        action = mixer.clipAction(cabinet_D);

        if (Wood_Desk003) {
          forward = false;
        } else {
          forward = true;
          gsap.fromTo(this.camera.position, this.camera.position, {
            duration: 1,
            x: cabinet_D_Position.x,
            y: cabinet_D_Position.y,
            z: cabinet_D_Position.z,
          });
        }
        Wood_Desk003 = !Wood_Desk003;
        trueSelect = true;
      }
      if (this.pointedObject.name === "Tv_Cabinet004") {
        action = mixer.clipAction(cabinet_U);

        if (Wood_Desk004) {
          forward = false;
        } else {
          forward = true;
          gsap.fromTo(this.camera.position, this.camera.position, {
            duration: 1,
            x: cabinet_U_Position.x,
            y: cabinet_U_Position.y,
            z: cabinet_U_Position.z,
          });
        }
        Wood_Desk004 = !Wood_Desk004;
        trueSelect = true;
      }
      if (this.pointedObject.name === "Tv_Cabinet001") {
        action = mixer.clipAction(cabinet_L);

        if (Tv_Cabinet001) {
          forward = false;
        } else {
          forward = true;
          gsap.fromTo(this.camera.position, this.camera.position, {
            duration: 1,
            x: cabinet_L_Position.x,
            y: cabinet_L_Position.y,
            z: cabinet_L_Position.z,
          });
        }
        Tv_Cabinet001 = !Tv_Cabinet001;
        trueSelect = true;
      }
      if (this.pointedObject.name === "Tv_Cabinet002") {
        action = mixer.clipAction(cabinet_R);

        if (Tv_Cabinet002) {
          forward = false;
        } else {
          forward = true;
          gsap.fromTo(this.camera.position, this.camera.position, {
            duration: 1,
            x: cabinet_R_Position.x,
            y: cabinet_R_Position.y,
            z: cabinet_R_Position.z,
          });
        }
        Tv_Cabinet002 = !Tv_Cabinet002;
        trueSelect = true;
      }
      if (this.pointedObject.name === "Base001") {
        action = mixer.clipAction(laptop);
        if (Base001) {
          forward = false;
        } else {
          forward = true;
          gsap.fromTo(this.camera.position, this.camera.position, {
            duration: 1,

            x: laptop_Position.x,
            y: laptop_Position.y,
            z: laptop_Position.z,
          });
        }
        Base001 = !Base001;
        trueSelect = true;
      }
      if (trueSelect) {
        try {
          action.setLoop(THREE.LoopOnce);
          action.clampWhenFinished = true;
          if (forward) {
            action.reset();
            action.timeScale = 1;
            action.play();
          } else {
            action.timeScale = -1;
            action.paused = false;
          }
        } catch {}
      }
      trueSelect = false;
    });

    this.pointerlockControls.addEventListener("lock", function () {
      instructions.style.display = "none";
      blocker.style.display = "none";
    });

    this.pointerlockControls.addEventListener("unlock", function () {
      blocker.style.display = "block";
      instructions.style.display = "";
    });

    this.scene.add(this.pointerlockControls.getObject());

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(canvas.width, canvas.height);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        gsap.fromTo(this.camera.position, this.camera.position, {
          duration: 1,
          x: 0,
          y: 2.5,
          z: 0,
        });
      }
      if (event.key === "Escape") {
        // this.mouse.set(0,0);
      }
    });

    canvas.addEventListener("wheel", (event) => {
      const delta = -event.deltaY * 0.001; // forward: -100, backward: +100
      moveforward(delta);
    });

    const moveforward = (delta) => {
      this.camera.position.set(
        this.camera.position.x + this.raycaster.ray.direction.x * delta,
        this.camera.position.y + this.raycaster.ray.direction.y * delta,
        this.camera.position.z + this.raycaster.ray.direction.z * delta
      );
    };
  }

  render() {
    return <div ref={this.canvasRef} />;
  }
}

export default ThreeScene;
