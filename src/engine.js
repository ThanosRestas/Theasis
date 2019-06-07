import { GridMaterial } from "@babylonjs/materials";
import Weapon from "./weapon";
import * as GUI from "@babylonjs/gui";

export default class Engine{
    constructor(){
        // Scene setup
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas);       
        this.scene = new BABYLON.Scene(this.engine);

        // Entities
        this.player;        
        
        // Camera setup
        this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2.01, -8), this.scene);        
        this.camera.attachControl(this.canvas, true);
        this.camera.speed = 0.2;       
        this.camera.ellipsoid = new BABYLON.Vector3(1, 1, 1); // Collision box for the camera
        this.camera.checkCollisions = true;
        this.camera.applyGravity = true; 

        // Enable collisions and gravity in scene
        this.scene.collisionsEnabled = true;
        this.scene.gravity = new BABYLON.Vector3(0, -0.05, 0);       

        this.hud = this.hudManager();
    }

    assetManager(){
        var camera = this.camera;
        var scene = this.scene;
        var player = this.player;

        // Add lights to the scene
        var light0 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-2, -5, 2), scene);
        var light2 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(2, -5, 2), scene);
        var light3 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, -5, -2), scene); 

        // Asset loading
        var assetsManager = new BABYLON.AssetsManager(scene);     
        // Called when a single task has been sucessfull
        assetsManager.onTaskSuccessObservable.add(function(task) {        
            //console.log("task successful", task);            

            // Setting ground material
            var ground = scene.getMeshByName("ground");           
            ground.material = new GridMaterial("groundMaterial", scene);    
            ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
            ground.material.backFaceCulling = false; 

            // Add the pistol mesh in the scene
            addPistol(player, scene, camera);           
        });         
        // Called when all tasks in the assetsManger are done
        assetsManager.onTasksDoneObservable.add(function(tasks) {

            var errors = tasks.filter(function(task) {return task.taskState === BABYLON.AssetTaskState.ERROR;});
            var successes = tasks.filter(function(task) {return task.taskState !== BABYLON.AssetTaskState.ERROR;}); 
            //console.log(tasks);
        });

        // We add single tasks to the assetsManager
        // Level design load
        assetsManager.addMeshTask("task", "", "../assets/models/", "test8.babylon");
        // Props load        
        assetsManager.addMeshTask("task", "", "../assets/models/", "Pistol.obj");

        // Now let the assetsManger load/excecute every task
        assetsManager.load();
    }

    pointerLock(){
        var canvas = this.canvas;
        var scene = this.scene;
        var camera = this.camera;
        var player = this.player;
        var hud = this.hud;
        var isLocked = false;   
 
        scene.onPointerDown = function (evt) {
            
            // Getting the current weapon and settings the ammo info
            var currentWeapon = player.weapon;
            hud[2].text = String(currentWeapon.ammo);

            if (document.pointerLockElement !== canvas) {
                console.log("Was Already locked: ", document.pointerLockElement === canvas);
    
                if (!isLocked) {
                    canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock || false;
                    
                    if (canvas.requestPointerLock) {
                        canvas.requestPointerLock();
                    }
                }
            }
            //continue with shooting requests or whatever :P
            //evt === 0 (left mouse click)
            //evt === 1 (mouse wheel click (not scrolling))
            //evt === 2 (right mouse click)

            if(evt.button == 0){             

                //Play current Weapon's animation
                scene.beginAnimation(player.weapon.mesh, 0, 100, false);
                // Remove ammunition
                player.weapon.ammo -= 1;
                
                
                // Destroy camera's ray target
                let ray = camera.getForwardRay(10000);
                let hit = scene.pickWithRay(ray);
                let model = hit.pickedMesh;             
        
                if(hit !== null && model !== null){
                    console.log("Target Destroyed :" + model.name);
                    scene.getMeshByName(model.name).dispose();       
                }                               
            }            
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
        ammoBar.text = "AMMO";
        ammoBar.color = "white";
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

function addPistol(player, scene, camera){

    // Picking each part of the pistol in the scene
    var part1 = scene.getMeshByName("Pistol_Cube.002");
    var part2 = scene.getMeshByName("_mm1");
    var part3 = scene.getMeshByName("_mm2");
    var part4 = scene.getMeshByName("_mm3");
    var part5 = scene.getMeshByName("_mm4");

    // Combinging them in a single node
    var gun2 = new BABYLON.TransformNode("root");
    part1.parent = gun2;
    part2.parent = gun2;
    part3.parent = gun2;
    part4.parent = gun2;
    part5.parent = gun2; 

    // Set its position on the player
    gun2.parent = camera; 
    gun2.scaling = new BABYLON.Vector3( 0.5, 0.5, 0.5);
    gun2.rotation.y = -Math.PI;
    gun2.position = new BABYLON.Vector3(1, -1, 3);
    
    // Setting up the weapon's object in the player            
    player.weapon = new Weapon("deagle", gun2, gun2.rotation); 
}