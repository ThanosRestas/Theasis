import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { MultiPointerScaleBehavior, Mesh } from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/core/Meshes/meshBuilder";



export default class Skeleton{
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
        this.animationRunning;
        this.animationAttack;
        // Setting up the animation properties        
        this.setup();
        // Setting up the collision mesh and making it invisible
        this.subMeshes = this.mesh.getChildren();
        this.subMeshes = this.subMeshes[0].getChildren();
        this.collisionMesh = this.subMeshes[1];        
        this.collisionMesh.isVisible = false; 
        this.collisionMesh.checkCollisions = true;
        // The player of the game
        this.player = player;

       
        
        
    } 
    
    setup(){

        let scene = this.scene;
        let mesh = this.mesh;
        let animations = this.animations;       
        let name = this.name;
        let player = this.player;

        for(let i = 0; i < scene.animationGroups.length; i++){             
            var targetMesh = scene.animationGroups[i]._targetedAnimations[0].target.parent.name;
            if(targetMesh == name){
                animations.push(scene.animationGroups[i]);
            }
        }

        for(let i = 0; i < animations.length ; i++){
            //console.log(animations[i].name);
            if(animations[i].name == "Skeleton_Idle"){                
                this.animationIdle = animations[i];
            }
            else if( animations[i].name == "Skeleton_Running"){
                this.animationRunning = animations[i];
            }
            else if ( animations[i].name == "Skeleton_Attack"){
                this.animationAttack = animations[i];         
            }
        }       
       
    }
    
    move(){        
        let mesh = this.mesh; 
        let name = this.name;      
        let scene = this.scene;
        let camera = scene.activeCamera; 
        let player = this.player;       
        let animationIdle = this.animationIdle;
        let animationRunning = this.animationRunning; 
        let animationAttack = this.animationAttack;   

        if(scene.getTransformNodeByName(name)){           
            // Calculating distances between the enemy and the player
            let initVec = mesh.position.clone();
            let distVec = BABYLON.Vector3.Distance(camera.position, mesh.position);                
            let targetVec = camera.position.subtract(initVec);
            let targetVecNorm = BABYLON.Vector3.Normalize(targetVec);
            // Move enemy towards the player and stops slightly ahead
            if(distVec < 15 && distVec >=5){
                distVec -= 0.05;
                mesh.translate(targetVecNorm, 0.05, BABYLON.Space.WORLD);
                mesh.position.y = 0;
                // Running animation play
                animationRunning.start();                                      
            }

            if(distVec >= 15){
                // Idle animation play
                animationIdle.start();
            }           
            // Enemy always faces the player                   
            mesh.lookAt(camera.position, Math.PI);

            if(distVec < 5){
                animationAttack.start();
                player.damage(0.05);              
            }           
        }
       
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

    destroy(sprayer){
        let mesh = this.mesh; 
        let scene = this.scene;  
        
        mesh.dispose();       
    } 
}