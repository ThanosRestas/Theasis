import Weapon from "./weapon"
import * as BABYLON from "@babylonjs/core/Legacy/legacy"
import { MultiPointerScaleBehavior } from "@babylonjs/core/Legacy/legacy";

export default class Character{
    constructor(game){
        // World info
        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.camera.position.z = 5;
        // Player info
        this.gunLoadout = [];
        this.health = 20;
        this.energy = 20;        
        // Index marking weapon in use
        this.currentWeapon = 0;
        // Getting the camera's physics impostor
        this.cameraImpostor = this.camera.getChildren();
        // Hud
        this.hud = game.hud;
    }

    damage(ammount){
        //let health = this.health;

        if(this.health >=1){
            this.health -= ammount;
            this.hud[0].width = this.health/100;
        }
        
    }
    
    characterController (hud) { 
          
        let camera = this.camera;
        let energy = this.energy;
        let scene = this.scene;
        let gunLoadout = this.gunLoadout;
        //let healthHud = hud[0];
        //let energyHud = hud[1];
        //let ammoHud = hud[2];   
        let healthHud = this.hud[0];
        let energyHud = this.hud[1];
        let ammoHud = this.hud[2];

        let health = this.health;        
        let cameraImpostor = this.cameraImpostor;

        // Detect collision between player and enemy and damange health        
        camera.onCollide = function (colMesh) {
            console.log(colMesh.name);

            if(colMesh.name === "energyPack"){
                console.log("Energy pack acquired");
                // Remove the energy pack from the scene and restore 20% energy to the player
                colMesh.dispose();
                if(energy < 20){
                    energy += 30;
                    if(energy >= 20){
                        energy = 20;
                    }
                } 
                energyHud.width = energy/100;                
            } 
            
            if(colMesh.name === "healthPack" || colMesh.name === "healthPack1"){
                console.log("Health pack acquired");
                // Remove the health pack from the scene and restore 10% health to the player
                colMesh.dispose();
                if(health < 20){
                    health += 0.5;
                } 
                healthHud.width = health/100;         
            }          
        }
        
        // Canon physics for detecting collission with skull enemy projectile
        cameraImpostor[0].physicsImpostor.onCollideEvent = (e, t) =>{
            //console.log("Bullet collision with : " + t.object.name);
            // Check for "Bullet" substring inside of collision t object name
            if(t.object.name.substring(0, 6) == "Bullet"){
                
                t.object.dispose();
            }            
            health -= 1;
            healthHud.width = health/100;          
        }

        // Create our own manager:
        var FreeCameraKeyboardRotateInput = function () {
            this._keys = []
            this.keysLeft = [65]// A
            this.keysRight = [68]// D
            this.keysForward = [87] // W
            this.keysBackward = [83] // S       
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
                        _this.keysBackward.indexOf(evt.keyCode) !== -1 ){
                        var index = _this._keys.indexOf(evt.keyCode)
                        if (index === -1) {
                            _this._keys.push(evt.keyCode)
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault()
                        }

                        // Energy Deprecation with each movement
                        if(energy >= 1){
                            energy -= 0.02;
                        }
                        // Setting the energy bar's width accordingly
                        energyHud.width = energy/100;
                        // Lessen camera speed because of the fatigue - Disabled for tasting purposes
                        //camera.speed = energy/100;                   
                    }
                }
                this._onKeyUp = function (evt) {
                    if (_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        _this.keysRight.indexOf(evt.keyCode) !== -1 ||
                         _this.keysForward.indexOf(evt.keyCode) !== -1 || 
                         _this.keysBackward.indexOf(evt.keyCode) !== -1) {
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
                    var speed = this.camera._computeLocalCameraSpeed()                
                    if (this.keysLeft.indexOf(keyCode) !== -1) {                    
                        this.camera._localDirection.copyFromFloats(-speed, 0, 0);
                        //console.log(this.camera.position.x);
                    }
                    else if (this.keysRight.indexOf(keyCode) !== -1) {
                        this.camera._localDirection.copyFromFloats(+speed, 0, 0);
                        //console.log(this.camera.position.x);
                    }
                    else if (this.keysBackward.indexOf(keyCode) !== -1){
                        this.camera._localDirection.copyFromFloats(0, 0, -speed);
                        //console.log(this.camera.position.z);
                    }
                    else if (this.keysForward.indexOf(keyCode) !== -1){
                        this.camera._localDirection.copyFromFloats(0, 0, +speed);
                        //console.log(this.camera.position.z);
                        
                    }
               
                    if (this.camera.getScene().useRightHandedSystem) {
                        this.camera._localDirection.z *= -1;
                    }
    
                    this.camera.getViewMatrix().invertToRef(this.camera._cameraTransformMatrix)
                    BABYLON.Vector3.TransformNormalToRef(this.camera._localDirection, this.camera._cameraTransformMatrix, this.camera._transformedDirection)
                    this.camera.cameraDirection.addInPlace(this.camera._transformedDirection)                
                }            
            }        
        }   
    
        FreeCameraKeyboardRotateInput.prototype.getTypeName = function () {
            return "FreeCameraKeyboardRotateInput";
        }
        FreeCameraKeyboardRotateInput.prototype._onLostFocus = function (e) {
            this._keys = [];
        }
        FreeCameraKeyboardRotateInput.prototype.getSimpleName = function () {
            return "keyboardRotate";
        }
    
        // Connect to camera:
        this.camera.inputs.add(new FreeCameraKeyboardRotateInput());
        
        //Weapon switching observable
        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                switch (kbInfo.event.key) {                    
                case "1":
                    console.log("Pistol selected");
                    this.currentWeapon = 0;
                    ammoHud.text = String(gunLoadout[this.currentWeapon].ammo);
                    weaponSwitch(gunLoadout,  this.currentWeapon);                    
                    break;

                case "2":
                    console.log("Shotgun selected");
                    this.currentWeapon = 1;
                    ammoHud.text = String(gunLoadout[this.currentWeapon].ammo);
                    weaponSwitch(gunLoadout,  this.currentWeapon);                    
                    break;                
                
                case "3":
                    console.log("Ak47 selected");
                    this.currentWeapon = 2;
                    ammoHud.text = String(gunLoadout[this.currentWeapon].ammo);
                    weaponSwitch(gunLoadout,  this.currentWeapon);
                    break;     
                }
                break;
            }
        });       

    }  
}

function weaponSwitch(gunLoadout, currentWeapon){
    // Make all meshes invisible   
    for(let i=0; i< gunLoadout.length; i++){
        gunLoadout[i].mesh.setEnabled(false);      
    }
    // Make desired weapon visible - in use
    gunLoadout[currentWeapon].mesh.setEnabled(true);
}

