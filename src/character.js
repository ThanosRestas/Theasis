import Weapon from "./weapon"

export default class Character{
    constructor(game){
        this.game = game;
        this.scene = game.scene
        this.camera = game.camera

        this.health = 100;
        this.energy = 100;


        // Change into weapon array to store all weapons
        this.weapon;          
    }
    
    characterController () {      
        
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
                        this.camera._localDirection.copyFromFloats(-speed, 0, 0)
                    }
                    else if (this.keysRight.indexOf(keyCode) !== -1) {
                        this.camera._localDirection.copyFromFloats(+speed, 0, 0)
                    }
                    else if (this.keysBackward.indexOf(keyCode) !== -1){
                        this.camera._localDirection.copyFromFloats(0, 0, -speed)
                    }
                    else if (this.keysForward.indexOf(keyCode) !== -1){
                        this.camera._localDirection.copyFromFloats(0, 0, +speed)
                    }
               
                    if (this.camera.getScene().useRightHandedSystem) {
                        this.camera._localDirection.z *= -1
                    }
    
                    this.camera.getViewMatrix().invertToRef(this.camera._cameraTransformMatrix)
                    BABYLON.Vector3.TransformNormalToRef(this.camera._localDirection, this.camera._cameraTransformMatrix, this.camera._transformedDirection)
                    this.camera.cameraDirection.addInPlace(this.camera._transformedDirection)                
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
        this.camera.inputs.add(new FreeCameraKeyboardRotateInput());  
    }
}

