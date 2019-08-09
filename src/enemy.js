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
        //this.mesh.visibility = false;        
        this.health = 5;
        
        // Enemy shooting setup
        this.projectile = new BABYLON.Mesh.CreateSphere("bullet", 16, 0.5, this.scene);
        //this.projectile = new BABYLON.Mesh.CreateBox("box", {height: 50}, scene);
        this.projectile.position = this.mesh.position.clone();
        // Creating the animation for the bullet
        this.setAnimations();

        
       
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
            //let initVec = projectile.position.clone();// Enemy position
            //let distVec = BABYLON.Vector3.Distance(camera.position, projectile.position);// Distance between player and enemy                
            //let targetVec = camera.position.subtract(initVec);
            //let targetVecNorm = BABYLON.Vector3.Normalize(targetVec); // Target to shoot at  
            
            // Follow the player
            /*if(distVec > 10){
                distVec -= 0.1;
                //projectile.translate(new BABYLON.Vector3(0, 0, 5), 0.1, BABYLON.Space.WORLD);
                projectile.translate(targetVecNorm, 0.1, BABYLON.Space.WORLD);
                
            }*/         

            //this.scene.beginAnimation(this.projectile, 0, 100, false);
                              
            
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
        // Now lets call a  generateExplosion function...
        generateExplosion(sprayer, particleSystemManualEmitCount, explodeLocation);
    }

    setAnimations(){ 
        
        let scene = this.scene;
        var frameRate = 60;
        // Setting the end position of the animation
        //var start = this.projectile.position;
        //var end = start.clone();
        //end.x += 5;        
  
        // Setting up keys based on start-end values
        var keys = [{frame: 0,value: 2},{frame: 10, value: -2},{frame: 2 * frameRate,value: 2}];
        // Setting up the animation object
        var display = new BABYLON.Animation(
            "move",
            "position.x",
            frameRate,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,            
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);  
        
        display.setKeys(keys);        

        scene.beginDirectAnimation(this.projectile, [display], 0, 2 * frameRate, true);

        console.log("Animations Created for : Enemy Projectile ");


    }  
    
   
}

function generateExplosion(sprayer, puffsize, where) {
    // Set the spray nozzle to a vector3 where the enemy got destroyed
    sprayer.emitter = where;
    // We set this value to 5000, earlier, activating idle particle system     
    sprayer.manualEmitCount = puffsize;  
}
