import * as BABYLON from "@babylonjs/core/Legacy/legacy"

export default class Weapon{
    constructor(name, mesh, start){
        // Weapon properties
        this.name = name;
        this.mesh = mesh;
        this.ammo = 30;
        
        // Animation properties
        this.start = start;
        this.end = start.clone();
        this.end.x -= Math.PI/10;// - if shotgun + if pistol

        // Setting up keys based on start-end values
        this.keys = [{frame: 0,value: this.start},{frame: 10,value: this.end},{frame: 100,value: this.start}];
        //this.keys = keys;

        // Setting up the animation object
        this.display = new BABYLON.Animation(
            "fire",
            "rotation",
            60,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,            
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);           
        
        
        this.setAnimations();        
    }

    setAnimations(){
        // Implement animations for each weapon with if/else conditions that check the name
        // and use the appropriate animations 
        this.display.setKeys(this.keys);
        this.mesh.animations.push(this.display);
        console.log("Animations Created for: " + this.name);
    }  
}