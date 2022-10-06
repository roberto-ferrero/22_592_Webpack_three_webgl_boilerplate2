import * as THREE from "three"
import Datos from "../core/Datos"

const EventEmitter = require('events');

class TextureLib{
    constructor (obj){
        //console.log("(TextureLib.CONSTRUCTORA)!")
        //--
        this.emitter = new EventEmitter()
        this.data = new Datos()
        this.itemsLoaded = 0
        this.all_loaded = false
    }
        
    //----------------------
    // PUBLICAS:
    start(){
        //console.log("(TextureLib.start)!")
        if(this.data.arrayItems.length != 0){
            this.loadingManager = new THREE.LoadingManager(
                ()=>{
                    this._completed()
                }
            )
            this.textureLoader  = new THREE.TextureLoader(this.loadingManager);
            for(let i=0; i<this.data.arrayItems.length; i++){
                const itemId = this.data.arrayItems[i]
                const item = this.data.getItemAt(i)
                item.texture = this.textureLoader.load(item.path, (response)=>{this.itemsLoaded++})
            }
        }else{
            this._completed()
        }
    }
    addLoad(itemId, path){
        //console.log("(TextureLib.addLoad)!")
        const item = {}
        item.id = itemId
        item.path = path
        item.loaded = false
        item.texture = null
        this.data.nuevoItem(item.id, item)
    }
    get(itemId){
        return this.data.getItem(itemId).texture
    }
    get_dimensions(itemId){
        const obj ={
            width: this.get(itemId).image.width,
            height: this.get(itemId).image.height
        }
        return obj
    }

    //----------------------
    // PRIVADAS:
    _completed(){
        //console.log("(TextureLib._completed)!", this.data)
        this.all_loaded = true
        this.emitter.emit("onCompleted")
    }
        
}
export default TextureLib