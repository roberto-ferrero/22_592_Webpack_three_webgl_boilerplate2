//import gsap from "gsap"

import * as THREE from 'three'
import { Object3D, Plane } from 'three'
import Datos from '../core/Datos'


class Stage3D{
    constructor (obj){
        console.log("(Stage3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        //--
        this.scene = this.app.scene
        this.camera = this.app.camera
        this.gltfLib = this.app.gltfLib
        this.textureLib = this.app.textureLib
        //--
        this.params = {}

        
    }
    //----------------------------------------------
    // PUBLIC:
    update(){

    }
    
    //----------------------------------------------
    // EVENTS:
    _resize(){

    }

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
export default Stage3D