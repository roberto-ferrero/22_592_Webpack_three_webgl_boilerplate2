class Punto{
    constructor (_x, _y){
        //console.log("(Punto.CONSTRUCTORA)!")
        this.x = _x || 0;
        this.y = _y || 0;
    }

    //----------------------
    // PUBLICOS  
    actualizarXY(_x, _y) {
        this.x = _x;
          this.y = _y;
      }
    actualizarPto(p) {
    this.x = p.x;
        this.y = p.y;
    }

    clonar() {
        // Devuelve un punto clon del actual
        return new Punto(this.x, this.y);
    }
    offset(dx, dy) {
        // Aplica incrementos en x e y al punto.
        this.x += dx;
        this.y += dy;
    }
    distancia(p2) {
        const dx = p2.x-this.x;
        const dy = p2.y-this.y;
        return Math.sqrt(dx*dx+dy*dy);
    }
    sumar(p2) {
    // Sobre el punto actual se suman los valores de otro punto.
    this.x += p2.x;
    this.y += p2.y;
    }
    restar(p2) {
    // Sobre el punto actual se suman los valores de otro punto.
    this.x -= p2.x;
    this.y -= p2.y;
    }
    puntoMedio(p2) {
        return (new Punto(((this.x+p2.x)/2), ((this.y+p2.y)/2)));
    }

    eval_iguales(p) {
        return ((p.x == this.x) && (p.y == this.y));
    }
    trace() {
        console.log("Punto: x:"+this.x+" y:"+this.y)
    }

    //------------------------
    // STATICOS:
    static getPuntoMedio(p0, p1) {
        const puntoMedio = new Punto(((p0.x+p1.x)/2), ((p0.y+p1.y)/2));
        return puntoMedio;
    }
    static getPuntoIntermedio(p0, p1, factor) {
        // factor 0 -> 1
        const puntoIntermedio = new Punto(((p0.x+p1.x)*factor), ((p0.y+p1.y)*factor));
        return puntoIntermedio;
    }
    static restar2Ptos(p1, p2) {
        const p = new Punto((p1.x-p2.x),(p1.y-p2.y))
        return p
    }

}
export default Punto