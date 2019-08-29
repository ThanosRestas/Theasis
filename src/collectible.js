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
        // When the type of mesh is of TransformNode 
        // get submeshes and enable collision on each
        this.subMeshes = this.mesh.getChildren();
        this.setup();      
    } 
    
    setup(){
        for(let i = 0; i<this.subMeshes.length ; i++){
            this.subMeshes[i].checkCollisions = true;
        }
    }
    
    rotate(){
        if(this.mesh != null){
            this.mesh.rotate(BABYLON.Axis.Y, 0.02, BABYLON.Space.LOCAL);           
        } 
    } 
      
}

