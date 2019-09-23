import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { MultiPointerScaleBehavior, Mesh } from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/core/Meshes/meshBuilder";


export default class Collectible{
    constructor(scene, name, mesh){
        // World properties
        this.scene = scene;
        // Weapon properties
        this.name = name;
        this.mesh = mesh;
        
        this.mesh.checkCollisions = true;
        //this.mesh.isVisible = false;        
           
    }     

    
    rotate(){
        if(this.scene.getMeshByName(this.name)){
            if(this.name == "energyPack"){
                this.mesh.rotate(BABYLON.Axis.Z, 0.02, BABYLON.Space.LOCAL);
            }
            else{
                this.mesh.rotate(BABYLON.Axis.Y, 0.02, BABYLON.Space.LOCAL);   
            }
            
        } 
    } 
      
}

