import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { MultiPointerScaleBehavior, Mesh } from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/core/Meshes/meshBuilder";
import * as GUI from "@babylonjs/gui";

export default class Dragon{
    constructor(scene, name, mesh, position, player){
        // Game properties        
        this.scene = scene;
        // Enemy properties
        this.name = name;
        this.mesh = mesh;
        this.mesh.setPositionWithLocalVector(position);
        this.mesh.position.y = 0;        
        this.destroyed = false;                  
        this.health = 50;       
        // Animation properties
        this.animations = [];
        this.animationIdle;        
        this.animationAttack;        
        // Setting up the animation properties        
        this.setup();        
        // The player of the game
        this.player = player; 

        //this.mesh.checkCollisions = true;
        this.subMeshes = this.mesh.getChildMeshes();

        
        this.healthBar = enemyHUD(this.scene,  this.subMeshes[0]);
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
                
                //console.log(this.animationAttack.targetedAnimations)
            }
           
        }     

        //this.animationIdle = scene.getAnimationGroupByname("Dragon_Flying");
        //this.animationAttack = scene.getAnimationGroupByname("Dragon_Hit");
              
    }
    
    move(){        
        let mesh = this.mesh;          
        let scene = this.scene;
        let camera = scene.activeCamera; 
        let player = this.player;       
        let animationIdle = this.animationIdle;        
        let animationAttack = this.animationAttack;

        let healthBar = this.healthBar;
        healthBar.width = this.health/100;

        
        if(mesh.isEnabled()){           
            // Calculating distances between the enemy and the player
            let initVec = mesh.position.clone();
            let distVec = BABYLON.Vector3.Distance(camera.position, mesh.position);  
                         
            let targetVec = camera.position.subtract(initVec);
            let targetVecNorm = BABYLON.Vector3.Normalize(targetVec);

            //console.log(distVec); 
            // Enemy always faces the player                   
            mesh.lookAt(camera.position, Math.PI);
            // Move enemy towards the player and stops slightly ahead
            if(distVec < 40 && distVec >=5){
                //this.healthBar.isVisible = true; 
                distVec -= 0.1;
                mesh.translate(targetVecNorm, 0.1, BABYLON.Space.WORLD);
                mesh.position.y = 0;
                animationIdle.start();
                // Keeping enemy at the same height as the player
                // For use at the dessert level
                mesh.position.y = camera.position.y;
            }
            // Idle animation play distance
            if(distVec >= 40){
                // Lower to the ground       
                mesh.position.y = 0;     
                animationIdle.start();
                //this.healthBar.isVisible = false;
            }     
            // Attack animation play distance
            if(distVec < 5){
                animationAttack.start();
                player.healthDown(0.09);              
            }           
        }
       
    } 

    shoot(){
        
    }
    
    destroy(){       
        let mesh = this.mesh;  
        this.destroyed = true;                            
        mesh.setEnabled(false); // Works cause mesh.dispose() breaks collisions          
    }    
}


function enemyHUD(scene, mesh){   

    //console.log("yoyoy");

    // GUI
    var plane = BABYLON.Mesh.CreatePlane("sdsdsdsd", 2);
    plane.parent = mesh;
    plane.position.y = mesh.position.y + 4.5;
    plane.position.z = -1;
    

    var advancedTexture = new GUI.AdvancedDynamicTexture.CreateForMesh(plane, 600, 600);

    var healthBar = new GUI.Rectangle("enemyHealthBar2");
    advancedTexture.addControl(healthBar);
    healthBar.width = 2;
    healthBar.height = "20px";
    healthBar.cornerRadius = 20;
    healthBar.color = "white";
    healthBar.thickness = 2;
    healthBar.background = "red";

    return healthBar;
} 


