import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/core/Meshes/meshBuilder";
import * as GUI from "@babylonjs/gui";

export default class Zombie{
    constructor(scene, name, mesh, position, player){
        // Game properties        
        this.scene = scene;
        // Enemy properties
        this.name = name;
        this.mesh = mesh;
        // Blender to Babylon scene positioning
        this.mesh.setPositionWithLocalVector(position);
        this.destroyed = false;                  
        this.health = 150;       
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

        
        //this.testSubMesh = this.subMeshes[0];
        //console.log(this.testSubMesh[0].name)
        this.healthBar = enemyHUD(this.scene, this.subMeshes[1]);
        //this.healthBar.isVisible = false;

        
        
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
        
        let healthBar = this.healthBar;
        healthBar.width = this.health/100;

        if(mesh.isEnabled()){           
            // Calculating distances between the enemy and the player
            let initVec = mesh.position.clone();
            let distVec = BABYLON.Vector3.Distance(camera.position, mesh.position);  
                         
            let targetVec = camera.position.subtract(initVec);
            let targetVecNorm = BABYLON.Vector3.Normalize(targetVec);           
            
            // Enemy always faces the player                   
            mesh.lookAt(camera.position, Math.PI);
            // Move enemy towards the player and stops slightly ahead
            if(distVec < 40 && distVec >=5){
                //this.healthBar.isVisible = true;
                distVec -= 0.03;
                mesh.translate(targetVecNorm, 0.03, BABYLON.Space.WORLD);
                mesh.position.y = 0; 
                animationAttack.start();               
            }
            // Idle animation play distance
            if(distVec >= 40){                
                animationIdle.start();
                //this.healthBar.isVisible = false;
            }     
            // Attack animation play distance
            if(distVec < 5){
                animationAttack.start();
                player.healthDown(0.6);              
            }           
        }
       
    } 

    shoot(){
        
    }
    
    destroy(){       
        let mesh = this.mesh;                              
        mesh.setEnabled(false); // Works cause mesh.dispose() breaks collisions   
        this.destroyed = true;         
    }    
}



function enemyHUD(scene, mesh){   

    // GUI
    var plane = BABYLON.Mesh.CreatePlane("plane2", 2);
    plane.parent = mesh;
    plane.position.y = 1.3;
    plane.position.z = -1.65;
    //plane.rotate(BABYLON.Axis.X, 1.5, BABYLON.Space.LOCAL)


    //console.log(plane);
    var advancedTexture = new GUI.AdvancedDynamicTexture.CreateForMesh(plane, 600, 600);

    var healthBar = new GUI.Rectangle("enemyHealthBar2");
    advancedTexture.addControl(healthBar);
    healthBar.width = 10;
    healthBar.height = "20px";
    healthBar.cornerRadius = 20;
    healthBar.color = "white";
    healthBar.thickness = 2;
    healthBar.background = "red";

    return healthBar;

} 

