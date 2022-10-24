//import gsap from "gsap"
import * as THREE from 'three'


//https://www.npmjs.com/package/@flatten-js/core

class SegmentView{
    constructor (obj){
        //console.log("(SegmentView.CONSTRUCTORA): ", obj)
        this.parent3D = obj.parent3D
        this.math = obj.math, // SegmentMath
        this.visible = obj.visible
        //-----------
        this.p1 = this.math.get_p1()
        this.p2 = this.math.get_p2()
        //-----------
        // THREEJS
        this.material = new THREE.LineBasicMaterial({
            color: obj.color,
            visible:this.visible
        });
        const points = [];
        points.push( new THREE.Vector3( this.p1.x, this.p1.y, 0 ) );
        points.push( new THREE.Vector3( this.p2.x, this.p2.y, 0 ) );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        this.mesh = new THREE.Line( geometry, this.material );
        this.parent3D.add(this.mesh);
     }
     //----------------------------------------------
     // PUBLIC:
     show(){
        this.material.visible = true
     }
     hide(){
        this.material.visible = false
     }
     update(){
        //console.log("(SegmentView.update)!")
        this.p1 = this.math.get_p1()
        this.p2 = this.math.get_p2()
        //--
        this.parent3D.remove(this.mesh)
        const points = [];
        points.push( new THREE.Vector3( this.p1.x, this.p1.y, 0 ) );
        points.push( new THREE.Vector3( this.p2.x, this.p2.y, 0 ) );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        this.mesh = new THREE.Line( geometry, this.material );
        this.parent3D.add(this.mesh);
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

}
export default SegmentView