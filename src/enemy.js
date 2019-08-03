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
        this.health = 20;
        
        this.move();
    }

    move(){        
        let mesh = this.mesh;
        let scene = this.scene;
        let camera = scene.activeCamera;

        if(mesh){ 

            this.scene.registerBeforeRender(function(){ 
                let initVec = mesh.position.clone();
                let distVec = BABYLON.Vector3.Distance(camera.position, mesh.position);                
                let targetVec = camera.position.subtract(initVec);
                let targetVecNorm = BABYLON.Vector3.Normalize(targetVec);

                // Move enemy towards the player
                if(distVec > 0){
                    distVec -= 0.1;
                    //mesh.translate(targetVecNorm, 0.1, BABYLON.Space.WORLD);
                     
                }
                mesh.lookAt(camera.position)   
             
                                      
          
            });   


        }
    }

}