/* eslint-disable semi */
/* eslint-disable linebreak-style */
/* eslint-disable no-irregular-whitespace */
import * as BABYLON from "@babylonjs/core/Legacy/legacy"
import "@babylonjs/core/Meshes/meshBuilder"
import { _BabylonLoaderRegistered, BoundingBox, RotationGizmo, Camera } from "@babylonjs/core/Legacy/legacy"
import "@babylonjs/loaders/OBJ";
import Engine from "./engine";
import Character from "./character";

let game, player;

function main(){    
    game = new Engine();
    player = new Character(game);    
    game.player = player;
    
    game.assetManager();
    game.pointerLock();
    player.characterController(game.hud);    
    game.render();  

    //var light4 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 50, 0), scene);
    
    
}

main();









