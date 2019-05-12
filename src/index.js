/* eslint-disable semi */
/* eslint-disable linebreak-style */
/* eslint-disable no-irregular-whitespace */
import * as BABYLON from "@babylonjs/core/Legacy/legacy"
import "@babylonjs/core/Meshes/meshBuilder"
import { GridMaterial } from "@babylonjs/materials"
import { _BabylonLoaderRegistered, BoundingBox } from "@babylonjs/core/Legacy/legacy"
import "@babylonjs/loaders/OBJ";

let game;

class Engine{
    constructor(){
        // Scene setup
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas);       
        this.scene = new BABYLON.Scene(this.engine);
        
        // Camera setup
        this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, -7.99, -20), this.scene);        
        this.camera.attachControl(this.canvas, true);
        this.camera.speed = 0.2;       
        this.camera.ellipsoid = new BABYLON.Vector3(1, 1, 1); // Collision box for the camera
        this.camera.checkCollisions = true;
        this.camera.applyGravity = true; 
        this.canJump = true;      

        // Enable collisions and gravity in scene
        this.scene.collisionsEnabled = true
        this.scene.gravity = new BABYLON.Vector3(0, -0.2, 0)  
    }

    // Unused
    checkJump(context){
        // Check if player/camera is on ground/crate and set its ability to jump        
        this.camera.onCollide = function (colMesh) {
            if (colMesh.uniqueId === context.scene.getMeshByName("ground").uniqueId || colMesh.uniqueId === context.scene.getMeshByName("crate".uniqueId)) {          
                context.camera.canJump = true;
            }
        }    
    }    
}

function main(){
    game = new Engine()
    
    // Add lights to the scene
    var light0 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-2, -5, 2), game.scene)
    var light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, -5, -2), game.scene)
    
    // Add ground with grid texture   
    var ground = BABYLON.Mesh.CreatePlane("ground", 20.0, game.scene)
    ground.material = new GridMaterial("groundMaterial", game.scene)    
    ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1)
    ground.material.backFaceCulling = false
    ground.position = new BABYLON.Vector3(5, -10, -15)
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0)

    // Finally, say which mesh will be collisionable   
    ground.checkCollisions = true;

    var assetsManager = new BABYLON.AssetsManager(game.scene);
    
    // Called when a single task has been sucessfull
    assetsManager.onTaskSuccessObservable.add(function(task) {
        if(task.name == "task"){
            task.loadedMeshes[0].parent = game.scene.getMeshByName("ground");
            task.loadedMeshes[0].setPositionWithLocalVector(new BABYLON.Vector3(0, 8, 0)) // x == z , y == z, z == y from player's view
            task.loadedMeshes[0].rotation = new BABYLON.Vector3(-Math.PI / 2, 0, 0) ;          
    
            //Simple invisble crate that acts as a hitbox to avoid expensive pixel-perfect collision
            var box = BABYLON.MeshBuilder.CreateBox("myBox", {height: 1.5, width: 0.50, depth: 1}, game.scene);
            box.isVisible = false;    
            box.setPositionWithLocalVector(new BABYLON.Vector3(0, 1, 0))
            box.showBoundingBox = true;
            box.parent =  task.loadedMeshes[0];
            box.checkCollisions = true;
        }
        else if( task.name == "task2"){
            task.loadedMeshes[0].parent = game.scene.getMeshByName("ground");
            task.loadedMeshes[0].setPositionWithLocalVector(new BABYLON.Vector3(-6, 8, -4)) // x == z , y == z, z == y from player's view
            task.loadedMeshes[0].rotation = new BABYLON.Vector3(-Math.PI / 2, 0, 0) ; 
            task.loadedMeshes[0].scaling = new  BABYLON.Vector3( 0.1,  0.1,  0.1) ;         
        }
        else if( task.name == "task3"){
            task.loadedMeshes[0].parent = game.camera;
            task.loadedMeshes[0].setPositionWithLocalVector(new BABYLON.Vector3(2, -1.5, 4)) // x == z , y == z, z == y from player's view
            task.loadedMeshes[0].rotation = new BABYLON.Vector3( Math.PI, -0.2, 0) ; 
            task.loadedMeshes[0].scaling = new  BABYLON.Vector3( 0.1,  0.1,  0.1) ;         
        }
        //console.log('task successful', task);
    });

    // Called when all tasks in the assetsManger are done
    assetsManager.onTasksDoneObservable.add(function(tasks) {
        var errors = tasks.filter(function(task) {return task.taskState === BABYLON.AssetTaskState.ERROR});
        var successes = tasks.filter(function(task) {return task.taskState !== BABYLON.AssetTaskState.ERROR});

        //console.log(tasks);
    }); 

    // We add single tasks to the assetsManager
    assetsManager.addMeshTask("task", "", "../assets/models/", "dummy.babylon");
    assetsManager.addMeshTask("task2", "", "../assets/models/", "skull.babylon");
    assetsManager.addMeshTask("task3", "", "../assets/models/", "deagle.obj");

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
            isLocked = false
        } else {
            game.camera.attachControl(game.canvas)
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
    })   
}


main();
//When click event is raised
window.addEventListener("click", function () {
    // We try to pick an object
    var pickResult = game.scene.pick(game.scene.pointerX, game.scene.pointerY);
    //console.log(pickResult.pickedMesh.name);
    //game.scene.getMeshByName.pickResult.pickedMesh.isVisible = true;

}),
pointerLock();
cameraManager();
render();



