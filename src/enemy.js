import * as BABYLON from "@babylonjs/core/Legacy/legacy"
import { MultiPointerScaleBehavior, Mesh } from "@babylonjs/core/Legacy/legacy";


export default class Enemy{
    constructor(scene, name, mesh){
        // Game properties
        //this.game = game;
        this.scene = scene;
        // Enemy properties
        this.name = name;
        this.mesh = mesh;        
        this.health = 5;
        
        this.move();
        //this.destroy();
    }

    move(){        
        let mesh = this.mesh;       
        let scene = this.scene;
        let camera = scene.activeCamera;

        if(mesh){
            scene.registerBeforeRender(function(){
                // Calculating distances between the enemy and the player
                let initVec = mesh.position.clone();
                let distVec = BABYLON.Vector3.Distance(camera.position, mesh.position);                
                let targetVec = camera.position.subtract(initVec);
                let targetVecNorm = BABYLON.Vector3.Normalize(targetVec);

                // Move enemy towards the player and stops slightly ahead
                if(distVec > 10){
                    distVec -= 0.1;
                    mesh.translate(targetVecNorm, 0.1, BABYLON.Space.WORLD);                     
                }
                // Enemy always faces the player
                mesh.lookAt(camera.position, Math.PI);          
            });
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
        // Now lets call a soon-to-be-coded generateExplosion function...
        generateExplosion(sprayer, particleSystemManualEmitCount, explodeLocation);
    }   
}

function generateExplosion(sprayer, puffsize, where) {
    // Set the spray nozzle to a vector3 where the ship got destroyed
    sprayer.emitter = where;
    // We set this value to 5000, earlier, activating idle particle system     
    sprayer.manualEmitCount = puffsize;  
}