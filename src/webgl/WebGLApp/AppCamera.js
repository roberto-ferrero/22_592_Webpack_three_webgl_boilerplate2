//import gsap from "gsap"
//import * as THREE from 'three'

class AppCamera{
    constructor (obj){
        console.log("(AppCamera.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.camera_holder = obj.camera_holder
        //--
        this.scrollProgress = 0


        //--
        this.app.emitter.on("onScrollProgressUpdate", (event)=>{
            //console.log("progress: "+event.progress);
            this._update_scroll(event.progress)
        })
    }
    //----------------------------------------------
    // PUBLIC:
    update_resize(){
        this._update_camera_position()
    }
    //----------------------------------------------
    // EVENTS:
    
    //----------------------------------------------
    // PRIVATE:
    _update_scroll(progress){
        this.scrollProgress = progress
        this._update_camera_position()
    }

    _update_camera_position(){
        const y_range = this.app.stage.get_stageHeight()-this.app.height
        const posY = -(y_range*this.scrollProgress)
        this.camera_holder.position.y = posY
    }
    //----------------------------------------------
    // AUX:
  
}
export default AppCamera