var scene = new THREE.Scene();
// scene.background = new THREE.Color( 0xff0000 );

var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);



var camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();

renderer.setSize(400, 400);
document.body.appendChild(renderer.domElement);

var axesHelper = new THREE.AxesHelper(1000);
// scene.add(axesHelper);



// camera.position.z = 5;
setCamera()

var controls = new THREE.OrbitControls(camera, renderer.domElement);


//Texture 
var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load('image.jpg',
    function () {
        console.log("Loaded")
    }
);
texture.flipY = false;
var dataModel;

var loader = new THREE.GLTFLoader();
loader.load(
    // resource URL
    'throwPillow.obj.glb',
    // called when the resource is loaded
    function (gltf) {
        dataModel = gltf.scene
        dataModel.traverse(function (child) {
            if (child.isMesh) {
                console.log("Model")
                child.material.map = texture;
                child.geometry.center();

            }
        });

        scene.add(dataModel);

        var mroot = dataModel;
        var bbox = new THREE.Box3().setFromObject(mroot);
        var cent = bbox.getCenter(new THREE.Vector3());
        var size = bbox.getSize(new THREE.Vector3());

        //Rescale the object to normalized space
        var maxAxis = Math.max(size.x, size.y, size.z);
        mroot.scale.multiplyScalar(1.0 / maxAxis);
        bbox.setFromObject(mroot);
        bbox.getCenter(cent);
        bbox.getSize(size);
        //Reposition to 0,halfY,0
        mroot.position.copy(cent).multiplyScalar(-1);
        mroot.position.y -= (size.y * 0.5);


    },
    // called while loading is progressing
    function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    },
    // called when loading has errors
    function (error) {

        console.log(error + 'An error happened');

    }
);


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.setClearColor(0xFFFFFF);
    renderer.render(scene, camera);
}
animate();

function setCamera() {
    /* camera.position.x = -1.0840253698426148
    camera.position.y = 0.274478240781331 */
    camera.position.z = 1.5950948929386202
}

function loadTexture(x) {
    console.log(x.firstChild.src)
    texture = textureLoader.load(x.firstChild.src,
        function () {
            console.log("Loaded")
            dataModel.traverse(function (child) {
                if (child.isMesh) {
                    console.log("Model")
                    child.material.map = texture;
                }
            });
        }
    );

    
}