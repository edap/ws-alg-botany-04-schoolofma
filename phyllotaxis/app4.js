const scene = new THREE.Scene();
const PItoDeg = (Math.PI/180.0);
let exporting = false;
let gui;
let objects = [];
let group = new THREE.Group();
let n_frames = 0;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
const materials = new CollectionMaterials;
const geometries = new CollectionGeometries;

/* Phyllotaxis algorithm */
const phyllotaxisSimple = (i, angleInRadians, spread, extrude) => {
  let current_angle = i * angleInRadians;
  let radius = spread * Math.sqrt(i);
  let x = radius * Math.cos(current_angle);
  let y = radius * Math.sin(current_angle);
  let z = 0.0;
  if (extrude) {
      z = i * -.05;
  }
  return {x, y, z};
}

const phyllotaxisConical = (i, angleInRadians, spread, extrude) => {
  let current_angle = i * angleInRadians;
  let radius = spread * Math.sqrt(i);
  let x = radius * Math.cos(current_angle);
  let y = radius * Math.sin(current_angle);
  let z = i * + extrude;
  return {x, y, z};
}

const phyllotaxisApple = (i, angle, spread, tot) => {
  let inc = Math.PI / tot;
  let current_angle = i * inc;
  let current_angle_b= i * angle;
  let radius = spread * Math.sqrt(i);
  let x = radius * Math.sin(current_angle) * Math.cos(current_angle_b);
  let y = radius * Math.sin(current_angle) * Math.sin(current_angle_b);
  let z = radius * Math.cos(current_angle);
  return {x, y, z};
}

// this function is called Wrong because it is wrong! it was born as mistake
// while i was passing angles in degreees without converting them to radians.
// But sometimes there are strange patterns that generate a nice effect.
// To use it, pass the angles in degrees
const phyllotaxisWrong = (i, angle, spread, tot) => {
  //let inc = Math.PI / tot;
  let inc = 180.0 / tot;
  let current_angle = i * inc;
  let current_angle_b= i * angle;
  let radius = spread * Math.sqrt(i);
  let x = radius * Math.sin(current_angle) * Math.cos(current_angle_b);
  let y = radius * Math.sin(current_angle) * Math.sin(current_angle_b);
  let z = radius * Math.cos(current_angle);
  return {x, y, z};
}

const init = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x160025);
  document.body.style.margin =0;
  document.body.appendChild(renderer.domElement);
  camera.position.z = 80;
  controls = new THREE.OrbitControls( camera, renderer.domElement );

  //lights
  const ambientLight = new THREE.AmbientLight( 0x000000 );
  scene.add( ambientLight );
  bloomEffect = new BloomEffect(scene, camera, window);
  gui = new Gui(exportMesh, regenerateMesh);
  gui.addScene(scene, ambientLight, renderer);
  gui.addMaterials(materials);
  gui.addBloom(bloomEffect.params, renderer, bloomEffect.bloomPass);
  gui.addAnimation();

  const light = new THREE.PointLight( 0xffffff, 1, 0 );
  light.position.set( 0, 200, 0 );
  scene.add( light);

  const axisHelper = new THREE.AxesHelper( 50 );
  scene.add( axisHelper );

  window.addEventListener('resize', function() {
      let WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
  });

  render();
};

function populateGroup(selected_geometry, selected_material) {
  for (let i = 0; i< gui.params.num; i++) {
      // make a meaningfull composition, experiment with other geometries like
      // https://threejs.org/docs/#api/geometries/IcosahedronGeometry
      // TRY different variation of the phyllotaxis algorithm
      const coord = phyllotaxisConical(i, gui.params.angle, gui.params.spread, gui.params.extrude);
      //const coord =  phyllotaxisWrong(i, gui.params.angle, gui.params.spread, gui.params.num);
      //const coord = phyllotaxisApple(i, gui.params.angle, gui.params.spread, gui.params.num)
      //const coord =  phyllotaxisSimple(i, gui.params.angle, gui.params.spread, gui.params.extrude);
      let object;

      // TRY to use multiple materials and geometries depending on some conditions
      // if (i %2 == 0) {
      //   object = new THREE.Mesh(geometries["icosahedron"], materials["standard2"]);
      // } else {
      //   object = new THREE.Mesh(selected_geometry, selected_material);
      // }

      object = new THREE.Mesh(selected_geometry, selected_material);
      object.position.set(coord.x, coord.y, coord.z);

      object.rotateY( (gui.params.angle_y + i * 100/gui.params.num ) * -PItoDeg );
      object.rotateZ( i* gui.params.angle * PItoDeg);
      object.scale.set(gui.params.scale_x,1,gui.params.scale_z);

      objects.push(object);
      group.add(object);
  }
  scene.add(group);
}

function addStats(debug) {
  if (debug) {
      document.body.appendChild(stats.domElement);
  }
}

function resetGroup(){
  for (let index in objects) {
      let object = objects[index];
      group.remove( object );
  }
  scene.remove(group);
  objects = [];
}

function render(){
  n_frames +=0.0001;
  if (gui.params.anim.spread) {
    let sp = Math.abs(Math.sin(n_frames/gui.params.anim.freq) * gui.params.anim.amplitude);
    gui.params.spread = sp;
  }
  
  this.populateGroup(geometries[gui.params.geometry],materials[gui.params.material]);

  if (!exporting ){
      if (gui.params.anim.zoetrope) {
        group.rotateZ( gui.params.anim.zoetrope_angle * PItoDeg);
      }
      bloomEffect.render();
  }

  requestAnimationFrame(render);
  resetGroup();
}

const exportMesh = () => {
  exporting = true;
  let selected_geometry = mergeObjectsInOneGeometry(objects);
  let mesh = new THREE.Mesh(selected_geometry, materials[gui.params.material]);
  scene.add(mesh);
  exportMeshAsObj(scene);
  scene.remove(mesh);
  exporting = false;
}

const regenerateMesh = () => {
  resetGroup();
  populateGroup(geometries[gui.params.geometry],materials[gui.params.material]);
}

const mergeObjectsInOneGeometry = (objects) => {
  let geometry = new THREE.Geometry();
  for (let i = 0; i < objects.length; i++){
      let mesh = objects[i];
      mesh.updateMatrix();
      geometry.merge(mesh.geometry, mesh.matrix);
  }
  return geometry;
}

init();


