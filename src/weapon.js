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
        this.bar = new BABYLON.Mesh.CreateSphere(this.name + "muzzle", 16, 0.05, this.scene);
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
        //test
    }
    setAnimations(){        
        // Setting the end position of the animation(usually the same as the start)
        var end = this.start.clone();

        // Animations created for every weapon except pistols cause it has them baked
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

        // Set properties of each weapon

        if(this.name == "pistol"){
            this.damage = 10;
            //this.range = 10;
            this.mesh.setEnabled(true);
            this.bar.setPositionWithLocalVector(new BABYLON.Vector3(0.97, -0.78, 4.58));
        }

        if(this.name == "shotgun"){
            //this.damage = 2.5;
            //this.range = 10;
            end.z -= Math.PI/20;
            this.animationSpeed = 1;
            
            this.bar.setPositionWithLocalVector(new BABYLON.Vector3(0.99, -0.74, 5.11)); 
        }
        
        if(this.name == "ak47"){
            //this.damage = 5;
            //this.range = 50;
            end.x -= Math.PI/100; 
            this.animationSpeed = 5;  
            
            this.bar.setPositionWithLocalVector(new BABYLON.Vector3(0.70, -0.74, 3.30));            
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
            
            this.bar.setPositionWithLocalVector(new BABYLON.Vector3(0.66, -0.93, 4.73));
        }

    } 

    // Shooting setup
    shootingEffect(org, dest, sparkMesh, orbMesh, scene){
        if(this.name == "rayGun"){            
            
            makeLazerkRayMesh(org, dest, sparkMesh, orbMesh, scene);
        }
        else if (this.name == "ak47"){            
            var ak47Texture = new BABYLON.Texture("../assets/textures/ak47Muzzle.png", scene);
            var ak47Mesh = BABYLON.MeshBuilder.CreatePlane("ak47", { size: 1 }, scene);
            var ak47Mat = new BABYLON.StandardMaterial("ak47Mat", scene);
            ak47Mat.disableLighting = true;
            ak47Mat.emissiveTexture = ak47Texture;
            ak47Mat.opacityTexture = ak47Texture;
            ak47Mesh.material = ak47Mat;
            ak47Mesh.scaling.scaleInPlace(0.2);
            ak47Mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            
            ak47Mesh.isVisible = false;
            ak47Mesh.isPickable = false;

            muzzle(org, dest, ak47Mesh, scene);
            ak47Mesh.dispose();      
        }
        else if (this.name == "pistol"){            
            var pistolTexture = new BABYLON.Texture("../assets/textures/pistolMuzzle.png", scene);
            var pistolMesh = BABYLON.MeshBuilder.CreatePlane("pistol", { size: 1 }, scene);
            var pistolMat = new BABYLON.StandardMaterial("pistolMat", scene);
            pistolMat.disableLighting = true;
            pistolMat.emissiveTexture = pistolTexture;
            pistolMat.opacityTexture = pistolTexture;
            pistolMesh.material = pistolMat;
            pistolMesh.scaling.scaleInPlace(0.5);
            pistolMesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            pistolMesh.rotate(BABYLON.Axis.Y, 1.3, BABYLON.Space.LOCAL);
            pistolMesh.isVisible = false;
            pistolMesh.isPickable = false;

            muzzle(org, dest, pistolMesh, scene);
            pistolMesh.dispose();      
        }
        else if (this.name == "shotgun"){            
            var shotgunTexture = new BABYLON.Texture("../assets/textures/shotgunMuzzle.png", scene);
            var shotgunMesh = BABYLON.MeshBuilder.CreatePlane("shotgun", { size: 1 }, scene);
            var shotgunMat = new BABYLON.StandardMaterial("shotgunMat", scene);
            shotgunMat.disableLighting = true;
            shotgunMat.emissiveTexture = shotgunTexture;
            shotgunMat.opacityTexture = shotgunTexture;
            shotgunMesh.material = shotgunMat;
            shotgunMesh.scaling.scaleInPlace(0.8);
            shotgunMesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            shotgunMesh.rotate(BABYLON.Axis.Y, 1.5, BABYLON.Space.LOCAL);
            shotgunMesh.rotate(BABYLON.Axis.Z, 3.14, BABYLON.Space.LOCAL);
            shotgunMesh.isVisible = false;
            shotgunMesh.isPickable = false;

            muzzle(org, dest, shotgunMesh, scene);
            shotgunMesh.dispose();      
        }
        else if (this.name == "lightingGun"){            
            makeSparkRayMesh(org, dest, sparkMesh, orbMesh, scene);
        }

       



    }
}


// Ray gun effect
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


// Lazer gun effect
function makeLazerkRayMesh(org, dest, sparkMesh, orbMesh, scene){  

    if(dest == null){
        dest = org;
    }
    var dist = BABYLON.Vector3.Distance(org, dest);
   
    var orb1 = orbMesh.clone("orb1");
    

    orb1.isVisible = true;
   

    orb1.isPicKable = false;
   

    var spark1 = sparkMesh.clone("spark");
    spark1.material.emissiveTexture = getLazerTexture(256, 128, scene);
    spark1.material.opacityTexture = spark1.material.emissiveTexture;
    spark1.isVisible = true;
    spark1.scaling.z = dist;
    spark1.position = org.clone();
    spark1.lookAt(dest);

    spark1.isPicKable = false;

    spark1.registerBeforeRender(function(){
        orb1.visibility -= 0.015;
        
        spark1.visibility -= 0.015;
        if(spark1.visibility <= 0){
            orb1.dispose();
            
            spark1.dispose();
        }
    });

    orb1.position = org.clone();
    
}

function getLazerTexture(width, height, scene){
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
    	ctx.lineTo(i / 99 * width, height / 2 );
    }
    ctx.stroke();
    
    //ctx.beginPath();
    ctx.stroke();
    ctx.lineWidth = 2;
    //ctx.moveTo(0, height / 2);
    //for(var i=0; i<1000; i++){
    	//ctx.lineTo(i / 99 * width, height / 2 + Math.random() * 4 - Math.random() * 4);
    //}
    ctx.stroke();
    texture.update();
    return texture;
}

// Pistol, Shotgun, Ak47 effect
function muzzle(org, dest, orbMesh){    

    if(dest == null){
        dest = org;
    }
    
    var orb1 = orbMesh.clone("orb1");
    var orb2 = orbMesh.clone("orb2");
    //orb2.scaling.scaleInPlace(5);

    orb1.isVisible = true;
    orb2.isVisible = true;

    orb1.isPicKable = false;
    orb2.isPicKable = false;

    orb1.registerBeforeRender(function(){
        orb1.visibility -= 0.015;      
        if(orb1.visibility <= 0 || orb2.visibility <= 0){
            orb1.dispose();                     
        }
    });
    
    orb2.registerBeforeRender(function(){        
        orb2.visibility -= 0.015;       
        if(orb1.visibility <= 0 || orb2.visibility <= 0){           
            orb2.dispose();            
        }
    });

    orb1.position = org.clone();
    orb2.position = dest.clone();
}