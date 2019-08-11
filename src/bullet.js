import * as BABYLON from "@babylonjs/core/Legacy/legacy"
import { SceneLoader } from "@babylonjs/core/Legacy/legacy";


export default class Bullet{
    constructor(scene, mesh){
        this.scene = scene;
        this.mesh = mesh;

        this.bullet = new BABYLON.Mesh.CreateSphere("bullet", 16, 0.5, this.scene);
        this.bullet.position = this.mesh.position.clone();

        // Creating the animation for the bullet
        this.setAnimations();
      
    }

    setAnimations(){        
        let scene = this.scene;
        let projectile = this.bullet;
        var frameRate = 60;        
        var animastionStart = projectile.position.x;

        // Setting up keys based on start-end values
        var keys = [{frame: 0, value: animastionStart},
            {frame: 50, value: animastionStart + 2 },
            {frame: 100, value: animastionStart + 4}];


        // Setting up the animation object
        var display = new BABYLON.Animation(
            "move",
            "position.x",
            frameRate,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,            
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);  
        // Push the keys to athe animations
        display.setKeys(keys);
        projectile.animations.push(display); 
        console.log("Animations Created for : Enemy Projectile ");        
        
        var animation = scene.beginAnimation(projectile, 0, 100,false, 2);        
        // Destroy enemy projectile at the end position
        animation.onAnimationEnd = function () {            
            console.log("Projectile Animation ended");
            projectile.dispose();
        }
        
        
    }  
}