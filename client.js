// Art 109 Three.js Demo Site
// client7.js
// A three.js scene which uses planes and texture loading to generate a scene with images which can be traversed with basic WASD and mouse controls, this scene is full screen with an overlay.

// Import required source code
// Import three.js core
import * as THREE from "./build/three.module.js";
// Import pointer lock controls
import {
  PointerLockControls
} from "./src/PointerLockControls.js";

import { GLTFLoader } from "./src/GLTFLoader.js";
// Establish variables
let camera, scene, renderer, controls, material;

const objects = [];
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

// Initialization and animation function calls
init();
animate();

// Initialize the scene
function init() {
  // Establish the camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 10;

  // Define basic scene parameters
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);
  const color1 = new THREE.Color();

  // Define scene lighting

  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 );
  scene.add( ambientLight );
  const dirLight = new THREE.DirectionalLight( 0xefefff, 1.5 );
  dirLight.position.set( 10, 10, 10 );
  scene.add( dirLight );

  // Define controls
  controls = new PointerLockControls(camera, document.body);

  // Identify the html divs for the overlays
  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  // Listen for clicks and respond by removing overlays and starting mouse look controls
  // Listen
  instructions.addEventListener("click", function() {
    controls.lock();
  });
  // Remove overlays and begin controls on click
  controls.addEventListener("lock", function() {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });
  // Restore overlays and stop controls on esc
  controls.addEventListener("unlock", function() {
    blocker.style.display = "block";
    instructions.style.display = "";
  });
  // Add controls to scene
  scene.add(controls.getObject());

  // Define key controls for WASD controls
  const onKeyDown = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;

      case "Space":
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // Add raycasting for mouse controls
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  // Generate the ground
  let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);

  // Vertex displacement pattern for ground
  let position = floorGeometry.attributes.position;

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i);

    vertex.x += Math.random() * 0 - 10;
    vertex.y += Math.random() * 0;
    vertex.z += Math.random() * 20 - 10;

    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

  position = floorGeometry.attributes.position;
  const colorsFloor = [];

  for (let i = 0, l = position.count; i < l; i++) {
    color.setHSL(210, 10, Math.random() * .25 + .2);
    colorsFloor.push(color.r, color.g, color.b);
  }

  floorGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsFloor, 1)
  );

  const floorMaterial = new THREE.MeshBasicMaterial({
    vertexColors: false
  });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  // Insert completed floor into the scene
  scene.add(floor);



  // Load GLTF models
  var mesh;
  const loader = new GLTFLoader().load(
    "./assets/dog.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(30, -2, -420);
      mesh.rotation.set(0, -90, 0);
      mesh.scale.set(20, 20, 20);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/me.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(-200, -1700, 0);
      mesh.rotation.set(0, -180, 0);
      mesh.scale.set(10, 10, 10);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/me.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(200, -1700, 0);
      mesh.rotation.set(0, 180, 0);
      mesh.scale.set(10, 10, 10);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/me.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(-200, -1700, -200);
      mesh.rotation.set(0, -181, 0);
      mesh.scale.set(10, 10, 10);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/me.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(-200, -1700, -400);
      mesh.rotation.set(0, -181, 0);
      mesh.scale.set(10, 10, 10);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/me.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(200, -1700, -200);
      mesh.rotation.set(0, 181, 0);
      mesh.scale.set(10, 10, 10);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/me.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(200, -1700, -400);
      mesh.rotation.set(0, 181, 0);
      mesh.scale.set(10, 10, 10);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/me.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(-25, -1700, 200);
      mesh.rotation.set(0, 123, 0);
      mesh.scale.set(10, 10, 10);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/me.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(0, -1700, -700);
      mesh.rotation.set(0, 0, 0);
      mesh.scale.set(10, 10, 10);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/me.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(0, 0, -520);
      mesh.rotation.set(0, 0, 0);
      mesh.scale.set(.5, .5, .5);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/hand.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(-35, 0, -420);
      mesh.rotation.set(0, -95, 0);
      mesh.scale.set(.1, .1, .1);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/airpod.glb",
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(-35, 20, -320);
      mesh.rotation.set(0, -95, 0);
      mesh.scale.set(.1, .1, .1);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );

  new GLTFLoader().load(
    "./assets/gameboy.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(30, -2, -320);
      mesh.rotation.set(0, -90, 0);
      mesh.scale.set(.1, .1, .1);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/mj.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(40, 12, -220);
      mesh.rotation.set(0, 45, 0);
      mesh.scale.set(5, 5, 5);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/king.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(-35, 10, -220);
      mesh.rotation.set(0, -95, 0);
      mesh.scale.set(5, 5, 5);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/me2.gltf",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(-25, 0, -211);
      mesh.rotation.set(0, -90, 0);
      mesh.scale.set(.07, .07, .07);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/me2.gltf",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(20, 0, -400);
      mesh.rotation.set(0, -180, 0);
      mesh.scale.set(.07, .07, .07);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );

  new GLTFLoader().load(
    "./assets/me2.gltf",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(0, 0, -490);
      mesh.rotation.set(0, -185, 0);
      mesh.scale.set(.07, .07, .07);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  new GLTFLoader().load(
    "./assets/ground.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(40, 12, -120);
      mesh.rotation.set(0, -90, 90);
      mesh.scale.set(2, 2, 2);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );new GLTFLoader().load(
    "./assets/1sunflower.glb",

    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(-40 ,0, -120);
      mesh.rotation.set(0, 0, 0);
      mesh.scale.set(.02, .02, .02);
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  // Define Rendered and html document placement
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Listen for window resizing
  window.addEventListener("resize", onWindowResize);
}

// Window resizing function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation function
function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();

  // Check for controls being activated (locked) and animate scene according to controls
  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects, false);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = false;
    }
  }

  prevTime = time;
renderer.gammaOutput = true
  renderer.render(scene, camera);
}
