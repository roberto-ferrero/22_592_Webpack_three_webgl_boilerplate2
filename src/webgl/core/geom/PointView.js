//import gsap from "gsap"
import * as THREE from 'three'


//https://www.npmjs.com/package/@flatten-js/core

class PointView{
    constructor (obj){
        //console.log("(PointView.CONSTRUCTORA): ", obj)
        this.parent3D = obj.parent3D
        this.math = obj.math, // Objeto con x, y, z
        this.visible = obj.visible
        this.color = obj.color || 0xff0000
        //-----------
        this.x = this.math.x
        this.y = this.math.y
        this.z = this.math.z || 0
        this.length = 10
        //-----------
        // THREEJS
        this.cont3D = new THREE.Object3D()
        this.cont3D.position.set(this.x, this.y, this.z)
        this.parent3D.add(this.cont3D)

        this.material = new THREE.LineBasicMaterial({
            color: this.color,
            visible:this.visible
        });
        const points = [];
        points.push( new THREE.Vector3( this.length, 0, 0 ) );
        points.push( new THREE.Vector3( 0, 0, 0 ) );
        points.push( new THREE.Vector3( 0, this.length, 0 ) );
        points.push( new THREE.Vector3( 0, 0, 0 ) );
        points.push( new THREE.Vector3( 0, 0, this.length ) );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        this.mesh = new THREE.Line( geometry, this.material );
        this.cont3D.add(this.mesh);
     }
     //----------------------------------------------
     // PUBLIC:
     show(){
        //console.log("(PointView.show)!")
        this.material.visible = true
    }
    hide(){
         //console.log("(PointView.hide)!")
        this.material.visible = false
     }
     update(){
        //console.log("(PointView.update)!")
        this.x = this.math.x 
        this.y = this.math.y
        this.z = this.math.z || 0
        //--
        this.cont3D.position.set(this.x, this.y, this.z)
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

}
export default PointView