import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { MultiPointerScaleBehavior, Mesh } from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/core/Meshes/meshBuilder";

export default class Enemy{
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
        //this.setup();       
    } 
    
    setup(){
        for(let i = 0; i<this.subMeshes.length ; i++){
            this.subMeshes[i].checkCollisions = true;
        }
    }               
    
    move(){        
        let mesh = this.mesh;       
        let scene = this.scene;
        let camera = scene.activeCamera;     

        if(mesh.isEnabled()){           
            // Calculating distances between the enemy and the player
            let initVec = mesh.position.clone();
            let distVec = BABYLON.Vector3.Distance(camera.position, mesh.position);                
            let targetVec = camera.position.subtract(initVec);
            let targetVecNorm = BABYLON.Vector3.Normalize(targetVec);

            // Move enemy towards the player and stops slightly ahead
            /*if(distVec < 15){
                distVec -= 0.05;
                mesh.translate(targetVecNorm, 0.05, BABYLON.Space.WORLD);                     
            }*/
            
            // Enemy always faces the player
            mesh.setParent(null);
            mesh.lookAt(camera.position, Math.PI, Math.PI / 2);       
            
        }
       
    }

    shoot(){             
        let scene = this.scene;       
        let name = this.name;        
        let mesh = this.mesh;
        let timeNow = Date.now();        
        
        if(mesh.isEnabled()){
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
        }         
    }

    destroy(){
        let mesh = this.mesh;
        let destroyed = this.destroyed;    

        mesh.setEnabled(false); // mesh.dispose() breaks collisions                
        destroyed = true;            
    }  
}



function fireBullet(scene, mesh, name){

    var bulletName = "Bullet" + name;
    //console.log(bulletName);
    var bullet = BABYLON.MeshBuilder.CreateSphere(bulletName, { segments: 3, diameter: 0.3 }, scene);
    bullet.isPickable = false;

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
        if(bullet.life> 20 && bullet.physicsImpostor){
            bullet.physicsImpostor.dispose();
            bullet.dispose();                
        }
    };

    scene.onBeforeRenderObservable.add(bullet.step);   
}