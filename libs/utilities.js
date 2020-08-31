// utilities
class CollectionGeometries {
  constructor(){
      let lathePoints = [];
      for ( var i = 0; i < 10; i ++ ) {
          lathePoints.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 5 + 5, ( i - 5 ) * 2 ) );
      }

      let widthSegments = 32;
      let heightSegments = 32;
      let radius = 5;
      let geometries = {
          "sphere": new THREE.SphereGeometry(radius, widthSegments, heightSegments),
          "box": new THREE.BoxGeometry( radius, radius, radius, 4, 4, 4 ),
          "icosahedron" : new THREE.IcosahedronGeometry( radius, 0 ),
          "thorus" : new THREE.TorusGeometry( radius, 3, 16, 100 ),
          "lathe": new THREE.LatheGeometry( lathePoints )
      };
      return geometries;
  }
}

class CollectionMaterials {
  constructor(){
      let materials = {
          "standard": new THREE.MeshStandardMaterial(
              {color: 0x3c00, emissive:0x1b0808,metalness:0.07,roughness:0.43} ),
           "standard2": new THREE.MeshStandardMaterial(
                {color: 0xFFFF, emissive:0x1b0808,metalness:0.07,roughness:0.43} ),
          "wireframe": new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} ),
          "phong": new THREE.MeshPhongMaterial({color: 0x2194CE}),
          "lambert": new THREE.MeshLambertMaterial({color: 0x2194CE})
      };
      return materials;
  }
}

class BloomEffect{
    constructor(scene, camera, window){
        this.params = {
            exposure: 1,
            bloomStrength: 1.5,
            bloomThreshold: 0,
            bloomRadius: 0
          };
          const renderScene = new THREE.RenderPass( scene, camera );
          this.bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
          this.bloomPass.renderToScreen = true;
          this.bloomPass.threshold = this.params.bloomThreshold;
          this.bloomPass.strength = this.params.bloomStrength;
          this.bloomPass.radius = this.params.bloomRadius;
          this.composer = new THREE.EffectComposer( renderer );
          this.composer.setSize( window.innerWidth, window.innerHeight );
          this.composer.addPass( renderScene );
          this.composer.addPass( this.bloomPass );
    }

    render(){
        this.composer.render();
    }

    setSize(width, height){
        this.composer.setSize( width, height );
    }
}

class Gui extends dat.GUI{
  constructor(callbackExport, regenerateMesh){
      super(
          {
              load: JSON,
              preset: 'Flow'
          }
      );
      this.params = {
          geometry: "sphere",
          material: "standard",
          angle: 137.5,
          angle_y: 92.3,
          scale_x: 6.0,
          scale_y: 1.0,
          scale_z: 1.0,
          spread: 0.4,
          extrude: 0.5,
          num:3
      };
      // it does not work without a local server
      // this.remember(this.params);

      let saveMesh = { add:callbackExport};
      this.add(saveMesh, 'add').name('SAVE');


      this.add(this.params, "geometry", ["sphere", "box", "lathe", "icosahedron", "thorus"]).onChange(regenerateMesh);
      this.add(this.params, "angle").min(136.0).max(138.0).step(0.1).onChange(regenerateMesh);
      this.add(this.params, "angle_y").min(30.0).max(160.0).step(0.1);
      this.add(this.params, "scale_x").min(1.0).max(15.0).step(1);
      this.add(this.params, "scale_z").min(1.0).max(15.0).step(1);
      this.add(this.params, "spread").min(0.2).max(10.0).step(0.2).onChange(regenerateMesh);
      this.add(this.params, "extrude").min(0.0).max(5.0).step(0.1).onChange(regenerateMesh);
      this.add(this.params, "num").min(1).max(800).step(1).onChange(regenerateMesh);
      this.add(this.params, "material", ["standard", "wireframe", "phong","lambert"]).onChange(this._updateMaterialFolder(regenerateMesh));

  }

  addMaterials(materials){
      this.materials = materials;
  }

  addBloom(params, renderer, bloomPass){
    this.add( params, 'exposure', 0.1, 2 ).step( 0.01 ).onChange( function ( value ) {
        renderer.toneMappingExposure = Math.pow( value, 4.0 );
    } );
    this.add( params, 'bloomThreshold', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
        bloomPass.threshold = Number( value );
    } );
    this.add( params, 'bloomStrength', 0.0, 3.0 ).step( 0.01 ).onChange( function ( value ) {
        bloomPass.strength = Number( value );
    } );
    this.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
        bloomPass.radius = Number( value );
    } );
  }

  addScene ( scene, ambientLight, renderer ) {
      let folder = this.addFolder('Scene');
      let data = {
          background : "#000000",
          "ambient light" : ambientLight.color.getHex()
      };

      let color = new THREE.Color();
      let colorConvert = this._handleColorChange( color );

      folder.addColor( data, "background" ).onChange( function ( value ) {
          colorConvert( value );
          renderer.setClearColor( color.getHex() );

      } );

      folder.addColor( data, "ambient light" ).onChange( this._handleColorChange( ambientLight.color ) );
      //this.guiSceneFog( folder, scene );
  }

  guiSceneFog ( folder, scene ) {
      let fogFolder = folder.addFolder('scene.fog');
      let fog = new THREE.Fog( 0x3f7b9d, 0, 60 );
      let data = {
          fog : {
              "THREE.Fog()" : false,
              "scene.fog.color" : fog.color.getHex()
          }
      };

      fogFolder.add( data.fog, 'THREE.Fog()' ).onChange( function ( useFog ) {
          if ( useFog ) {
              scene.fog = fog;
          } else {
              scene.fog = null;
          }
      } );
      fogFolder.addColor( data.fog, 'scene.fog.color').onChange( this._handleColorChange( fog.color ) );
  }

  addAnimation(){
    let animFolder = this.addFolder('animation');
    let data = {
        anim : {
            "spread" : false,
            "amplitude" : 7.1,
            "freq" : 0.01,
            "zoetrope" : false,
            "zoetrope_angle" : 0.6
        }
    }
    this.params.anim = data.anim;
    animFolder.add(data.anim, "freq").min(0.01).max(0.2).step(0.01);
    animFolder.add(data.anim, "amplitude").min(0.0).max(15.0).step(0.025);
    animFolder.add(data.anim, "spread");
    animFolder.add(data.anim, "zoetrope");
    animFolder.add(data.anim, "zoetrope_angle").min(0.0).max(1.5).step(0.01);
  }

  _handleColorChange ( color ) {
      return function ( value ){
          if (typeof value === "string") {
              value = value.replace('#', '0x');
          }
          color.setHex( value );
      };
  }

  _updateMaterialFolder(meshCallback){
      return ( material ) => {
          if (!this.materials){
              console.log(
                  "If you want to edit the materials in the GUI, you have to add them using gui.addMaterials"
              );
              return;
          };
          switch (material) {
              case "phong":
                  this._addPhongMaterial(this.materials[material]);
                  break;
              case "standard":
                  this._addStandardMaterial(this.materials[material]);
                  break;
              case "wireframe":
                  this._addMaterialColor(this.materials[material]);
                  break;
              case "lambert":
                  this._addLambertMaterial(this.materials[material]);
                  break;
              default:
              this._addMaterialColor(this.materials[material]);
          }
          meshCallback();
      };
  }


  _removeFolder(name) {
      let folder = this.__folders[name];
      if (!folder) {
          return;
      }
      folder.close();
      this.__ul.removeChild(folder.domElement.parentNode);
      delete this.__folders[name];
      this.onResize();
  }

  _addPhongMaterial (material) {
      this._removeFolder("Material");
      var folder = this.addFolder('Material');
      var data = {
          color : material.color.getHex(),
          emissive : material.emissive.getHex(),
          specular : material.specular.getHex()
      };

      folder.addColor( data, 'color' ).onChange( this._handleColorChange( material.color ) );
      folder.addColor( data, 'emissive' ).onChange( this._handleColorChange( material.emissive ) );
      folder.addColor( data, 'specular' ).onChange( this._handleColorChange( material.specular ) );
      folder.add( material, 'shininess', 0, 100);
      folder.add( material, 'wireframe' );
      folder.add( material, 'fog' );
  }

  _addStandardMaterial (material) {
      this._removeFolder("Material");
      var folder = this.addFolder('Material');
      let data = {
          color : material.color.getHex(),
          emissive : material.emissive.getHex()
      };

      folder.addColor( data, 'color' ).onChange( this._handleColorChange( material.color ) );
      folder.addColor( data, 'emissive' ).onChange( this._handleColorChange( material.emissive ) );
      folder.add( material, 'roughness', 0, 1 );
      folder.add( material, 'metalness', 0, 1 );
      folder.add( material, 'wireframe' );
      folder.add( material, 'fog' );
  }
  _addLambertMaterial(material){
      this._removeFolder("Material");
      let folder = this.addFolder('Material');
      let data = {
          color : material.color.getHex(),
          emissive : material.emissive.getHex()
      };

      folder.addColor( data, 'color' ).onChange( this._handleColorChange( material.color ) );
      folder.addColor( data, 'emissive' ).onChange( this._handleColorChange( material.emissive ) );
      folder.add( material, 'wireframe' );
      folder.add( material, 'fog' );
      folder.add( material, 'reflectivity', 0, 1 );
      folder.add( material, 'refractionRatio', 0, 1 );
  }

  _addMaterialColor(material){
      this._removeFolder("Material");
      var folder = this.addFolder('Material');
      let data = {
          color : material.color.getHex()
      };
      folder.addColor( data, 'color' ).onChange( this._handleColorChange( material.color ) );
  }
}


function exportMeshAsJson(geometry){
    let json = geometry.toJSON();
    let string = JSON.stringify(json);
    let blob = new Blob([string], {type: "octet/stream"});
    saveAs(blob, randomName()+".json");
}

function exportMeshAsObj(scene){
    var exporter = new THREE.OBJExporter();
    var result = exporter.parse(scene);
    var blob = new Blob([result], {type: 'text/plain'});
    saveAs(blob, randomName()+".obj");
}

function randomName(){
    var d = new Date();
    var n = d.getTime();
    return n;
}

