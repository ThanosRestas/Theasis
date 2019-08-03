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
        if(mesh){
            
            console.log("yoyooyo")
            this.scene.registerBeforeRender(function(){
            
                mesh.rotate(BABYLON.Axis.Y, Math.PI / 64,BABYLON.Space.LOCAL);
                mesh.translate(BABYLON.Axis.Y, 0.02, BABYLON.Space.WORLD);

                
          
            });   


        }
    }

}