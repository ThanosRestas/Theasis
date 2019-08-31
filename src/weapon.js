
export default class Weapon{
    constructor(name, mesh, start){
        // Weapon properties
        this.name = name;
        this.mesh = mesh;
        this.ammo = 30;
        this.damage = 0;
        this.range = 0;        
        // Animation properties
        this.start = start;
        this.animation = null;      
        // Create the proper animation per gun upon object creation
        this.setAnimations();
        
        this.mesh.setEnabled(false);

        
        
        //console.log(this.mesh);
    }
    setAnimations(){        
        // Setting the end position of the animation(usually the same as the start)
        var end = this.start.clone();
        // Setting appropriate end position according to gun model
        if(this.name == "pistol"){
            this.damage = 1;
            this.range = 25;
            //end.z -= Math.PI/10;
            //this.animation = scene.animationGroups[1].start(false);   
        }
        else if(this.name == "shotgun"){
            this.damage = 2.5;
            this.range = 10;
            //end.z -= Math.PI/20;
        }
        else if(this.name == "ak47"){
            this.damage = 5;
            this.range = 50;
            end.x -= Math.PI/100;        
        }
        
        if(this.name!== "pistol" || this.name != "shotgun"){
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
}