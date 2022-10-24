import Punto from "./Punto.js"
import GeomUtils from "./GeomUtils.js"
import Segmento from "./Segmento.js";
import Vector2D from "./Vector2D.js";

class Linea{
    constructor (a, b, c){
        //console.log("(Linea.CONSTRUCTORA)!")
        this._a = a;
        this._b = b;
        // Para lineas verticales x=2
        this._c = c;
        //--
        this._anguloRad
        this._anguloDeg
        this.existe = true
        this._actualizar()
    }

    //----------------------
    // GETTERS Y SETTERS  
    get a(){
        return this._a
    }
    set a(valor){
        this._a = valor
        this._actualizar()
    }

    get b(){
        return this._b
    }
    set b(valor){
        this._b = valor
        this._actualizar()
    }
    
    get c(){
        return this._c
    }
    set c(valor){
        this._c = valor
        this._actualizar()
    }
    
    get anguloRad(){
        this._actualizar()
        return this._anguloRad
    }
    
    get anguloDeg(){
        this._actualizar()
        return this._anguloDeg
    }
    
    //----------------------
    // PUBLICOS:
    
    actualizar(linea) {
        this._a = linea.a
		this._b = linea.b
		this._c = linea.c
	}
    
    get_y(valor_x) {
        //console.log("(Linea.get_y): "+this._b)
        let valor_y;
        if (this._c != null) {
            // Es vertical
            valor_y = null;
        } else {
            valor_y = (this._a*valor_x)+this._b;
        }
        //console.log("valor_y: "+valor_y)
        return (valor_y);
    }
    
    get_x(valor_y) {
        const valor_x = ((valor_y-this._b)/this._a);
        return (valor_x);
    }


    get_segmento(range){
        // Devuelve un segmento de la linea
        let p1
        let p2
        if(this._c == null){
            // ES VERTICAL
            p1 = new Punto(this.get_x(-range), -range)
            p2 = new Punto(this.get_x(range), range)
        }else{
            //p1 = new Punto(-range, -this.get_y(range))
            //p2 = new Punto(range, this.get_y(range))
            p1 = new Punto(0, -this.get_y(range))
            p2 = new Punto(0, this.get_y(range))
        }
        const segmento = new Segmento(p1, p2)
        return segmento
    }

    get_vector(){
        const segmento = this.get_segmento()
        const vector = new Vector2D(segmento.p2.x - segmento.p1.x, segmento.p2.y - segmento.p1.y)
        vector.normalizar()
        return vector
    }

    get_normal(){
        let vector = this.get_vector()
        vector.rotarRad(Math.PI*0.5)
        return vector
    }

    
    clonar() {
        // Devuelve una linea clon de la actual
        return (new Linea(this._a, this._b, this._c));
    }
    
    trace() {
        console.log("Linea: a:"+this._a+" b:"+this._b+" c:"+this._c+" anguloRad: "+this._anguloRad+" anguloDeg: "+this._anguloDeg)
    }
    
    //----------------------
    // PRIVADOS:
    _actualizar() {
        //console.log("(Linea._actualizar): "+this._b)
        if (this._haveData(this._a) && this._haveData(this._b) && this._haveData(this._c)) {
            // ERROR: DEMASIADOS PARAMETROS
            console.error("SE HAN PASADO VALORES PARA a, b y c.   O SE PASAN a y b,  O SE PASA SOLO c")
        }else if (!this._haveData(this._a) && !this._haveData(this._b) && !this._haveData(this._c)) {
            // ERROR: NINGUN PARAMETRO
            console.error("NO E HAN PASADO VALORES PARA a, b o c.   O SE PASAN a y b,  O SE PASA SOLO c")
        }else if (this._haveData(this._a) && this._haveData(this._b)) {
            // NO es vertical:
            this._c = null
            const punto1 = new Punto(-100, this.get_y(-100));
            const punto2 = new Punto(100, this.get_y(100));
            this._anguloRad = GeomUtils.angleRadOfLinePts(punto1, punto2);
            this._anguloDeg = GeomUtils.angleDegOfLinePts(punto1, punto2);
        } else {
            // ES VERTICAL:
            this._a = null
            this._b = null
            this._anguloRad = 0
            this._anguloDeg = 0
        }
    }
    _haveData(valor){
        if(valor == null || valor == undefined){
            return false
        }else{
            return true
        }
    }
    _evalDefault(valor, defecto){
        if(this._haveData(valor)){
                return valor
        }else{
                return defecto
        }
    }
    //------------------------------
    // STATICOS:
    static getLinea(p0, p1) {
        // Pasamos 2 puntos p0 y p1 pertenecientes a la linea
        // Devuelve un objeto con la info para crear una función que determine la línea.
        // Hay 2 casos:
        //    1) La linea es vertical. Se pasa el parametro "c" que actua como constante.
        //    2) La linea no es vertical. Pasamos "a" y "b" para definir la linea mediante
        //       la funcion "y = a*x + b"
        var x0 = p0.x;
        var y0 = p0.y;
        var x1 = p1.x;
        var y1 = p1.y;
        var a = null
        var b = null
        var c = null
        var existe = true
        if (x0 == x1) {
            if (y0 == y1) {
                // P0 and P1 are same point, return null
                existe = false;
            } else {
                // Otherwise, the line is a vertical line
                c = x0;
            }
        } else {
            a = (y0-y1)/(x0-x1);
            b = y0-(a*x0);
        }
        // returns the line object
        return new Linea(a,b,c);
    }

    static getLinea2(p0, vector) {
        // Pasamos un punto de la linea y un vector de direccion
        // El vector dirección se define con "x" e "y" y su origen es 0,0
        // Devuelve un objeto con la info para crear una función que determine la línea.
        // Hay 2 casos:
        //    1) La linea es vertical. Se pasa el parametro "c" que actua como constante.
        //    2) La linea no es vertical. Pasamos "a" y "b" para definir la linea mediante
        //       la funcion "y = a*x + b"
        var x0 = p0.x;
        var vx0 = vector.x;
        var a = null
        var b = null
        var c = null
        var existe = true
        if (vx0 == 0) {
            // the line is vertical
            c = x0;
        } else {
            a = vector.y/vx0;
            b = p0.y-(a*x0);
        }
        // returns the line object
        //trace(linea.toString());
        return new Linea(a,b,c);
    }

    static getInterseccion(linea0, linea1) { // Punto
        // Devuelve un Punto el cual es la intersección de 2 Lineas
        // Devuelve null si no inserccionan
        //--
        // Make sure both lines exists
        if (!linea0.existe || !linea1.existe) {
            return null;
        }
        // define local variables           
        var a0 = linea0.a;
        var b0 = linea0.b;
        var c0 = linea0.c;
        var a1 = linea1.a;
        var b1 = linea1.b;
        var c1 = linea1.c;
        var u;
        // checks whether both lines are vertical
        if ((c0 == null) && (c1 == null)) {
            // lines are not verticals but parallel, intersection does not exist
            if (a0 == a1) {
                return null;
            }
            // calculate common x value.           
            u = (b1-b0)/(a0-a1);
            // return the new Point
            var puntoInterseccion = new Punto(u, (a0*u+b0));
            return puntoInterseccion;
        } else {
            if (c0 != null) {
                if (c1 != null) {
                    // both lines vertical, intersection does not exist
                    return null;
                } else {
                    // return the point on linea1 with x = c0
                    var puntoInterseccion = new Punto(c0, (a1*c0+b1));
                    return puntoInterseccion;
                }
            } else if (c1 != null) {
                // no need to test c0 as it was tested above
                // return the point on linea0 with x = c1
                var puntoInterseccion = new Punto(c1, (a0*c1+b0));
                return puntoInterseccion;
            }
        }
    }
}


export default Linea