/* eslint-disable semi */
/* eslint-disable linebreak-style */
/* eslint-disable no-irregular-whitespace */
import * as BABYLON from "@babylonjs/core/Legacy/legacy"
import "@babylonjs/core/Meshes/meshBuilder"
import { GridMaterial } from "@babylonjs/materials"
import { _BabylonLoaderRegistered, BoundingBox, RotationGizmo } from "@babylonjs/core/Legacy/legacy"
import "@babylonjs/loaders/OBJ";

let game;

class Engine{
    constructor(){
        // Scene setup
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas);       
        this.scene = new BABYLON.Scene(this.engine);
        this.active = false;
        
        // Camera setup
        this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2.01, -8), this.scene);        
        this.camera.attachControl(this.canvas, true);
        this.camera.speed = 0.2;       
        this.camera.ellipsoid = new BABYLON.Vector3(1, 1, 1); // Collision box for the camera
        this.camera.checkCollisions = true;
        this.camera.applyGravity = true; 

        // Enable collisions and gravity in scene
        this.scene.collisionsEnabled = true
        this.scene.gravity = new BABYLON.Vector3(0, -1, 0)  
    }
}

function main(){
    game = new Engine();   
}


function assetLoader(){
    // Add lights to the scene
    var light0 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-2, -5, 2), game.scene)
    var light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, -5, -2), game.scene) 

    var assetsManager = new BABYLON.AssetsManager(game.scene);     
    // Called when a single task has been sucessfull
    assetsManager.onTaskSuccessObservable.add(function(task) {        
        //console.log("task successful", task);

        // Setting ground material
        var ground = game.scene.getMeshByName("ground");
        ground.material = new GridMaterial("groundMaterial", game.scene)    
        ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1)
        ground.material.backFaceCulling = false
        
        var gun = game.scene.getMeshByName("SMDImport");
        gun.parent = game.camera;        
        gun.rotation.z =  Math.PI;        
        gun.rotation.y = -Math.PI;
        gun.scaling = new BABYLON.Vector3( 0.1, 0.1, 0.1);
        gun.position = new BABYLON.Vector3(1, -1, 1);
          
    }); 
    // Called when all tasks in the assetsManger are done
    assetsManager.onTasksDoneObservable.add(function(tasks) {

        var errors = tasks.filter(function(task) {return task.taskState === BABYLON.AssetTaskState.ERROR});
        var successes = tasks.filter(function(task) {return task.taskState !== BABYLON.AssetTaskState.ERROR}); 
        //console.log(tasks);
    });

    // We add single tasks to the assetsManager
    assetsManager.addMeshTask("task", "", "../assets/models/", "test4.babylon");
    assetsManager.addMeshTask("task", "", "../assets/models/", "deagle.obj");

    // Now let the assetsManger load/excecute every task
    assetsManager.load();
}


function pointerLock(){
    var isLocked = false

    game.scene.onPointerDown = function (evt) {

        if (document.pointerLockElement !== game.canvas) {
            console.log("Was Already locked: ", document.pointerLockElement === game.canvas)

            if (!isLocked) {
                game.canvas.requestPointerLock = game.canvas.requestPointerLock || game.canvas.msRequestPointerLock || game.canvas.mozRequestPointerLock || game.canvas.webkitRequestPointerLock || false
                
                if (game.canvas.requestPointerLock) {
                    game.canvas.requestPointerLock()
                }
            }
        }
        //continue with shooting requests or whatever :P
        //evt === 0 (left mouse click)
        //evt === 1 (mouse wheel click (not scrolling))
        //evt === 2 (right mouse click)
    }

    // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
    var pointerlockchange = function () {
        var controlEnabled = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || false

        // If the user is already locked
        if (!controlEnabled) {
            game.camera.detachControl(game.canvas)
            game.active = false;
            isLocked = false
            
        } else {
            game.camera.attachControl(game.canvas)
            game.active = true;
            isLocked = true
        }
    }

    // Attach events to the document
    document.addEventListener("pointerlockchange", pointerlockchange, false)
    document.addEventListener("mspointerlockchange", pointerlockchange, false)
    document.addEventListener("mozpointerlockchange", pointerlockchange, false)
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false)
}


function cameraManager(){

    var camera = game.camera    
    // Create our own manager:
    var FreeCameraKeyboardRotateInput = function () {
        this._keys = []
        this.keysLeft = [65]// A
        this.keysRight = [68]// D
        this.keysForward = [87] // W
        this.keysBackward = [83] // S
        this.keysJump = [32] // Spacebar
        
    }

    // Hooking keyboard events
    FreeCameraKeyboardRotateInput.prototype.attachControl = function (element, noPreventDefault) {
        var _this = this
        if (!this._onKeyDown) {
            element.tabIndex = 1
            this._onKeyDown = function (evt) {
                if (_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                    _this.keysRight.indexOf(evt.keyCode) !== -1 || 
                    _this.keysForward.indexOf(evt.keyCode) !== -1 || 
                    _this.keysBackward.indexOf(evt.keyCode) !== -1 ||
                    _this.keysJump.indexOf(evt.keyCode) !== -1){
                    var index = _this._keys.indexOf(evt.keyCode)
                    if (index === -1) {
                        _this._keys.push(evt.keyCode)
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault()
                    }
                }
            }
            this._onKeyUp = function (evt) {
                if (_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                    _this.keysRight.indexOf(evt.keyCode) !== -1 ||
                     _this.keysForward.indexOf(evt.keyCode) !== -1 || 
                     _this.keysBackward.indexOf(evt.keyCode) !== -1 ||
                     _this.keysJump.indexOf(evt.keyCode) !== -1) {
                    var index = _this._keys.indexOf(evt.keyCode)
                    if (index >= 0) {
                        _this._keys.splice(index, 1)
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault()
                    }
                }
            }

            element.addEventListener("keydown", this._onKeyDown, false)
            element.addEventListener("keyup", this._onKeyUp, false)
            BABYLON.Tools.RegisterTopRootEvents([
                { name: "blur", handler: this._onLostFocus }
            ])
        }
    }

    // Unhook
    FreeCameraKeyboardRotateInput.prototype.detachControl = function (element) {
        if (this._onKeyDown) {
            element.removeEventListener("keydown", this._onKeyDown)
            element.removeEventListener("keyup", this._onKeyUp)
            BABYLON.Tools.UnregisterTopRootEvents([
                { name: "blur", handler: this._onLostFocus }
            ])
            this._keys = []
            this._onKeyDown = null
            this._onKeyUp = null
        }
    }

    // This function is called by the system on every frame
    FreeCameraKeyboardRotateInput.prototype.checkInputs = function () {
        
        if (this._onKeyDown) {
            // Keyboard
            for (var index = 0; index < this._keys.length; index++) {
                var keyCode = this._keys[index]
                var speed = camera._computeLocalCameraSpeed()                
                if (this.keysLeft.indexOf(keyCode) !== -1) {                    
                    camera._localDirection.copyFromFloats(-speed, 0, 0)
                }
                else if (this.keysRight.indexOf(keyCode) !== -1) {
                    camera._localDirection.copyFromFloats(+speed, 0, 0)
                }
                else if (this.keysBackward.indexOf(keyCode) !== -1){
                    camera._localDirection.copyFromFloats(0, 0, -speed)
                }
                else if (this.keysForward.indexOf(keyCode) !== -1){
                    camera._localDirection.copyFromFloats(0, 0, +speed)
                }
                else if (this.keysJump.indexOf(keyCode) !== -1  && camera.canJump == true ){
                    //camera.cameraDirection.copyFromFloats(0, 1.2, 0) // Disabled for now
                    //camera.canJump = false                                     
                }        

                if (camera.getScene().useRightHandedSystem) {
                    camera._localDirection.z *= -1
                }

                camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix)
                BABYLON.Vector3.TransformNormalToRef(camera._localDirection, camera._cameraTransformMatrix, camera._transformedDirection)
                camera.cameraDirection.addInPlace(camera._transformedDirection)                
            }            
        }        
    }   

    FreeCameraKeyboardRotateInput.prototype.getTypeName = function () {
        return "FreeCameraKeyboardRotateInput"
    }
    FreeCameraKeyboardRotateInput.prototype._onLostFocus = function (e) {
        this._keys = []
    }
    FreeCameraKeyboardRotateInput.prototype.getSimpleName = function () {
        return "keyboardRotate"
    }

    // Connect to camera:
    game.camera.inputs.add(new FreeCameraKeyboardRotateInput())   
}


function render(){
    // Render every frame
    game.engine.runRenderLoop(() => {
        game.scene.render()
        //console.log(game.camera.position);                  
    })   
}




//When click event is raised
window.addEventListener("click", function () {
    // We try to pick an object
    var width  =  game.scene.getEngine().getRenderWidth();
    var height = game.scene.getEngine().getRenderHeight();
    //var pickResult = game.scene.pick(game.scene.pointerX, game.scene.pointerY);
    var pickResult = game.scene.pick(width/2, height/2);
    var model = pickResult.pickedMesh;
    //range max range == z = 60
    if(game.active == true && pickResult !== null && model !== null){
        console.log(model.name);
        game.scene.getMeshByName(model.name).dispose();
        
    }

    //Animate the gun
    var array = game.camera.getChildren();
    var gun = array[0];
    //console.log(array[0]);
    // The initial rotation is the initial mesh rotation
    var start = gun.rotation;
    var end = start.clone();
    // The actual rotation of the mesh
    end.x += Math.PI/10;

    // Create the Animation object
    var display = new BABYLON.Animation(
        "fire",
        "rotation",
        60,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    // Animations keys
    var keys = [{
        frame: 0,
        value: start
    },{
        frame: 10,
        value: end
    },{
        frame: 100,
        value: start
    }];

    display.setKeys(keys);

    gun.animations.push(display);
    
    game.scene.beginAnimation(gun, 0, 100, false);
    
})



main();
assetLoader();
pointerLock();
cameraManager();
render();



