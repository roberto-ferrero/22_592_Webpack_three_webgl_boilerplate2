//import gsap from "gsap"
//import * as THREE from 'three'

import TextureLib from "../libs/TextureLib"
import HDRLib from "../libs/HDRLib"
import GLTFLib from "../libs/GLTFLib"

const EventEmitter = require('events');

class AppLoaders{
    constructor (obj){
        console.log("(AppLoaders.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.pathPrefix = obj.pathPrefix
        //--
        this.all_loaded = false
        this.emitter = new EventEmitter()
        //----------------------
        this._init_textureLib()
        this._init_hdrLib()
        this._init_gltfLib()


        //----------------------
        // APP Assets to load:
        // Textures:
        this.textureLib.addLoad("sample_texture", this.pathPrefix+"img/face1.jpg")
        // HDRs:
        //this.hdrLib.addLoad("sample_hdri_map", this.pathPrefix+"hdr/sample.hdr")
        // GLTFs:
        this.gltfLib.addLoad("sample_gltf", this.pathPrefix+"glbs/sample.glb", true)
    }
    //----------------------------------------------
    // PUBLIC:
    start(){
        this.textureLib.start()
        this.hdrLib.start()
        this.gltfLib.start()
    }
    get_texture(itemId){
        return this.textureLib.get(itemId)
    }
    get_gltf(itemId){
        return this.gltfLib.get(itemId)
    }
    get_hdr(itemId){
        return this.hdrLib.get(itemId)
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _init_textureLib(){
        this.textureLib = new TextureLib()
        this.textureLib.emitter.addListener("onCompleted", ()=>{
            this._eval_all_loaded()
        })
    }

    _init_hdrLib(){
        this.hdrLib = new HDRLib()
        this.hdrLib.emitter.addListener("onCompleted", ()=>{
            this._eval_all_loaded()
        })
    }

    _init_gltfLib(){
        this.gltfLib = new GLTFLib({
            draco_pathPrefix:this.pathPrefix
        })
        this.gltfLib.emitter.addListener("onCompleted", ()=>{
            this._eval_all_loaded()
        })
    }

    _eval_all_loaded(){
        if(this.textureLib.all_loaded && this.hdrLib.all_loaded && this.gltfLib.all_loaded){
            console.log("(AppLoaders._eval_all_loaded): onCompleted!")
            this.all_loaded = true
            this.emitter.emit("onCompleted")
        }
    }
    //----------------------------------------------
    // AUX:

}
export default AppLoaders