import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { MultiPointerScaleBehavior, Mesh } from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/core/Meshes/meshBuilder";


export default class Collectible{
    constructor(scene, name, mesh, player){
        // World properties
        this.scene = scene;
        // Weapon properties
        this.name = name;
        
        this.mesh = mesh;
        //console.log(this.mesh.name);
        
        this.player = player;        

        this.setup();
         
    }

    setup(){

        let player = this.player;
       

        if(this.name == "healthPack"){
            this.mesh.onDisposeObservable.add(function(){
                player.healthUp();                      
            }); 
        }
        
        if(this.name == "energyPack"){
            this.mesh.onDisposeObservable.add(function(){
                player.energyUp();                
            });
        }        
        
        if(this.name.search("Ammo") ){
            let name = this.name
            this.mesh.onDisposeObservable.add(function(){
                player.ammoUp(name);                              
            });
        }
    }

    rotate(){    
        if(this.name == "healthPack"){
            this.mesh.rotate(BABYLON.Axis.Y, 0.02, BABYLON.Space.LOCAL);
            //this.mesh.rotate(BABYLON.Axis.Z, 0.02, BABYLON.Space.LOCAL);
            
        }        
        else if(this.name == "pistolAmmo" ){
            this.mesh.rotate(BABYLON.Axis.X, 0.02, BABYLON.Space.LOCAL);
        }
        else{
            this.mesh.rotate(BABYLON.Axis.Z, 0.02, BABYLON.Space.LOCAL);
            
        }        
        
    } 

    destroy(){

        let mesh = this.mesh;
        let scene = this.scene;
        let camera = scene.activeCamera;                  
        
        let distVec = BABYLON.Vector3.Distance( camera.position, mesh.absolutePosition);  
        
        if(mesh != null){
            // Remove collectible from the scene
            if(distVec <= 4){                
                //mesh.setEnabled(false);   
                mesh.dispose();           
            } 
        } 
    }
    
}

