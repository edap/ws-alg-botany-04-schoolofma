const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});

let init = () => {
  // set the renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0cbcff, 1);
  document.body.style.margin =0;
  document.body.appendChild(renderer.domElement);
  camera.position.z = 80;
  controls = new THREE.OrbitControls( camera, renderer.domElement );

  // set a light
  let light = new THREE.PointLight( 0xffffff, 1, 0 );
  light.position.set( 100, 200, 0);
  scene.add( light);

  // draw axis, just to know where the x, y and z axis are
  let axisHelper = new THREE.AxesHelper( 50 );
  scene.add( axisHelper );

  // when resizing the window, keep the proportions
  window.addEventListener('resize', function() {
      let WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
  });

  // create a mesh and add it to the scene.
  let material = new THREE.MeshStandardMaterial( {color: 0xff5c05} );
  let geom = new THREE.SphereGeometry(10, 100, 100);
  let mesh = new THREE.Mesh(geom, material);
  scene.add(mesh);

  render();
};

let render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

init();

