export default class Character{
    constructor(game){
        this.game = game;
        this.scene = game.scene
        this.camera = game.camera

        this.health = 0
        this.energy = 0
        this.ammunition = 0
    }
    
  

    characterController(){
        var camera = this.camera;
        var game = this.game;       

        /*//Setting up the ray
        // We try to pick an object
        var width  =  game.scene.getEngine().getRenderWidth()
        var height = game.scene.getEngine().getRenderHeight()            
        
       
        var origin = game.camera.position;
        var forward = new BABYLON.Vector3(0, 0, 1);

        // vec to local
        var m = camera.getWorldMatrix();
        var v = BABYLON.Vector3.TransformCoordinates(forward, m);

        //forward = this.vecToLocal(forward, camera.position);
        forward = v;

        var direction = forward.subtract(origin);
        direction = BABYLON.Vector3.Normalize(direction);
        
        var length = 10000;
        var ray = new BABYLON.Ray(origin, direction, length);
        
        let rayHelper = new BABYLON.RayHelper(ray);		
        rayHelper.show(game.scene);

        var hit = game.scene.pickWithRay(ray);

        if (hit.pickedMesh){
            console.log(hit.pickedMesh);
        }*/
        
        
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
        this.camera.inputs.add(new FreeCameraKeyboardRotateInput())  

        //When click event is raised
        window.addEventListener("click", function () {       


            // We try to pick an object
            var width  =  game.scene.getEngine().getRenderWidth()
            var height = game.scene.getEngine().getRenderHeight()    

            
            var ray = game.camera.getForwardRay(10000);
            var hit = game.scene.pickWithRay(ray);
            var model = hit.pickedMesh;

            if(hit !== null && model !== null){
                console.log(model.name);
                game.scene.getMeshByName(model.name).dispose()
        
            }

            /*//Animate the gun
            var array = camera.getChildren()
            var gun = array[0]
            //console.log(array[0]);
            // The initial rotation is the initial mesh rotation
            var start = gun.rotation
            var end = start.clone()
            // The actual rotation of the mesh
            end.x += Math.PI/10           

            // Create the Animation object
            var display = new BABYLON.Animation(
                "fire",
                "rotation",
                60,
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)

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
            }]

            display.setKeys(keys)

            gun.animations.push(display)
    
            game.scene.beginAnimation(gun, 0, 100, false)*/               
                     
    
        })

    }    
}

