import * as BABYLON from "@babylonjs/core/Legacy/legacy";
export default class Weapon{
    constructor(name, mesh, ammo, damage, range, scene){
           
        // Weapon properties
        this.name = name;
        this.mesh = mesh;
        this.ammo = ammo;
        this.damage = damage;
        this.range = range;    
        this.scene = scene;    
        // Making mesh invisible
        this.mesh.setEnabled(false);
        // Animation properties
        this.start = this.mesh.rotation;
        this.animation = null;
        this.animationSpeed = 1.5;      
        // Create the proper animation per gun upon object creation
        this.setAnimations();        
    }
    setAnimations(){        
        // Setting the end position of the animation(usually the same as the start)
        var end = this.start.clone();

        if(this.name == "shotgun"){
            //this.damage = 2.5;
            //this.range = 10;
            end.z -= Math.PI/20;
            this.animationSpeed = 1;
        }
        else if(this.name == "ak47"){
            //this.damage = 5;
            //this.range = 50;
            end.x -= Math.PI/100; 
            this.animationSpeed = 5;      
        }
        
        if(this.name!== "pistol" ){
            // Setting up keys based on start-end values
            var keys = [{frame: 0,value: this.start},{frame: 10,value: end},{frame: 100,value: this.start}];
            // Setting up the animation object
            var display = new BABYLON.Animation(
                "fire",
                "rotation",
                60,
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3,            
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);  
        
            display.setKeys(keys);

            this.mesh.animations.push(display);
            console.log("Animations Created for: " + this.name);
        }

        
        if(this.name == "rayGun"){
            //this.damage = 2.5;
            //this.range = 10;
            end.x -= Math.PI/20;
            this.animationSpeed = 5;
        }

        if(this.name == "lightingGun"){
            //this.damage = 2.5;
            //this.range = 10;
            end.x -= Math.PI/20;
            this.animationSpeed = 5;
        }

    } 
}

