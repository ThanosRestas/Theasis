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
    }  
    
    rotate(){
        if(this.mesh != null){
            this.mesh.rotate(BABYLON.Axis.Y, 0.02, BABYLON.Space.LOCAL);  
        }           
    }
}

