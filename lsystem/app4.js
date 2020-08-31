const DEG_TO_RAD = Math.PI/180;

//THREE js variables
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1500);
const renderer = new THREE.WebGLRenderer({antialias:true});
camera.translateY(200);
camera.lookAt(new THREE.Vector3(0,0,0));
const cachedMatrix4 = new THREE.Matrix4();
const cachedQuat = new THREE.Quaternion();

// The Tree
const tree = new THREE.Group();

// Trunk variables
const material = new THREE.LineBasicMaterial( { color: 0xB24E4B } );
const geometry = new THREE.Geometry();

// Flowers variables
const flowersGeometry = new THREE.Geometry();
let flowerGeometry = new THREE.SphereGeometry(1, 12, 12 );
const flowerMaterial = new THREE.MeshStandardMaterial({color:0x5598CC});

// Leafs variable
const leavesGeometry = new THREE.Geometry();
const createLeafGeometry = () => {
  const points = [];
  for ( let i = 0; i < 10; i ++ ) {
    points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
  }
  
  const geom = new THREE.LatheGeometry( points, 5, 0, 0.2 );
  geom.computeBoundingBox();
  const bb = geom.boundingBox;
  const z = bb.max.z - bb.min.z;
  const y = bb.max.y - bb.min.y;
  geom.applyMatrix( cachedMatrix4.makeTranslation(0, y/2.0, -z/2.) );
  return geom;
}
const leafGeometry = createLeafGeometry();
const leafMaterial = new THREE.MeshStandardMaterial({color:0xFF8884, side: THREE.DoubleSide});

//L-Systems rules variables
const angle = 35;
const axiom = "F";
let sentence = axiom;
const len = 10;
const limit = 4;
const rules = [];
rules[0] = {
  // TRY new rules
  // a: "F",
  // b: "F[+F]F[-F]F"

  // a: "F",
  // b: "F[+F]F[-F][F]"

  a: "F",
  b: "FF+[+F-F-F]-[-F+F+F]"
}

// Let's go!
const init = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xFDFF9E, 1);
  document.body.style.margin =0;
  document.body.appendChild(renderer.domElement);
  camera.position.z = 80;
  controls = new THREE.OrbitControls( camera, renderer.domElement );

  const light = new THREE.PointLight( 0xffffff, 1, 0 );
  light.position.set( 100, 200, 0);
  scene.add( light);

	const light2 = new THREE.PointLight( 0xffffff, 1, 100 );
	light2.position.set(0, 100, -200);
  scene.add( light2 );
  
	const directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set(0, 0.5, -0.5);
	directionalLight.position.normalize();
	scene.add( directionalLight );

  // Have a look at the axis
  let axisHelper = new THREE.AxesHelper( 50 );
  scene.add( axisHelper );

  window.addEventListener('resize', function() {
      let WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
  });

  createTree();

  render();
};

const createTree = () => {
  const branches = [];
  const sentence = generate(rules);
  createBranchesFromSentence(sentence, branches, len);
  
  for (const b of branches) {
    addBranch(geometry, b.start.position, b.end.position);

    //TRY Add organs
    // if (b.end.position.y > 0 && Math.random() > 0.5) {
    //   addFlower(b, flowersGeometry);
    // } else {
    //   addLeaf(b, leavesGeometry);
    // }
  }
  let flower = new THREE.Mesh(flowersGeometry, flowerMaterial);
  tree.add(flower)

  const leaves = new THREE.Mesh(leavesGeometry, leafMaterial);
  tree.add(leaves);

  const trunk = new THREE.LineSegments( geometry, material );
  tree.add(trunk);

  scene.add(tree);
}

const addBranch = (geom,v1, v2) => {
  geom.vertices.push(new THREE.Vector3( v1.x, v1.y, v1.z) );
  geom.vertices.push(new THREE.Vector3( v2.x, v2.y, v2.z) );
}

const addFlower = (branch, flowersGeometry) => {
  let flower = flowerGeometry.clone(); 
  flower.applyMatrix(cachedMatrix4.makeTranslation(
    branch.end.position.x,
    branch.end.position.y,
    branch.end.position.z));

  flowersGeometry.merge(flower);
}

const addLeaf = (branch, leavesGeometry) => {
  const leaf = leafGeometry.clone();  
  branch.end.getWorldQuaternion(cachedQuat);

  cachedMatrix4.makeRotationFromQuaternion(cachedQuat);
  leaf.applyMatrix(cachedMatrix4);
  
  cachedMatrix4.makeTranslation(
    branch.end.position.x,
    branch.end.position.y,
    branch.end.position.z);
  leaf.applyMatrix(cachedMatrix4);

  leavesGeometry.merge(leaf);
}

const generate = (rules) => {
  for(let l = 0; l < limit; l++){
    let nextSentence = "";

    for (let i = 0; i < sentence.length; i++) {
      const current = sentence.charAt(i);
      let found = false;
      for (let j = 0; j < rules.length; j++) {
        if (current == rules[j].a) {
          found = true;
          nextSentence += rules[j].b;
          break;
        }
      }
      if (!found) {
        nextSentence += current;
      }
    }
    sentence = nextSentence;
  }
  return sentence;
}

const createBranchesFromSentence = (sentence, branches, len) => {
  const turtle = new THREE.Object3D();
  turtle.position.set(0,-200,0);
  const bookmark = [];

  for (let i = 0; i < sentence.length; i++) {
    const current = sentence.charAt(i);

    let addBranch = false;
    if (current == "F") {
      addBranch = true;
    } else if (current == "+") {
      turtle.rotateZ(angle * DEG_TO_RAD);
    } else if (current == "-") {
      turtle.rotateZ(-angle * DEG_TO_RAD);
    } else if (current == "[") {
      bookmark.push(turtle.clone());
    } else if (current == "]") {
      turtle.copy(bookmark.pop(),false);
    }

    if (addBranch) {
      // TRY add random rotation on the y axis
      // turtle.rotateY(Math.random()* Math.PI/6);
      let end = turtle.clone().translateY(len);
      let branch = { "start": turtle.clone(), "end": end};
      turtle.copy(end);
      branches.push(branch);
    }
  }
}

const render = () => {
  // TRY, addo some rotation
  // tree.rotateY(0.001);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

init();

