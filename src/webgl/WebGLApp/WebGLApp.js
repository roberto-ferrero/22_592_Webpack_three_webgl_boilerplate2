//import gsap from "gsap"
import * as dat from 'dat.gui';
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import AppStage from "./AppStage"
import AppLoaders from './AppLoaders';
import AppCamera from './AppCamera';

const EventEmitter = require('events');

class WebGLApp{
    constructor (obj){
        console.log("(WebGLApp.CONSTRUCTORA): ", obj)
        //--
        this.$el = obj.$el
        this.$container = obj.$container
        this.pathPrefix = obj.pathPrefix
        this.data = obj.data
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
        this.active = true
        this.isMouseover = false
        this.mobileMode = this.data.mobileMode

        this.init_asked = false
        this.all_loaded = false
        //---
        this.scroll_progress = 0
        this.scroll_progress_last = 0
        this.scroll_progress_delta = 0 // -1, +1
        this.scroll_offsetY = 0
        //----------------------
        // DEV PARAMS:
        this.show_backstage = false
        this.use_camera_dev = false
        //---------------------
        this.mouse_position_norm = new THREE.Vector2()
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
            this.cameraHelper.visible = this.show_backstage
        })
    }

    //--------------------------------------------
    // PUBLIC:
    init(){
        console.log("(WebGLApp.init)!")
        this.init_asked = true
        this.loader.start()
    }

    kill(){
        document.removeEventListener('keydown', this.listener_keypress)
        this.$container.removeEventListener('mousemove', this.listener_mousemove, false)
        this.$container.removeEventListener('mouseover', this.listener_mouseover, false)
        this.$container.removeEventListener('mouseout', this.listener_mouseout, false)
        window.removeEventListener('resize', this.listener_resize, false)

        cancelAnimationFrame(this.raf_request)

        this.emitter.emit("onKillApp")
        this.emitter.removeAllListeners()
    }

    activate(){
        if(!this.active){
            //console.log("(LogoGridApp.activate)!")
            this.active = true
            this.emitter.emit("onActivateApp", {})
        }
    }
    deactivate(){
        if(this.active){
            //console.log("(LogoGridApp.deactivate)!")
            this.active = false
            this.emitter.emit("onDeactivateApp", {})
        }
    }


    set_isMouseover(value){
        if(this.isMouseover != value){
            this.isMouseover = value
            if(this.isMouseover){
                //console.log("isMouseover = TRUE")
                this.emitter.emit("onMouseoverApp", {})
            }else{
                //console.log("isMouseover = FALSE")
                this.emitter.emit("onMouseoutApp", {})
            }
        }
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

    update_scroll_progress(value, offsetY){
        // console.log("(GoldenFaceApp.update_scroll_progress): ",value)
         this.scroll_progress_last = this.scroll_progress
         this.scroll_progress = value
         //--
         // console.log("--");
         // console.log("this.scroll_progress_last: "+this.scroll_progress_last);
         // console.log("this.scroll_progress: "+this.scroll_progress);
         //--
         if(this.scroll_progress_last < this.scroll_progress){
             this.scroll_progress_delta = 1
         }else if(this.scroll_progress_last > this.scroll_progress){
             this.scroll_progress_delta = -1
         }else{
             this.scroll_progress_delta = 0
         }
         this.scroll_offsetY = offsetY
         //--
         // console.log("this.scroll_progress_delta: "+this.scroll_progress_delta);
         this.emitter.emit("onScrollProgressUpdate", {scroll_progress:this.scroll_progress})
     }

    get_activeCamera(){
        if(this.use_camera_dev){
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
        this.emitter.emit("onShowBackstage", {show:this.show_backstage})
    }

    _init_THREEJS(){
         //----------------------
        // SCENE:
        this.scene = new THREE.Scene();
        //this.scene.background = new THREE.Color(0x151515)
        
        //----------------------
        // CAMERAS:
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 6000 ); 
        this.scene.add( this.camera );
        this.cameraHelper = new THREE.CameraHelper( this.camera );
        this.scene.add( this.cameraHelper );
        //--
        this.appCamera = new AppCamera({
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
        this.camera_dev = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 90000 ); 
        this.camera_dev.position.set(100, -189, 421)
        this.camera_dev.lookAt(new THREE.Vector3(0, 0, 0))
        this.controls = new OrbitControls(this.camera_dev, this.renderer.domElement)

    }

    _init_stage(){
        this.stage = new AppStage({
            app: this
        })
    }

    _init_DOM_events(){
        //----------------------
        // RESIZE EVENT:
        window.addEventListener('resize', this.listener_resize = ()=>{
            this._update_resize()
        })
        this._update_resize()
        //----------------------
        this.$container.addEventListener('mouseover', this.listener_mouseover = (self) =>{
            // console.log("mouseover");
            this.set_isMouseover(true)
        }, false);
        this.$container.addEventListener('mouseout', this.listener_mouseout = (self) =>{
            //console.log("mouseout");
            this.set_isMouseover(false)
        }, false);
        this.$container.addEventListener('mousemove', this.listener_mousemove = (self) =>{
            this._update_mouse(self)
        }, false);
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
        this.emitter.emit("onResize")
    }
    _update_RAF(){
        this.raf_request = requestAnimationFrame(this._update_RAF.bind(this))
        if(!this.active){
            return
        }
        //----
        if(this.height != this.$container.offsetHeight){
            this._update_resize()
        }
        //--
        this.emitter.emit("onUpdate")
        this.stage.update_RAF()
        //--
        this.renderer.render( this.scene, this.get_activeCamera());
    }
    _update_mouse(e){
        const container_rect = this.$container.getBoundingClientRect()
        const rel_mouse_posX = e.clientX-container_rect.x
        const rel_mouse_posY = e.clientY-container_rect.y
        //--
        this.mouse_position_norm.x = ((rel_mouse_posX/this.width)*2)-1;
        this.mouse_position_norm.y = -((rel_mouse_posY/this.height)*2)+1;
    }
    _keypress(code){
        if(code == "KeyA"){

        }
    }
    
    //--------------------------------------------
    // AUX:
    __clamp(num, min, max){
        return Math.min(Math.max(num, min), max)
    }
    __init_gui(){
        this.gui_obj ={
            scroll_progress: 0,
            call_func: () =>{
                //console.log("launch_glitter!")
                //this.emitter.emit("on_print_generator_points")
            }
        }
        this.gui = new dat.GUI({
            width: 300
        })
        this.gui.add(this, 'use_camera_dev').listen().onChange((value) => {
            //console.log(this.use_camera_dev)
            this.emitter.emit("onUseCameraDev", {show:this.use_camera_dev})
        });

        this.gui.add(this, 'show_backstage').listen().onChange((value) => {
            this.emitter.emit("onShowBackstage", {show:this.show_backstage})
        });

        this.gui.add(this.gui_obj, 'scroll_progress', 0, 1, 0.001).onChange((value) => {
            //console.log("(FaceGlitterApp.scroll_progress): "+value)
            this.update_scroll_progress(value)
        });
        //--
        this.gui.add(this.gui_obj, 'call_func');
        //--    
		this.gui.open();
    }

}
export default WebGLApp