//import gsap from "gsap"

import * as THREE from 'three'
import { Object3D, Plane } from 'three'
import Datos from '../core/Datos'


class AppStage{
    constructor (obj){
        console.log("(AppStage.CONSTRUCTORA): ", obj)
        this.app = obj.app
        //--
        this.stageHeight = this.app.height

        
    }
    //----------------------------------------------
    // PUBLIC:
    update_RAF(){

    }
    update_resize(){

    }

    get_stageHeight(){
        return this.stageHeight
    }
    
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    
    //----------------------------------------------
    // AUX:
    __getCube(_color, _size){
        const geometry = new THREE.BoxGeometry(_size,_size,_size);
        const material = new THREE.MeshBasicMaterial({
            color: _color,
            wireframe:true,
            //visible: false
        });
        const cube = new THREE.Mesh(geometry,material);
        //_scene.add(cube);
        return cube
    }
    __getSphere(){
        const geometry = new THREE.SphereGeometry(10, 20, 20)
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const mesh = new THREE.Mesh(geometry,material);
        return mesh
    }
    __addPointLight(scene, color, x, y, z) {
        var pointLight = new THREE.PointLight(color, 0.06);
        pointLight.position.set(x, y, z);
        pointLight.add(new THREE.Mesh(
                new THREE.SphereGeometry(0.7, 20, 10),
                new THREE.MeshBasicMaterial({
                    color: color
                })));
        scene.add(pointLight);
        return pointLight;
    };
  
}
export default AppStage