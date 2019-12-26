import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { AmmoJSPlugin } from "@babylonjs/core/Legacy/legacy";


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
        this.running = false;
        this.walking = false;
        this.standing = true;        
        // Index marking weapon in use
        this.currentWeapon = 0;
        // Getting the camera's physics impostor
        this.cameraImpostor = this.camera.getChildren();
        // Hud
        this.hud = game.hud;
        this.debug = false;

        
    }
   
    healthUp(){
        console.log("Health Up");
        if(this.health < 20){
            this.health += 5;
            this.hud[0].width = this.health/100;
        }       
    }   

    healthDown(ammount){    
        console.log(this.health);

        if(this.health >0){
            this.health -= ammount;
            this.hud[0].width = this.health/100;
        }
        else if(this.health <= 0){
            console.log("Game Over")
            //alert("Game Over");
            //location.reload();
        }        
    }   

    energyUp(){        
        console.log("Energy Up");
        if(this.energy < 20){
            this.energy += 5;
            this.hud[1].width = this.energy/100;            
        } 
    }

    energyDown(){
        //console.log("Energy Down");
        if(this.energy >= 0){
            this.energy -= 0.05;
            this.hud[1].width = this.energy/100;
            
            return true;
        }
        else{
            return false;
        }
       
    }
    
    ammoUp(weapon){       
        switch(weapon) {
            case "pistolAmmo":
                // code block
                console.log("Pistol ammo gained"); 
                this.gunLoadout[0].ammo += 20;
                break;

            case "shotgunAmmo":
                // code block
                console.log("Shotgun ammo gained")  
                this.gunLoadout[1].ammo += 10;            
                break; 
            
            case "akAmmo":
                // code block
                console.log("Ak47 ammo gained")   
                this.gunLoadout[2].ammo += 10;           
                break;  

            case "raygunAmmo":
                 // code block
                 console.log("Raygun ammo gained"); 
                 this.gunLoadout[3].ammo += 15;                
                 break;

             case "lightninggunAmmo":
                 // code block
                 console.log("Lightning gun ammo gained")   
                 this.gunLoadout[4].ammo += 5;                
                 break; 
        }

        this.hud[2].text =  String(this.gunLoadout[this.currentWeapon].ammo); 
    }
    

    
    characterController () {     
        
        let scene = this.scene;
        let gunLoadout = this.gunLoadout;
        let ammoHud = this.hud[2];
        let player = this;
        let walking = this.walking;  
        let running = this.running;
        let standing = this.standing;
        
        // Canon physics for detecting collission with skull enemy projectile
        this.cameraImpostor[0].physicsImpostor.onCollideEvent = (e, t) =>{
            //console.log("Bullet collision with : " + t.object.name);
            // Check for "Bullet" substring inside of collision t object name
            if(t.object.name.substring(0, 6) == "Bullet"){
                
                t.object.dispose();
            }  

            this.healthDown(2);          
        };

        // Create our own manager:
        var FreeCameraKeyboardRotateInput = function () {
            this._keys = [];
            this.keysLeft = [65];// A
            this.keysRight = [68];// D
            this.keysForward = [87]; // W
            this.keysBackward = [83]; // S              
        };
    
        // Hooking keyboard events
        FreeCameraKeyboardRotateInput.prototype.attachControl = function (element, noPreventDefault) {
            var _this = this;
            if (!this._onKeyDown) {
                element.tabIndex = 1;
                
                this._onKeyDown = function (evt) {  
                                    
                    if (_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        _this.keysRight.indexOf(evt.keyCode) !== -1 || 
                        _this.keysForward.indexOf(evt.keyCode) !== -1 || 
                        _this.keysBackward.indexOf(evt.keyCode) !== -1){
                        var index = _this._keys.indexOf(evt.keyCode);

                        player.walking = true;
                        player.standing = false;  
                        
                        if (index === -1) {                            
                            _this._keys.push(evt.keyCode);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }                       
                
                    }
                };
                this._onKeyUp = function (evt) {
                    
                    if (_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        _this.keysRight.indexOf(evt.keyCode) !== -1 ||
                         _this.keysForward.indexOf(evt.keyCode) !== -1 || 
                         _this.keysBackward.indexOf(evt.keyCode) !== -1 ) {
                        var index = _this._keys.indexOf(evt.keyCode);

                        player.walking = false;                        
                        player.standing = true;

                        if (index >= 0) {
                            //walking = false;
                            _this._keys.splice(index, 1);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                };
    
                element.addEventListener("keydown", this._onKeyDown, false);
                element.addEventListener("keyup", this._onKeyUp, false);
                BABYLON.Tools.RegisterTopRootEvents([
                    { name: "blur", handler: this._onLostFocus }
                ]);
            }
        };
    
        // Unhook
        FreeCameraKeyboardRotateInput.prototype.detachControl = function (element) {
            if (this._onKeyDown) {
                element.removeEventListener("keydown", this._onKeyDown);
                element.removeEventListener("keyup", this._onKeyUp);
                BABYLON.Tools.UnregisterTopRootEvents([
                    { name: "blur", handler: this._onLostFocus }
                ]);
                this._keys = [];
                this._onKeyDown = null;
                this._onKeyUp = null;
            }
        };
    
        // This function is called by the system on every frame
        FreeCameraKeyboardRotateInput.prototype.checkInputs = function () {
            
            if (this._onKeyDown) {
                // Keyboard
                //console.log(walking);
                for (var index = 0; index < this._keys.length; index++) {
                    //walking = true;
                    var keyCode = this._keys[index];
                    var speed = this.camera._computeLocalCameraSpeed();
                    if (this.keysLeft.indexOf(keyCode) !== -1) {                    
                        this.camera._localDirection.copyFromFloats(-speed, 0, 0);
                    }
                    else if (this.keysRight.indexOf(keyCode) !== -1) {
                        this.camera._localDirection.copyFromFloats(+speed, 0, 0);
                    }
                    else if (this.keysBackward.indexOf(keyCode) !== -1){
                        this.camera._localDirection.copyFromFloats(0, 0, -speed);
                    }
                    else if (this.keysForward.indexOf(keyCode) !== -1){
                        this.camera._localDirection.copyFromFloats(0, 0, +speed);
                    }
               
                    if (this.camera.getScene().useRightHandedSystem) {
                        this.camera._localDirection.z *= -1;
                    }
    
                    this.camera.getViewMatrix().invertToRef(this.camera._cameraTransformMatrix);
                    BABYLON.Vector3.TransformNormalToRef(this.camera._localDirection, this.camera._cameraTransformMatrix, this.camera._transformedDirection);
                    this.camera.cameraDirection.addInPlace(this.camera._transformedDirection);                
                }            
            }        
        };   
    
        FreeCameraKeyboardRotateInput.prototype.getTypeName = function () {
            return "FreeCameraKeyboardRotateInput";
        };
        FreeCameraKeyboardRotateInput.prototype._onLostFocus = function () {
            this._keys = [];
        };
        FreeCameraKeyboardRotateInput.prototype.getSimpleName = function () {
            return "keyboardRotate";
        };
    
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

                case "4":
                    console.log("RayGun selected");
                    this.currentWeapon = 3;
                    ammoHud.text = String(gunLoadout[this.currentWeapon].ammo);
                    weaponSwitch(gunLoadout,  this.currentWeapon);
                    break;
                    
                case "5":
                    console.log("LightningGun selected");
                    this.currentWeapon = 4;
                    ammoHud.text = String(gunLoadout[this.currentWeapon].ammo);
                    weaponSwitch(gunLoadout,  this.currentWeapon);
                    break;

                case "Shift":
                    //console.log("Shift presssed");
                    player.running = true;
                    //this.scene.debugLayer.hide();
                    break;

                case "`":
                    console.log("Debug mode enabled");
                   
                    if(this.debug){
                        this.scene.debugLayer.hide();
                        this.debug = false;
                    }
                    else{
                        this.scene.debugLayer.show();
                        this.debug = true;
                    }
                    break;
                }                
                break;

            case BABYLON.KeyboardEventTypes.KEYUP:
                switch (kbInfo.event.key) {   
                case "Shift":
                        //console.log("Shift Released");
                        player.running = false;
                       
                        break;
                    }                
                    break;
            }
        });
        
        
        scene.onBeforeRenderObservable.add(function(){
            //console.log("Standing : " + player.standing + " Walking : " + player.walking + " Running : " + player.running)
            if(player.running && !player.standing && player.walking && player.energyDown()) {
                //console.log("Running");
                player.camera.speed = 0.8;
            } 
            else{
                //console.log("Not Running");
                player.camera.speed = 0.4;
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

