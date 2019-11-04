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
        // Weapon barrel
        this.bar = new BABYLON.Mesh.CreateSphere("bar", 16, 0.05, this.scene);
        this.bar.parent = this.scene.activeCamera;
        this.bar.isVisible = false;
        this.bar.isPickable = false;
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
            
            this.bar.setPositionWithLocalVector(new BABYLON.Vector3(0.59, -0.64, 2.90));
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
            this.bar.setPositionWithLocalVector(new BABYLON.Vector3(0.56, -0.64, 5.27));           
        }

        if(this.name == "lightingGun"){
            //this.damage = 2.5;
            //this.range = 10;
            end.x -= Math.PI/20;
            this.animationSpeed = 5;
            
        }

    } 

    // Shooting setup
    shootingEffect(org, dest, sparkMesh, orbMesh, scene){
        if(this.name == "rayGun" || this.name == "ak47" ){            
            makeSparkRayMesh(org, dest, sparkMesh, orbMesh, scene);
        }
    }
}

function makeSparkRayMesh(org, dest, sparkMesh, orbMesh, scene){  

    if(dest == null){
        dest = org;
    }
    var dist = BABYLON.Vector3.Distance(org, dest);
   
    var orb1 = orbMesh.clone("orb1");
    var orb2 = orbMesh.clone("orb2");

    orb1.isVisible = true;
    orb2.isVisible = true;

    orb1.isPicKable = false;
    orb2.isPicKable = false;

    var spark1 = sparkMesh.clone("spark");
    spark1.material.emissiveTexture = getSparkTexture(256, 128, scene);
    spark1.material.opacityTexture = spark1.material.emissiveTexture;
    spark1.isVisible = true;
    spark1.scaling.z = dist;
    spark1.position = org.clone();
    spark1.lookAt(dest);

    spark1.isPicKable = false;

    spark1.registerBeforeRender(function(){
        orb1.visibility -= 0.015;
        orb2.visibility -= 0.015;
        spark1.visibility -= 0.015;
        if(spark1.visibility <= 0){
            orb1.dispose();
            orb2.dispose();
            spark1.dispose();
        }
    });

    orb1.position = org.clone();
    orb2.position = dest.clone();
}

function getSparkTexture(width, height, scene){
    var texture = new BABYLON.DynamicTexture("spark", { width: width, height: height }, scene);   
    var ctx = texture.getContext();
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#5767AF";
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(0, height / 2);
    var s = 25;
    for(var i=0; i<1000; i++){
    	ctx.lineTo(i / 99 * width, height / 2 + Math.random() * s - Math.random() * s);
    }
    ctx.stroke();
    
    //ctx.beginPath();
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.moveTo(0, height / 2);
    for(var i=0; i<1000; i++){
    	ctx.lineTo(i / 99 * width, height / 2 + Math.random() * 4 - Math.random() * 4);
    }
    ctx.stroke();
    texture.update();
    return texture;
}