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
        this.destroy();
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

    destroy(){
        let mesh = this.mesh;
        let health = this.health;
        let scene = this.scene;       

        if(mesh){            
            scene.registerBeforeRender(function(){
                               
                console.log("Health:" + health);
                if(health == 0){
                    scene.getMeshByName(mesh.name).dispose();
                }    
            });
        }
    }
}