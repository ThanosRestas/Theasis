import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/core/Meshes/meshBuilder";

export default class Dragon{
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
        // Setting up the animation properties        
        this.setup();        
        // The player of the game
        this.player = player; 
    } 
    
    setup(){
        let scene = this.scene;        
        let animations = this.animations;       
        let name = this.name;         

        for(let i = 0; i < scene.animationGroups.length; i++){             
            var targetMesh = scene.animationGroups[i]._targetedAnimations[0].target.parent.parent.name;
            if(targetMesh == name){                
                animations.push(scene.animationGroups[i]);
            }
        }

        for(let i = 0; i < animations.length ; i++){

            if(animations[i].name == "Dragon_Flying"){                
                this.animationIdle = animations[i];
            }
            else if( animations[i].name == "Dragon_Hit"){
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
                animationIdle.start();
            }
            // Idle animation play distance
            if(distVec >= 15){                
                animationIdle.start();
            }     
            // Attack animation play distance
            if(distVec < 5){
                animationAttack.start();
                player.damage(0.05);              
            }           
        }
       
    } 
    
    destroy(){       
        let mesh = this.mesh;                              
        mesh.setEnabled(false); // Works cause mesh.dispose() breaks collisions          
    }    
}