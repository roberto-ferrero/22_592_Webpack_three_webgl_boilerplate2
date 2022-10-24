
import GeomUtils from "./GeomUtils.js"
import Punto from "./Punto.js"
import Linea from "./Linea.js"
import Vector2D from "./Vector2D.js"


class Segmento{
    constructor (p1, p2){
        // console.log("(Segmento.CONSTRUCTORA)!")
        this.p1 = p1;
		this.p2 = p2;
    }

    //-------------------------------
    // GETTERS Y SETTERS    
    get linea(){
        return Linea.getLinea(this.p1, this.p2)
    }
    get longitud(){
        return GeomUtils.distancePts(this.p1, this.p2)
    }
    get anguloRad(){
        return GeomUtils.angleOfLinePts(this.p1, this.p2);
    }
    get anguloDeg(){
        const rads =  GeomUtils.angleOfLinePts(this.p1, this.p2);
        return GeomUtils.radiansToDegrees(rads)
    }
    
    
    //-------------------------------
    // PUBLICOS   
    get_y(valor_x) {
		let valor_y;
		if (this._c != null) {
			// Es vertical
			valor_y = null;
		} else {
			valor_y = (this._a*valor_x)+this._b;
		}
		return (valor_y);
    }

    get_x(valor_y) {
		const valor_x = ((valor_y-this._b)/this._a);
		return (valor_x);
    }

    get_vector() {
        //console.log("(Segmento.get_vector)!");
		const vx = this.p2.x-this.p1.x
        const vy = this.p2.y-this.p1.y
        return new Vector2D(vx, vy)
    }
    get_normal() {
        let vector = this.get_vector()
        vector.normalizar()
        vector.rotarDeg(90)
        return vector
    }


    clonar() {
		// Devuelve una linea clon de la actual
		return new Segmento(this.p1.clonar(), this.p2.clonar());
    }

    getMediatriz() {
		const puntoMedio =  Punto.getPuntoMedio(this.p1, this.p2)
        let vector = this.get_vector()
        //vector.trace()
        vector.rotarDeg(90)
        //vector.trace()
        const mediatriz = Linea.getLinea2(puntoMedio, vector)
        //mediatriz.trace()
        return mediatriz
    }

    getPerpendicular(factor){
        const puntoIntermedio =  Punto.getPuntoIntermedio(this.p1, this.p2, factor)
        let vector = this.get_vector()
        //vector.trace()
        vector.rotarDeg(90)
        //vector.trace()
        const perpendicular = Linea.getLinea2(puntoIntermedio, vector)
        //mediatriz.trace()
        return perpendicular
    }

    getPuntoIntermedio(factor){
        return  Punto.getPuntoIntermedio(this.p1, this.p2, factor)
    }

    getPuntoADistanciaP1(distancia){
        const longitudSegmento = this.longitud
        const factor = distancia/longitudSegmento
        const punto = this.getPuntoIntermedio(factor)
        return punto
    }

    trace() {
        console.log("Segmento: a:"+this._a+" b:"+this._b+" c:"+this._c)
    }
}
export default Segmento