import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { MultiPointerScaleBehavior, Mesh } from "@babylonjs/core/Legacy/legacy";
import Bullet from "./bullet";
import "@babylonjs/core/Meshes/meshBuilder";

export default class Enemy{
    constructor(scene, name, mesh){
        // Game properties
        //this.game = game;
        this.scene = scene;
        // Enemy properties
        this.name = name;
        this.mesh = mesh;
        //this.mesh.visibility = false;        
        this.health = 5;       
        // Enemy shooting setup        
        this.timeThen = Date.now();
        
        console.log(this.timeThen);
       
    }

    move(){        
        let mesh = this.mesh;       
        let scene = this.scene;
        let camera = scene.activeCamera;

        //let ray = mesh.getForwardRay(10000);

        if(mesh){           
            // Calculating distances between the enemy and the player
            let initVec = mesh.position.clone();
            let distVec = BABYLON.Vector3.Distance(camera.position, mesh.position);                
            let targetVec = camera.position.subtract(initVec);
            let targetVecNorm = BABYLON.Vector3.Normalize(targetVec);

            // Move enemy towards the player and stops slightly ahead
            if(distVec > 10){
                distVec -= 0.1;
                //mesh.translate(targetVecNorm, 0.1, BABYLON.Space.WORLD);                     
            }
            // Enemy always faces the player
            mesh.lookAt(camera.position, Math.PI);           
        }
    }

    shoot(){             
        let scene = this.scene;       
        let name = this.name;
        let timeNow = Date.now();
        let mesh = this.mesh;
       
        this.timeThen = 0;
        console.log(this.timeThen);
        if(scene.getMeshByName(name) != null){
            if (scene.getMeshByName("Bullet"+name) == null)
            {
                //console.log("Enemy shoots");
                fireBullet(scene, mesh, name );
                
               
            }                
        }         
    }

    destroy(sprayer){
        let mesh = this.mesh;
        // Get the position of the mesh to be used for explosion
        let explodeLocation = mesh.getAbsolutePosition();
        // Destroy the mesh      
        mesh.dispose();  
        // Set explosion debris-levels
        let particleSystemManualEmitCount = 5000;               
        // Now lets call a  generateExplosion function...       
        generateExplosion(sprayer, particleSystemManualEmitCount, explodeLocation);        
    }  
}

function generateExplosion(sprayer, puffsize, where) {
    // Set the spray nozzle to a vector3 where the enemy got destroyed
    sprayer.emitter = where;
    // We set this value to 5000, earlier, activating idle particle system     
    sprayer.manualEmitCount = puffsize;  
}

function fireBullet(scene, mesh, name){

    var bulletName = "Bullet" + name;
    //console.log(bulletName);
    var bullet = BABYLON.MeshBuilder.CreateSphere(bulletName, { segments: 3, diameter: 0.3 }, scene);

    // Name bullet , Bullet + rand number then get name via bullet.name;
        
    bullet.position = mesh.getAbsolutePosition();
    bullet.physicsImpostor = new BABYLON.PhysicsImpostor(bullet, 
        BABYLON.PhysicsImpostor.SphereImpostor, 
        { mass: 0.1, friction: 0.5, restition: 0.3 },
        scene);

    var dir = scene.activeCamera.position.subtract(mesh.getAbsolutePosition());
    bullet.physicsImpostor.applyImpulse(dir.scale(0.5), mesh.getAbsolutePosition());
    bullet.life = 0;

    bullet.step = ()=>{
        bullet.life++;
        if(bullet.life> 100 && bullet.physicsImpostor){
            bullet.physicsImpostor.dispose();
            bullet.dispose();                
        }
    };

    scene.onBeforeRenderObservable.add(bullet.step);   
}