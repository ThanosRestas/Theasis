export default class Character{
    constructor(game){
        this.scene = game.scene;
        this.camera = game.camera;

        this.health = 0;
        this.energy = 0;
        this.ammunition = 0;
    }

    test(){
        console.log(this.scene);
    }
    
}