import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { MultiPointerScaleBehavior, Mesh } from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/core/Meshes/meshBuilder";

export default class Skeleton{
    constructor(scene, name, mesh){
        // Game properties        
        this.scene = scene;
        // Enemy properties
        this.name = name;
        this.mesh = mesh;
        this.destroyed = false;
        //this.mesh.visibility = false;        
        this.health = 10;       
        // Enemy shooting setup        
        this.timeThen = Date.now();
        // When the type of mesh is of TransformNode 
        // get submeshes and enable collision on each
        this.subMeshes = this.mesh.getChildren();
        
        
        this.setup();
        
        
    } 
    
    setup(){

        // Enable collisions and invisibility on collision box
        this.subMeshes[1].checkCollisions = true;
        this.subMeshes[1].isVisible = false;

        
    }               
    
    move(){        
        /*let mesh = this.mesh;       
        let scene = this.scene;
        let camera = scene.activeCamera;     

        if(mesh){           
            // Calculating distances between the enemy and the player
            let initVec = mesh.position.clone();
            let distVec = BABYLON.Vector3.Distance(camera.position, mesh.position);                
            let targetVec = camera.position.subtract(initVec);
            let targetVecNorm = BABYLON.Vector3.Normalize(targetVec);

            // Move enemy towards the player and stops slightly ahead
            if(distVec < 15){
                distVec -= 0.05;
                mesh.translate(targetVecNorm, 0.05, BABYLON.Space.WORLD);                     
            }
            
            // Enemy always faces the player
            mesh.setParent(null);
            mesh.lookAt(camera.position, Math.PI, Math.PI / 2);       
            
        }*/
       
    }

    shoot(){             
        /*let scene = this.scene;       
        let name = this.name;        
        let mesh = this.mesh;
        let timeNow = Date.now();        
        
        if(scene.getTransformNodeByName(name) != null){
            // Checking if enemy's bullet is still in the scene
            if(scene.getMeshByName("Bullet"+name) == null)
            {  
                // Enemy shoots every nth second
                let timePassed = (timeNow - this.timeThen) / 1000;
                let firingRate = 2;                                
                if( timePassed >= firingRate){
                    fireBullet(scene, mesh, name );
                    this.timeThen = timeNow;
                }              
            }                
        }*/         
    }

    /*destroy(sprayer){
        let mesh = this.mesh;
        let destroyed = this.destroyed;
        
        // Get the position of the mesh to be used for explosion
        let explodeLocation = mesh.getAbsolutePosition();
        // Destroy the mesh
        destroyed = true;       
        mesh.dispose();        
        // Set explosion debris-levels
        let particleSystemManualEmitCount = 5000;               
        // Now lets call a  generateExplosion function...       
        //generateExplosion(sprayer, particleSystemManualEmitCount, explodeLocation);        
    }*/  
}