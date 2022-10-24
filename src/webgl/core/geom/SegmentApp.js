//import gsap from "gsap"
import * as THREE from 'three'

import SegmentView from './SegmentView'
import Segmento from '../../core/geom/Segmento';
import Linea from '../../core/geom/Linea';
import Flatten from '@flatten-js/core'
const {Point, Vector, Circle, Line, Ray, Segment, Arc, Box, Polygon, Matrix, PlanarSet} = Flatten;

//https://www.npmjs.com/package/@flatten-js/core

class SegmentApp{
    constructor (obj){
        //console.log("(SegmentApp.CONSTRUCTORA): ", obj)
        this.app = obj.app,
        this.p1 = obj.p1, // Flatten.Point
        this.p2 = obj.p2, // Flatten.Point
        this.parent3D = obj.parent3D,
        this.color = obj.color
        this.visible = obj.visible
        //-----------
        this._math = new Segment(this.p1, this.p2)
        this._math2 = new Segmento(this.p1, this.p2)
        //------------
        this.view = new SegmentView({
            parent3D:this.parent3D,
            math:this,
            color:this.color,
            visible:this.visible
        })
        //-------------
        this.app.emitter.on("onShowBackstage", (e)=>{
            if(e.show){
                this.visible = true
                this.show()
            }else{
                this.visible = false
                this.hide()
            }
        })
     }
    //----------------------------------------------
    // PUBLIC:
     hide(){
        this.view.hide()
     }
     show(){
        this.view.show()
     }

    get_p1(){
        return this._math.ps.clone()
    }
    get_p2(){
        return this._math.pe.clone()
    }
    get_middle(){
        return this._math.middle()
    }
    get_intermediatePoint(factor){
        const pointAux = this._math2.getPuntoIntermedio(factor)
        return new Point(pointAux.x, pointAux.y)
    }
    /*
    get_line(range){
        const line = Linea.getLinea2(this.p1, this.p2)
        const ranged_segmento = line.get_segmento(range)
        const ranged_segment = this.__segmento_to_segment(ranged_segmento)
        return ranged_segment
    }
    */
    make_line(range){
        const line = Linea.getLinea(this.p1, this.p2)
        const ranged_segmento = line.get_segmento(range)
        //console.log("ranged_segmento: ", ranged_segmento)
        this.update(new Point(ranged_segmento.p1.x, ranged_segmento.p1.y), new Point(ranged_segmento.p2.x, ranged_segmento.p2.y))
    }

    get_mediatrixSegment(range){
        //const middlePoint = this._math.middle()
        const mediatrix_linea2 = this._math2.getMediatriz()
        const mediatrix_segmento2 = mediatrix_linea2.get_segmento(range)
        const mediatrix_segment1 = this.__segmento_to_segment(mediatrix_segmento2)
        return mediatrix_segment1
    }
    get_perpendicularAt(factor, range){
        //const middlePoint = this._math.middle()
        //const mediatrix_linea2 = this._math2.getMediatriz()
        const perpendicular_linea2 = this._math2.getPerpendicular(factor)
        const perpendicular_segmento2 = perpendicular_linea2.get_segmento(range)
        const perpendicular_segment1 = this.__segmento_to_segment(perpendicular_segmento2)
        return perpendicular_segment1
    }
    //----------------------------------------------
    // EVENTS:
    update(_p1, _p2){
        this.p1 = _p1.clone()
        this.p2 = _p2.clone()
        this._math.ps = this.p1
        this._math.pe = this.p2
        //--
        this._math2.p1 = this.p1
        this._math2.p2 = this.p2
        //--
        this.view.update()
    }
    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:
    __segmento_to_segment(segmento){
        return new Segment(new Point(segmento.p1.x, segmento.p1.y), new Point(segmento.p2.x, segmento.p2.y))
    } 
}
export default SegmentApp