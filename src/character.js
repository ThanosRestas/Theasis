import * as BABYLON from "@babylonjs/core/Legacy/legacy";


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
   
    healthUp(){
        console.log("Health Up");
        if(this.health < 20){
            this.health += 5;
            this.hud[0].width = this.health/100;
        }       
    }   

    healthDown(ammount){        
        if(this.health >=1){
            this.health -= ammount;
            this.hud[0].width = this.health/100;
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
        if(this.energy > 1){
            this.energy -= 0.1;
            this.hud[1].width = this.energy/100;            
        } 
    }
    
    characterController () {     
        
        let scene = this.scene;
        let gunLoadout = this.gunLoadout;
        let ammoHud = this.hud[2];       
        
        /*scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                switch (kbInfo.event.key) {                    
                case "w":
                    console.log("w");                    
                    this.energyDown();                           
                    break;

                case "a":
                    console.log("a");  
                    this.energyDown();                              
                    break;
                
                case "s":
                    console.log("s");  
                    this.energyDown();                              
                    break; 

                case "d":
                    console.log("d");  
                    this.energyDown();                              
                    break; 
                }
                break;
            }
        });*/    

        let movementKeys = ["w", "a", "s", "d"];
        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:                
                switch (movementKeys.includes(kbInfo.event.key.toString())) {                    
                case true:                                    
                    this.energyDown();                           
                    break;                
                }
                break;
            }
        });      
        
        // Canon physics for detecting collission with skull enemy projectile
        this.cameraImpostor[0].physicsImpostor.onCollideEvent = (e, t) =>{
            //console.log("Bullet collision with : " + t.object.name);
            // Check for "Bullet" substring inside of collision t object name
            if(t.object.name.substring(0, 6) == "Bullet"){
                
                t.object.dispose();
            }  

            this.healthDown(3);          
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
                        _this.keysBackward.indexOf(evt.keyCode) !== -1 ){
                        var index = _this._keys.indexOf(evt.keyCode);
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
                         _this.keysBackward.indexOf(evt.keyCode) !== -1) {
                        var index = _this._keys.indexOf(evt.keyCode);
                        if (index >= 0) {
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
                for (var index = 0; index < this._keys.length; index++) {
                    var keyCode = this._keys[index];
                    var speed = this.camera._computeLocalCameraSpeed();                
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

