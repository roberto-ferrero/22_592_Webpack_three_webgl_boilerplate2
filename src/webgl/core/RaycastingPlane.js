import * as THREE from 'three'
const EventEmitter = require('events');

class RaycastingPlane{
    constructor (obj){
        //console.log("(RaycastingPlane.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.parent3D = obj.parent3D,
        this.id = obj.id,
        this.width = obj.width
        this.height = obj.height
        //--
        this.original_width = this.width
        this.original_height = this.height
        this.initialised = false
        //this.rnd = Math.random()
        //--
        this.geo = new THREE.PlaneBufferGeometry(this.width, this.height, 2, 2)
        this.mat = new THREE.MeshBasicMaterial({
            color: 0x666666,
            wireframe:true
        })
        this.plane = new THREE.Mesh(this.geo, this.mat)
        this.plane.position.set(0, 0, -0.01)
        this.parent3D.add(this.plane)
        //--
        this.mouse_raycaster = new THREE.Raycaster()
        //------------------
        this.isMouseover = false
        this.mouse_point = new THREE.Vector3()
        this.uv_point = new THREE.Vector3()
        //----------------------
        this.emitter = new EventEmitter()
        //------------------
        // APP EVENTS:
        this.app.emitter.on("onShowBackstage", (e)=>{
            if(e.show){
                this.mat.visible = true
            }else{
                this.mat.visible = false
            }
        })
        //------------------
        // DOM EVENTS:
        document.addEventListener('mousemove',(self) =>{
            if(this.app.initialised){
                this._update_raycaster(self)
            }
        }, false);
    }
    //----------------------------------------------
    // PUBLIC:
    get_uv_point(){
        return this.uv_point.clone()
    }
    get_mouse_point(){
        //console.log("(RaycastingPlane.get_mouse_point): "+this.rnd);
        return this.mouse_point.clone()
    }
    //----------------------------------------------
    // UPDATES:
    _update_raycaster(){
        //console.log("(RaycastingPlane._update_raycaster)!");
        this.mouse_raycaster.setFromCamera(this.app.mouse_position_norm, this.app.get_activeCamera());
        const intersect_array = this.mouse_raycaster.intersectObject(this.plane);
        if(intersect_array.length != 0 && this.initialised){
            this.uv_point = intersect_array[0].uv.clone()
            this.mouse_point.x = this.width*((this.uv_point.x*1)-0.5)
            this.mouse_point.y = this.height*((this.uv_point.y*1)-0.5)
            //console.log("intersect_array: ", intersect_array[0].uv);
            //console.log("uv: "+this.rnd, intersect_array[0].uv);
            if(!this.isMouseover){
                this.isMouseover = true
                this.emitter.emit("onMouseoverArea", {id:this.id})
                //this.app.mouseoverItem(this.id)
            }
        }else{
            if(this.isMouseover){
                this.isMouseover = false
                this.emitter.emit("onMouseoutArea", {id:this.id})
                //this.app.mouseoutItem(this.id)
            }
        }
        this.initialised = true
    }
    //----------------------------------------------
    // PRIVATE:
    //----------------------------------------------
    // AUX:

    init(){
        
    }

  
}
export default RaycastingPlane