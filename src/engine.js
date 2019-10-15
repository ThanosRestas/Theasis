// Babylon
import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { GridMaterial } from "@babylonjs/materials";
import { FireMaterial } from  "@babylonjs/materials";
import { WaterMaterial } from  "@babylonjs/materials";
import "@babylonjs/loaders/glTF";
import * as GUI from "@babylonjs/gui";
// Physics
import * as cannon from "CANNON";
import CannonJSPlugin from "@babylonjs/core/Legacy/legacy";
// Utilities 
import Weapon from "./weapon";
import Enemy from "./enemy";
import Skeleton from "./skeleton";
import Dragon from "./dragon";
import Zombie from "./zombie";
import Collectible from "./collectible";

export default class Engine{
    constructor(){
        // Scene setup
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas);       
        this.scene = new BABYLON.Scene(this.engine);
        // Entities
        this.player;
        this.enemyList = [];
        this.collectibleList = [];    
        // Camera setup
        this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(-5, 2, 0), this.scene);        
        this.camera.attachControl(this.canvas, true);        
        this.camera.speed = 0.2;
        // Collision box for the camera -- Deprecated after cannon.js usage !?      
        this.camera.ellipsoid = new BABYLON.Vector3(1, 1, 1); 
        this.camera.checkCollisions = true;
        this.camera.applyGravity = true; 
        // Enable collisions and gravity in scene
        this.scene.collisionsEnabled = true;
        this.scene.gravity = new BABYLON.Vector3(0, -0.1, 0);    
        // Enable physics        
        this.physicsPlugin = new BABYLON.CannonJSPlugin(true, 10, cannon);
        this.scene.enablePhysics(new BABYLON.Vector3(0, 0, 0), this.physicsPlugin);
        // Camera physics impostor
        this.cameraImpostor = BABYLON.MeshBuilder.CreateSphere("CameraImpostor", { segments: 3, diameter: 2 }, this.scene);
        this.cameraImpostor.physicsImpostor = new BABYLON.PhysicsImpostor(this.cameraImpostor, 
            BABYLON.PhysicsImpostor.SphereImpostor, 
            { mass: 0, friction: 0.5, restition: 0.3 },
            this.scene);
        // Making the collision sphere invisible
        this.cameraImpostor.visibility = 5;
        // Assigning the collision sphere to the camera
        this.cameraImpostor.parent = this.camera;
        this.cameraImpostor.isPickable = false;    
        // HUD setup
        this.hud = this.hudManager();
        // Particle system setup
        this.particleSystem = new BABYLON.ParticleSystem("particles", 2000, this.scene);
        this.particleSystem.particleTexture = new BABYLON.Texture("../assets/textures/flare.png", this.scene);
        this.particleSystem.emitRate = 0;        
        this.particleSystem.start();        
        // Animations
        this.scene.animationsEnabled = true;
        this.animationRunning = false;

        // Enable debugging tools;
        //this.scene.debugLayer.show();
    }

    assetManager(){
        let camera = this.camera;
        let  scene = this.scene;
        let  player = this.player;
        let  enemyList = this.enemyList;
        let  collectibleList = this.collectibleList;
        // Add lights to the scene
        let  light4 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 50, 0), scene);
        light4.intensity = 2;
        // Asset loading
        let  assetsManager = new BABYLON.AssetsManager(scene);     
        // Called when a single task has been sucessfull
        assetsManager.onTaskSuccessObservable.add(function(task) {        
            //console.log("Tasks completed : ", task);
            // Enabling collisions on all ground sub sections
            let ground = scene.getMeshByName("ground");
            ground.checkCollisions = true;

            let dessert = scene.getMeshByName("dessert");
            dessert.checkCollisions = true;

            let forest = scene.getMeshByName("forest");
            forest.checkCollisions = true;

            let lakeGround = scene.getMeshByName("lakeGround");
            lakeGround.checkCollisions = true;

            let village = scene.getMeshByName("village");
            village.checkCollisions = true;

            scene.getMeshByName("Fence").checkCollisions = true;
            scene.getMeshByName("Fence.001").checkCollisions = true;
            scene.getMeshByName("Fence.002").checkCollisions = true;
            scene.getMeshByName("Fence.003").checkCollisions = true;
            scene.getMeshByName("Fence.004").checkCollisions = true;

            // Skybox setup
            var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
            var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../assets/textures/skybox/cartoon", scene);
            //skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../assets/textures/skybox/TropicalSunnyDay", scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
            skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            skybox.material = skyboxMaterial;  

            let waterPosition = scene.getMeshByName("lake");
            waterPosition.checkCollisions = true;
            let waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 512, 512, 32, scene, false);
            //waterMesh.position = waterPosition.position.clone();
            waterMesh.position.x = 0.12;
            waterMesh.position.y = -4;
            waterMesh.position.z = -111.59;
            //waterMesh.position.y -=1;
            waterMesh.scaling.x = 0.15;
            waterMesh.scaling.y = 0.2;
            waterMesh.scaling.z = 0.15;
            //waterMesh.y+= 1;
            let water = new WaterMaterial("water", scene);
            water.bumpTexture = new BABYLON.Texture("../assets/textures/waterbump.png", scene);
            // Water properties
            water.windForce = -20;
            water.waveHeight = 0.5;
            water.windDirection = new BABYLON.Vector2(1, 1);
            water.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6);
            water.colorBlendFactor = 0.3;
            water.bumpHeight = 0.1;
            water.waveLength = 0.7;
            // Add skybox and ground to the reflection and refraction            
            water.addToRenderList(waterPosition);
            water.addToRenderList(skybox);            
            // Assign the water material
            waterMesh.material = water;

            //Buildings setup
            let barn = scene.getTransformNodeByName("Barn").getChildMeshes();
            barn.forEach(function(entry){
                entry.checkCollisions = true;
            });
           
            //let groundSections = scene.getTransformNodeByName("ground").getChildMeshes();
            /*groundSections.forEach(function(entry) {
                entry.checkCollisions = true;
            });*/
            // Add enemy meshes to the scene
            addEnemy(enemyList, scene, player);
            // Add the weapon meshes to the scene
            addPistol(player, scene, camera);
            // Add the collectible meshes to the scene
            addCollectible(collectibleList, scene, player);           
        });         
        // Called when all tasks in the assetsManger are done
        assetsManager.onTasksDoneObservable.add(function(tasks) {
            var errors = tasks.filter(function(task) {return task.taskState === BABYLON.AssetTaskState.ERROR;});
            var successes = tasks.filter(function(task) {return task.taskState !== BABYLON.AssetTaskState.ERROR;});
            
            console.log("Errors: " + errors);
            console.log(successes);
        });
        // We add single tasks to the assetsManager
        // Level design load        
        assetsManager.addMeshTask("task2", "", "../assets/scenes/", "test181.glb");
        assetsManager.addMeshTask("task3", "", "../assets/models/", "Pistol.glb");        
        assetsManager.addMeshTask("task4", "", "../assets/models/", "Skeleton1.glb");
        assetsManager.addMeshTask("task5", "", "../assets/models/", "Skeleton2.glb");
        assetsManager.addMeshTask("task6", "", "../assets/models/", "Dragon.glb");   
        assetsManager.addMeshTask("task3", "", "../assets/models/", "RayGun.glb"); 
        assetsManager.addMeshTask("task3", "", "../assets/models/", "LightningGun.glb");
        assetsManager.addMeshTask("task6", "", "../assets/models/", "Zombie1.glb");                               
        // Now let the assetsManager load/excecute every task
        assetsManager.load();
    }

    pointerLock(){
        let canvas = this.canvas;
        let scene = this.scene;
        let camera = this.camera;
        let player = this.player;
        let hud = this.hud;
        let isLocked = false;
        let enemyList = this.enemyList;
        //let particleSystem = this.particleSystem;
        let animationRunning = this.animationRunning;        
        let animation = null;

        // crosshair
        var aim = BABYLON.Mesh.CreateSphere("aim1", 16, 0.01, scene);
        aim.parent = camera;
        aim.position.z = 2; 
        aim.isPickable = false;
        
        // Mouse input manager   
        scene.onPointerDown = function (evt) {            
            // Getting the current weapon and setting the ammo info
            let currentWeapon = player.currentWeapon;
            currentWeapon = player.gunLoadout[currentWeapon];

            if (document.pointerLockElement !== canvas) {
                console.log("Was Already locked: ", document.pointerLockElement === canvas);
    
                if (!isLocked) {
                    canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock || false;
                    
                    if (canvas.requestPointerLock) {
                        canvas.requestPointerLock();
                    }
                }
            }
            // continue with shooting requests or whatever :P
            // evt === 0 (left mouse click)
            // evt === 1 (mouse wheel click (not scrolling))
            // evt === 2 (right mouse click)          
            if(evt.button == 0){                
                // Play current Weapon's animation
                //console.log(animationRunning);               
                if(animationRunning == false){
                    // Shoot only when an animation has ended
                    //console.log("Animation running");
                    animation = scene.beginAnimation( currentWeapon.mesh, 0, 100, false, currentWeapon.animationSpeed);
                    scene.animationGroups[1].start(false, 2); // Pistol      
                    animationRunning = true;
                    animation.onAnimationEndObservable.add(function(){
                        //console.log("Animation ended");
                        animationRunning = false;
                    });   
                    // Remove ammo from current weapon's magazine               
                    if(currentWeapon.ammo > 0){
                        currentWeapon.ammo -= 1;                      
                    }

                    var predicate = function(mesh) {

                        return mesh.isPickable && mesh.isEnabled();
                    };
                    // Shoot at camera's ray target according to each weapon's range    
                    let ray = camera.getForwardRay(currentWeapon.range);
                    let hit = scene.pickWithRay(ray, predicate);                  
                    let model = hit.pickedMesh;      
                    //console.log(model);              
                    // Exempt ground from the be shot at
                    if(hit !== null && model !== null && model.name != "ground" && currentWeapon.ammo > 0){                        
                        for(let i = 0; i < enemyList.length ; i++){
                            if(enemyList[i].name == model.parent.name || (model.parent.parent && enemyList[i].name == model.parent.parent.name)){ 
                                // Damage enemy                          
                                if(enemyList[i].health > 0){                                
                                    enemyList[i].health -= currentWeapon.damage;
                                    console.log("Target Hit :" + model.parent.name + " Health :" + enemyList[i].health );    
                                }
                                // Destroy enemy    
                                if(enemyList[i].health <= 0){                                                            
                                    enemyList[i].destroy();                                                                                               
                                    break;                               
                                }    
                            }
                        }                      
                    }                   
                }                               
            }                                           
            // Update HUD
            hud[2].text = String(player.gunLoadout[player.currentWeapon].ammo);              
        }; 
        // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
        var pointerlockchange = function () {
            var controlEnabled = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || false;
            
            // If the user is already locked
            if (!controlEnabled) {
                camera.detachControl(canvas);                
                isLocked = false;
                
            } else {
                camera.attachControl(canvas);                
                isLocked = true;
                this.active = true;
            }
        };    
        // Attach events to the document
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    }

    hudManager(){        
        // GUI setup
        var advancedTexture = new GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
        // Array filled with our three info bars
        var hudComponents = [];

        // Health bar
        var healthBar = new GUI.Rectangle("healthBar");
        healthBar.left = -500;
        healthBar.top = 400;
        healthBar.width = 0.2;
        healthBar.height = "20px";
        healthBar.cornerRadius = 20;
        healthBar.color = "white";
        healthBar.thickness = 4;
        healthBar.background = "red";
        advancedTexture.addControl(healthBar);
        
        // Energy Bar
        var energyBar = new GUI.Rectangle("energyBar");
        energyBar.left = -500;
        energyBar.top = 430;
        energyBar.width = 0.2;
        energyBar.height = "20px";
        energyBar.cornerRadius = 20;
        energyBar.color = "white";
        energyBar.thickness = 4;
        energyBar.background = "blue";
        advancedTexture.addControl(energyBar); 

        // Ammo bar
        var ammoBar = new GUI.TextBlock();
        ammoBar.color = "black";
        ammoBar.fontSize = 24;
        ammoBar.top = 350;
        ammoBar.left = -500;
        advancedTexture.addControl(ammoBar);

        hudComponents.push(healthBar, energyBar, ammoBar);

        return hudComponents;
    } 

    render(){
        // Render every frame
        this.engine.runRenderLoop(() => {                       
            this.scene.render();            
        });    
    }
}

function addPistol(player, scene, camera){    // Getting the gun models from the scene and load them into the loadout    
    player.gunLoadout.push(scene.getTransformNodeByName("PistolArmature").parent);   
    player.gunLoadout.push(scene.getTransformNodeByName("shotgun"));
    player.gunLoadout.push(scene.getTransformNodeByName("ak47"));    
    player.gunLoadout.push(scene.getTransformNodeByName("RayGun").parent);
    player.gunLoadout.push(scene.getTransformNodeByName("Lightning Gun").parent);    
    // Set pistol's attributes for proper positioning
    player.gunLoadout[0].parent = camera;
    player.gunLoadout[0].scaling.x  *= 0.10;
    player.gunLoadout[0].scaling.y  *= 0.10;  
    player.gunLoadout[0].scaling.z  *= 0.10;
    player.gunLoadout[0].position = new BABYLON.Vector3(0.8, -0.1, 3);
    player.gunLoadout[0].rotationQuaternion = null;     
    player.gunLoadout[0].rotation.y =   - 3.8 * Math.PI / 7;    
    // Set shotgun's attributes for proper positioning  
    player.gunLoadout[1].parent = camera;
    player.gunLoadout[1].rotation.y = Math.PI/2;    
    player.gunLoadout[1].position = new BABYLON.Vector3(1, -1, 3);
    // Set ak47's attributes for proper positioning
    player.gunLoadout[2].parent = camera;    
    player.gunLoadout[2].position = new BABYLON.Vector3(0.7, -0.75, 2.5);
    // Set Ray Gun's attributes
    player.gunLoadout[3].parent = camera;
    player.gunLoadout[3].scaling.x  *= 0.20;
    player.gunLoadout[3].scaling.y  *= 0.20;  
    player.gunLoadout[3].scaling.z  *= 0.20;
    player.gunLoadout[3].position = new BABYLON.Vector3(0.3, -0.5, 1.5);    
    player.gunLoadout[3].rotationQuaternion = null;
    // Set Ray Gun's attributes
    player.gunLoadout[4].parent = camera;
    player.gunLoadout[4].scaling.x  *= 0.10;
    player.gunLoadout[4].scaling.y  *= 0.10;  
    player.gunLoadout[4].scaling.z  *= 0.10;
    player.gunLoadout[4].position = new BABYLON.Vector3(0.3, -0.5, 1.5);    
    player.gunLoadout[4].rotationQuaternion = null;
    //player.gunLoadout[4].rotation.y =  - 2 * Math.PI / 6;    
    // Stoping all animations from autoplaying on scene loading
    scene.animationGroups.forEach(group => {
        group.stop();
        group.reset();
    });
    // Setting up the weapon's object on the player            
    player.gunLoadout[0] = new Weapon("pistol", player.gunLoadout[0], 30, 1, 25, scene);
    player.gunLoadout[1] = new Weapon("shotgun",  player.gunLoadout[1], 20, 2.5, 10, scene);
    player.gunLoadout[2] = new Weapon("ak47",  player.gunLoadout[2], 100, 1, 50, scene); 
    player.gunLoadout[3] = new Weapon("rayGun",  player.gunLoadout[3], 100, 1, 50, scene); 
    player.gunLoadout[4] = new Weapon("lightingGun",  player.gunLoadout[4], 100, 1, 50, scene); 
}

function addEnemy(enemyList, scene, player){   

    // Skulls
    enemyList.push(scene.getTransformNodeByName("skull"));
    enemyList.push(scene.getTransformNodeByName("skull2"));
    enemyList.push(scene.getTransformNodeByName("skull3"));
    
    enemyList[0] = new Enemy(scene, "skull", enemyList[0]);
    enemyList[1] = new Enemy(scene, "skull2", enemyList[1]);
    enemyList[2] = new Enemy(scene, "skull3", enemyList[2]);
    
    enemyList[3] = new Skeleton(scene, "Skeleton1", scene.getTransformNodeByName("Skeleton1").parent, scene.getTransformNodeByName("SkeletonPosition1").position, player);
    enemyList[4] = new Skeleton(scene, "Skeleton2", scene.getTransformNodeByName("Skeleton2").parent, scene.getTransformNodeByName("SkeletonPosition2").position, player);
    enemyList[5] = new Dragon(scene, "DragonArmature", scene.getTransformNodeByName("DragonArmature").parent, scene.getTransformNodeByName("DragonPosition1").position, player);
    enemyList[6] = new Zombie(scene, "Zombie", scene.getTransformNodeByName("Zombie").parent, scene.getTransformNodeByName("ZombiePosition1").position, player);

    //Adding up the move() functions of each enemy to the render ovservable
    for(let i=0; i<enemyList.length; i++){
        scene.onBeforeRenderObservable.add(function(){enemyList[i].move();});
        //scene.onBeforeRenderObservable.add(function(){enemyList[i].shoot();});           
    }    
}

function addCollectible(collectibleList, scene, player){ 

    collectibleList.push(scene.getMeshByName("healthPack"));
    collectibleList.push(scene.getMeshByName("energyPack")); 
    //collectibleList.push(scene.getMeshByName("healthPack1"));

    var fireMaterial = new FireMaterial("fireMaterial", scene);
    fireMaterial.diffuseTexture = new BABYLON.Texture("../assets/textures/fire.png", scene);
    fireMaterial.distortionTexture = new BABYLON.Texture("../assets/textures/distortion.png", scene);
    fireMaterial.opacityTexture = new BABYLON.Texture("../assets/textures/candleOpacity.png", scene);
    fireMaterial.speed = 5.0;
    var plane = BABYLON.Mesh.CreatePlane("fireplane", 3.0, scene);
    
    plane.scaling.y = 3;
    plane.material = fireMaterial;
    plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
    plane.position.x = -scene.getTransformNodeByName("campFire").position.x;
    plane.position.z = scene.getTransformNodeByName("campFire").position.z;
    scene.getTransformNodeByName("campFire").isPickable = false;

    collectibleList[0] = new Collectible(scene, "healthPack", collectibleList[0], player);  
    collectibleList[1] = new Collectible(scene, "energyPack",  collectibleList[1], player);
    //collectibleList[2] = new Collectible(scene, "healthPack1",  collectibleList[2]);    
    // Adding up the move() functions of each enemy to the render observable
    for(let i=0; i<collectibleList.length; i++){
        scene.onBeforeRenderObservable.add(function(){collectibleList[i].rotate();}); 
        scene.onBeforeRenderObservable.add(function(){collectibleList[i].destroy();});                   
    }  
}

