import * as BABYLON from "@babylonjs/core/Legacy/legacy"

export default class Weapon{
    constructor(name, mesh, start){
        // Weapon properties
        this.name = name;
        this.mesh = mesh;
        this.ammo = 30;        
        // Animation properties
        this.start = start;      
        // Create the proper animation per gun upon object creation
        this.setAnimations();        
    }
    setAnimations(){        
        // Setting the end position of the animation(usually the same as the start)
        var end = this.start.clone();
        // Setting appropriate end position according to gun model
        if(this.name == "pistol"){
            end.x += Math.PI/10;
        }
        else if(this.name == "shotgun"){
            end.z += Math.PI/30;
        }
        else if(this.name == "ak47"){
            end.z += Math.PI/100;        
        }     
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
}