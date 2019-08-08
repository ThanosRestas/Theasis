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
        
        this.projectile = new BABYLON.Mesh.CreateSphere("bullet", 16, 0.5, this.scene);
       
    }

    move(){        
        let mesh = this.mesh;       
        let scene = this.scene;
        let camera = scene.activeCamera;

        if(mesh){           
            // Calculating distances between the enemy and the player
            let initVec = mesh.position.clone();
            let distVec = BABYLON.Vector3.Distance(camera.position, mesh.position);                
            let targetVec = camera.position.subtract(initVec);
            let targetVecNorm = BABYLON.Vector3.Normalize(targetVec);

            // Move enemy towards the player and stops slightly ahead
            if(distVec > 10){
                distVec -= 0.1;
                //mesh.translate(targetVecNorm, 0.1, BABYLON.Space.WORLD);                     
            }
            // Enemy always faces the player
            mesh.lookAt(camera.position, Math.PI);           
        }
    }

    shoot(){
        let mesh = this.mesh;       
        let scene = this.scene;
        let camera = scene.activeCamera;
        let projectile = this.projectile;     

        if(mesh){       
           
            // Calculating distances between the enemy and the player
            let initVec = projectile.position.clone();// Enemy position
            let distVec = BABYLON.Vector3.Distance(camera.position, projectile.position);// Distance between player and enemy                
            let targetVec = camera.position.subtract(initVec);
            let targetVecNorm = BABYLON.Vector3.Normalize(targetVec); // Target to shoot at  
            
            projectile.translate(new BABYLON.Vector3(0, 0, 5), 0.1, BABYLON.Space.WORLD);  
                              
            
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
    // Set the spray nozzle to a vector3 where the enemy got destroyed
    sprayer.emitter = where;
    // We set this value to 5000, earlier, activating idle particle system     
    sprayer.manualEmitCount = puffsize;  
}

/*function transformForce(mesh, vec) {
    var mymatrix = new BABYLON.Matrix();
    mesh.rotationQuaternion.toRotationMatrix(mymatrix);
    return BABYLON.Vector3.TransformNormal(vec, mymatrix);
};

function translate(mesh, direction, power) {
    mesh.physicsImpostor.setLinearVelocity(
        mesh.physicsImpostor.getLinearVelocity().add(direction.scale(power)
        )
    );
}*/

function vecToLocal(vector, mesh){
    var m = mesh.getWorldMatrix();
    var v = BABYLON.Vector3.TransformCoordinates(vector, m);
    return v;		 
}