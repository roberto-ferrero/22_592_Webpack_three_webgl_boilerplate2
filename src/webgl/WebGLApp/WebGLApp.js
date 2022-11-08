//import gsap from "gsap"
import * as dat from 'dat.gui';
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import AppStage from "./AppStage"
import AppLoaders from './AppLoaders';
import AppTripod from './AppTripod';

const EventEmitter = require('events');

class WebGLApp{
    constructor (obj){
        console.log("(WebGLApp.CONSTRUCTORA): ", obj)
        //--
        this.$container = obj.$container
        this.pathPrefix = obj.pathPrefix
        //----------------------
        // DIMENSIONS:
        this.REF_RESOLUTION = {width:1920, height:947};
        this.REF_CAMERA_DISTANCE = 500
        this.width = this.$container.offsetWidth;
        this.height = this.$container.offsetHeight;
        this.responsiveScale = this.width/this.REF_RESOLUTION.width;
        this.cameraDistance = this.REF_CAMERA_DISTANCE*(this.height/this.REF_RESOLUTION.height)
        //----------------------
        this.emitter = new EventEmitter()
        this.emitter.setMaxListeners(2000)
        this.clock = new THREE.Clock()
        //----------------------
        // PUBLIC PARAMS:
        this.initialised = false
        this.init_asked = false
        this.all_loaded = false
        this.scrollProgress = 0
        //----------------------
        this.params = {}
        this.params.show_backstage = false
        this.params.use_camera_dev = false
        //--
        this.consts = {}
        //----------------------
        // LOADERS:
        this.loader = new AppLoaders({
            pathPrefix: this.pathPrefix
        })
        this.loader.emitter.on("onCompleted", ()=>{
            this.all_loaded = true
            this._init()
        })
        this.emitter.on("onShowBackstage", (event)=>{
            if(event.show){
                this.cameraHelper.visible = true
            }else{
                this.cameraHelper.visible = false
            }
        })
    }

    //--------------------------------------------
    // PUBLIC:
    init(){
        console.log("(WebGLApp.init)!")
        this.init_asked = true
        this.loader.start()
    }
    
    resize(resize_data){
        console.log("(WebGLApp.resize): ",resize_data )
        this._update_resize()
        this.stage.update_resize()
        this.tripod.update_resize()
        //--
        if(this.params.mobileMode && !resize_data.mobileMode){
            this.params.mobileMode = resize_data.mobileMode
            //console.log("PASAMOS A MODO DESKTOP!")
            this.emitter.emit("onMobileModeChanged")
        }else if(!this.params.mobileMode && resize_data.mobileMode){
            this.params.mobileMode = resize_data.mobileMode
            //console.log("PASAMOS A MODO MOBILE!")
            this.emitter.emit("onMobileModeChanged")
        }
    }

    update_scrollProgress(value){
        this.scrollProgress = value
    }

    get_activeCamera(){
        if(this.params.use_camera_dev){
            return this.camera_dev
        }else{
            return this.camera
        }
    }

    //--------------------------------------------
    // PRIVATE:
    _init(){
        console.log("(WebGLApp._init)!")
        this._init_THREEJS()
        this._init_stage()
        this._init_DOM_events()
        
        this.__init_gui() 
        
        this._update_resize()
        this._update_RAF()
        
        this.initialised = true
        this.emitter.emit("onShowBackstage", {show:this.params.show_backstage})
    }

    _init_THREEJS(){
         //----------------------
        // SCENE:
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x151515)
        
        //----------------------
        // CAMERAS:
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 6000 ); 
        this.scene.add( this.camera );
        this.cameraHelper = new THREE.CameraHelper( this.camera );
        this.scene.add( this.cameraHelper );
        //--
        this.tripod = new AppTripod({
            app:this,
            camera_holder:this.camera
        }) 
        //----------------------
        // RENDERER
        this.renderer = new THREE.WebGL1Renderer({
            antialias: true,
            //precision: "highp"
            alpha: false,
        });
        //this.renderer.autoClear = false // Vamos a usar 2 scenas (una para el background y otra para los puntos) que implicarán usar 2 acciones de render. Con autoclear false permitimos que la segunda no borre la primera.
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        //this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        //this.renderer.toneMappingExposure = 1.25;
        //--
        this.$container.appendChild(this.renderer.domElement)
        //--------
        this.camera_dev = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 20000 ); 
        this.camera_dev.position.set(100, -189, 421)
        this.camera_dev.lookAt(new THREE.Vector3(0, 0, 0))
        this.controls = new OrbitControls(this.camera_dev, this.renderer.domElement)

        //--------
        /*
        this.camera_dev = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 20000 ); 
        this.camera_dev.position.set(3000, 2000, 1000)
        this.camera_dev.lookAt(new THREE.Vector3(0, 0, 0))
        this.controls = new OrbitControls(this.camera_dev, this.renderer.domElement)
        */
    }

    _init_stage(){
        this.stage = new AppStage({
            app: this
        })
    }

    _init_DOM_events(){
        //----------------------
        // RESIZE EVENT:
        window.addEventListener('resize', ()=>{
            this._update_resize()
        })
        this._update_resize()
        //----------------------
        
        //this.this.mouse_position_norm_px = new THREE.Vector2(1, 1)   // Distancia en px al centro
        this.mouse_position_norm = new THREE.Vector2()
        document.addEventListener('mousemove',(self) =>{
            this._update_mouse(self)
        }, false);


        //------------------------
        document.addEventListener('keypress', (event) => {
            this._keypress(event.code)
        });
    }

    //--------------------
    // UPDATES:
    _update_resize(){
        console.log("(WebGLApp._update_resize)!")
        this.width = this.$container.offsetWidth;
        this.height = this.$container.offsetHeight;
        this.responsiveScale = this.width/this.REF_RESOLUTION.width;
        this.cameraDistance = this.REF_CAMERA_DISTANCE*(this.height/this.REF_RESOLUTION.height)

        this.renderer.setSize( this.width, this.height );
        this.camera.aspect = this.width/this.height
        this.camera.position.z = this.cameraDistance 
        this.camera.fov = 2*Math.atan((this.height/2)/(this.cameraDistance)) * (180/Math.PI) 
        this.camera.updateProjectionMatrix();
        //--
    }
    _update_RAF(){
        //console.log("(WebGLApp._update_RAF)!")
        if(this.height != this.$container.offsetHeight){
            this._update_resize()
        }
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame(this._update_RAF.bind(this))
    }
    _update_mouse(e){
        this.mouse_position_norm.x = ((e.pageX/this.width)*2)-1;
        this.mouse_position_norm.y = -((e.pageY/this.height)*2)+1;
        //--
        //this.mouse_position_norm_px.x = e.pageX-(e.pageX*0.5)
        //this.mouse_position_norm_px.y = -e.pageY+(e.pageY*0.5)
        //console.log(this.mouse_position_norm_px)
    }
    _keypress(code){
        if(code == "KeyA"){

        }
    }
    
    //--------------------------------------------
    // AUX:
    __init_gui(){
        this.gui = new dat.GUI({
            width: 300
        })
        this.gui.add(this.params, 'use_camera_dev').listen().onChange((value) => {
            //console.log(this.params.use_camera_dev)
            if(this.params.use_camera_dev){
                this.emitter.emit("onUseCameraDev", {show:true})
            }else{
                this.emitter.emit("onUseCameraDev", {show:false})
            }
        });

        this.gui.add(this.params, 'show_backstage').listen().onChange((value) => {
            //console.log(this.params.use_camera_dev)
            if(this.params.show_backstage){
                this.emitter.emit("onShowBackstage", {show:true})
            }else{
                this.emitter.emit("onShowBackstage", {show:false})
            }
        });
        /*
        this.gui.params.image_01_scale = 1
        this.gui.params.image_02_scale = 1
        this.gui.params.image_03_scale = 1
        this.gui.params.image_0a_plane_z = 0
        this.gui.params.image_0b_plane_z = 0
        //--
        this.gui.add(this.gui.params, 'image_01_scale', 0, 10).onChange( (value) => {
            this.emitter.emit("onScaleItem", {itemId:"image01", value:value})
        });
        this.gui.add(this.gui.params, 'image_02_scale', 0, 10).onChange( (value) => {
            this.emitter.emit("onScaleItem", {itemId:"image02", value:value})
        });
        this.gui.add(this.gui.params, 'image_03_scale', 0, 10).onChange( (value) => {
            this.emitter.emit("onScaleItem", {itemId:"image03", value:value})
        });
        this.gui.add(this.gui.params, 'image_0a_plane_z', -1000, 1000).onChange( (value) => {
            this.emitter.emit("onRepositionPlaneZ", {itemId:"sample0a", value:value})
        });
        this.gui.add(this.gui.params, 'image_0b_plane_z', -1000, 1000).onChange( (value) => {
            this.emitter.emit("onRepositionPlaneZ", {itemId:"sample0b", value:value})
        });
        */
        //--    
		this.gui.open();
    }

}
export default WebGLApp