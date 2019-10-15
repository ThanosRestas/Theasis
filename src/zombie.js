import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/core/Meshes/meshBuilder";

export default class Zombie{
    constructor(scene, name, mesh, position, player){
        // Game properties        
        this.scene = scene;
        // Enemy properties
        this.name = name;
        this.mesh = mesh;
        this.mesh.position = position;
        this.mesh.position.y = 0;        
        this.destroyed = false;                  
        this.health = 10;       
        // Animation properties
        this.animations = [];
        this.animationIdle;        
        this.animationAttack;
        this.animationRunning;      
        // Setting up the animation properties        
        this.setup();        
        // The player of the game
        this.player = player; 
        // Setting up the collision mesh and making it invisible
        this.subMeshes = this.mesh.getChildren();
        this.subMeshes = this.subMeshes[0].getChildren();
        this.collisionMesh = this.subMeshes[1];        
        this.collisionMesh.isVisible = false;
        this.collisionMesh.setEnabled(true); 
        this.collisionMesh.isPickable = true;   
    } 
    
    setup(){
        let scene = this.scene;        
        let animations = this.animations;       
        let name = this.name;         

        for(let i = 0; i < scene.animationGroups.length; i++){             
            var targetMesh = scene.animationGroups[i]._targetedAnimations[0].target.parent.parent.name;
            //console.log(targetMesh);
            if(targetMesh == name){                
                animations.push(scene.animationGroups[i]);
            }
        }

        for(let i = 0; i < animations.length ; i++){

            if(animations[i].name == "ZombieIdle_Zombie.001"){                
                this.animationIdle = animations[i];
            }
            else if(animations[i].name == "ZombieWalk_Zombie.001"){
                this.animationAttack = animations[i];                
            }
            
        }       
              
    }
    
    move(){        
        let mesh = this.mesh;          
        let scene = this.scene;
        let camera = scene.activeCamera; 
        let player = this.player;       
        let animationIdle = this.animationIdle;        
        let animationAttack = this.animationAttack;
        let animationRunning = this.animationRunning;
        

        if(mesh.isEnabled()){           
            // Calculating distances between the enemy and the player
            let initVec = mesh.position.clone();
            let distVec = BABYLON.Vector3.Distance(camera.position, mesh.position);  
                         
            let targetVec = camera.position.subtract(initVec);
            let targetVecNorm = BABYLON.Vector3.Normalize(targetVec);           
            
            // Enemy always faces the player                   
            mesh.lookAt(camera.position, Math.PI);
            // Move enemy towards the player and stops slightly ahead
            if(distVec < 15 && distVec >=5){
                distVec -= 0.05;
                mesh.translate(targetVecNorm, 0.05, BABYLON.Space.WORLD);
                mesh.position.y = 0; 
                animationAttack.start();               
            }
            // Idle animation play distance
            if(distVec >= 15){                
                animationIdle.start();
            }     
            // Attack animation play distance
            if(distVec < 5){
                animationAttack.start();
                player.healthDown(0.05);              
            }           
        }
       
    } 

    shoot(){
        
    }
    
    destroy(){       
        let mesh = this.mesh;                              
        mesh.setEnabled(false); // Works cause mesh.dispose() breaks collisions          
    }    
}