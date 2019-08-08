import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { GridMaterial } from "@babylonjs/materials";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

//mport CannonJSPlugin from "@babylonjs/core/Physics/Plugins";
//import * as cannon from "CANNON";


import Weapon from "./weapon";
import * as GUI from "@babylonjs/gui";
import Enemy from "./enemy";



export default class Engine{
    constructor(){
        // Scene setup
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas);       
        this.scene = new BABYLON.Scene(this.engine);

        // Entities
        this.player;
        this.enemyList = [];        
        
        // Camera setup
        this.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(-5, 2.01, -8), this.scene);        
        this.camera.attachControl(this.canvas, true);
        this.camera.speed = 0.2;       
        this.camera.ellipsoid = new BABYLON.Vector3(1, 1, 1); // Collision box for the camera
        this.camera.checkCollisions = true;
        this.camera.applyGravity = true; 

        // Enable collisions and gravity in scene
        this.scene.collisionsEnabled = true;
        this.scene.gravity = new BABYLON.Vector3(0, -0.1, 0);
        
        // Enable physics
        //this.physicsPlugin = new BABYLON.CannonJSPlugin(true, 10, cannon);
        //this.scene.enablePhysics();

        // HUD setup
        this.hud = this.hudManager();

        // Particle system setup
        this.particleSystem = new BABYLON.ParticleSystem("particles", 2000, this.scene);
        this.particleSystem.particleTexture = new BABYLON.Texture("../assets/textures/flare.png", this.scene);
        this.particleSystem.emitRate = 0;        
        this.particleSystem.start();       
    }

    assetManager(){
        var camera = this.camera;
        var scene = this.scene;
        var player = this.player;
        var enemyList = this.enemyList;

        // Add lights to the scene
        var light4 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 50, 0), scene);
        light4.intensity = 2;

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


            // Add enemy meshes to the scene
            addEnemy(enemyList, scene);
            // Add the weapon meshes to the scene
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
        assetsManager.addMeshTask("task", "", "../assets/models/", "test106.babylon");
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
        let particleSystem = this.particleSystem;        
 
        scene.onPointerDown = function (evt) {            
            // Getting the current weapon and setting the ammo info
            let currentWeapon = player.currentWeapon;
            //let enemyList = this.enemyList;                

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
                scene.beginAnimation(player.gunLoadout[currentWeapon].mesh, 0, 100, false);                
                // Remove ammunition
                if(player.gunLoadout[currentWeapon].ammo > 0){
                    player.gunLoadout[currentWeapon].ammo -= 1;     
                }                           
                // Update HUD
                hud[2].text = String(player.gunLoadout[player.currentWeapon].ammo);               
                // Destroy camera's ray target in 1000 distance
                let ray = camera.getForwardRay(10000);
                let hit = scene.pickWithRay(ray);
                let model = hit.pickedMesh;             
                // Exempt ground from the be shot at
                if(hit !== null && model !== null && model.name != "ground"){

                    for(let i= 0; i < enemyList.length ; i++){
                        if(enemyList[i].name == model.name){
                            console.log("Target Hit :" + model.name + " Health :" + enemyList[i].health );
                            enemyList[i].health -= 1;
                            if(enemyList[i].health == 0){                               
                                enemyList[i].destroy(particleSystem);
                            }
                        }
                    }                      
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

        this.player = player;
        //hud[2].text = String(player.gunLoadout[player.currentWeapon].ammo);
    }

    hudManager(){

        let player = this.player;

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
        //ammoBar.text = String(player.gunLoadout[player.currentWeapon].ammo);
        //ammoBar.text 
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

    // Getting the gun models from the scene and load them into the loadout    
    player.gunLoadout.push(scene.getMeshByName("pistol"));
    player.gunLoadout.push(scene.getMeshByName("shotgun"));
    player.gunLoadout.push(scene.getMeshByName("ak47"));
    
    // Set pistol's attributes for proper positioning
    player.gunLoadout[0].parent = camera;    
    player.gunLoadout[0].rotation.y = Math.PI/2;    
    player.gunLoadout[0].position = new BABYLON.Vector3(1, -1, 3);

    // Set shotgun's attributes for proper positioning  
    player.gunLoadout[1].parent = camera;
    player.gunLoadout[1].rotation.y = -Math.PI/2;    
    player.gunLoadout[1].position = new BABYLON.Vector3(1, -1, 3);    

    // Set ak47's attributes for proper positioning
    player.gunLoadout[2].parent = camera;
    player.gunLoadout[2].rotation.y = -Math.PI/2;    
    player.gunLoadout[2].position = new BABYLON.Vector3(0.7, -1, 1.5);   
    
    for(var i=0; i<player.gunLoadout.length;i++){
        // Make invisible the gun dummy model and its children
        player.gunLoadout[i].visibility = false; 
        player.gunLoadout[i].getChildren().forEach(function(_child) {
            _child.visibility = false;
        }, this);
    }  
        
    // Setting up the weapon's object on the player            
    player.gunLoadout[0] = new Weapon("pistol", player.gunLoadout[0], player.gunLoadout[0].rotation);
    player.gunLoadout[1] = new Weapon("shotgun",  player.gunLoadout[1],  player.gunLoadout[1].rotation);
    player.gunLoadout[2] = new Weapon("ak47",  player.gunLoadout[2],  player.gunLoadout[2].rotation);      
}

function addEnemy(enemyList, scene){

    enemyList.push(scene.getMeshByName("skull"));

    enemyList[0] = new Enemy(scene, "skull", enemyList[0]);

    //Adding up the move() functions of each enemy to the render ovservable
    for(let i=0; i<enemyList.length; i++){
        scene.onBeforeRenderObservable.add(function(){enemyList[i].move();});
        scene.onBeforeRenderObservable.add(function(){enemyList[i].shoot();});           
    }    
}

