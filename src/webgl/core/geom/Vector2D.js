class Vector2D{
    constructor (_x, _y){
        //console.log("(Vector2D.CONSTRUCTORA)!")
        this.x = _x || 0;
        this.y = _y || 0;
    }

    //-------------------------
    // GETTERS Y SETTERS  
    get componente(){
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    set componente(valor){
        var r = this.componente;
		r ? this.escalar(valor/r) : this.x = valor;
    }

    get magnitud(){
        return this.componente
    }
    set magnitud(valor){
        this.componente = valor
    }

    get anguloRad(){
        return Math.atan2(this.y, this.x)
    }
    set anguloRad(valor){
        const r = this.componente;
        this.x = r * Math.cos(valor);
        this.y = r * Math.sin(valor);
    }

    get anguloDeg(){
        return Math.atan2(this.y, this.x)*(180/Math.PI);
    }
    set anguloDeg(valor){
        const r = this.componente;
        this.x = r * Math.cos(valor*(Math.PI/180));
        this.y = r * Math.sin(valor*(Math.PI/180));
    }

    //-------------------------
    // STATICOS:
    static multiplicar2Vec(v1, v2) {
        var vx = v1.x*v2.x
        var vy = v1.y*v2.y
        return (new Vector2D(vx, vy))
    };

    //-------------------------
    // PUBLICAS:
    clonar() {
        // Devuelve un punto clon del actual
        return new Vector2D(this.x, this.y);
      }
      trace() {
          console.log("Vector2D: x:"+this.x+" y:"+this.y)
      }
  
  
      sumar(v) {
          this.x += v.x;
          this.y += v.y;
      }
      restar(v) {
          this.x -= v.x;
          this.y -= v.y;
      }
  
      dividir (vector) {
          this.x /= vector.x;
          this.y /= vector.y;
      };
  
      multiplicar (vector) {
          this.x *= vector.x;
          this.y *= vector.y;
      };
      
  
  
  
      invertir() {
          this.x = -this.x;
          this.y = -this.y;
      }
      escalar(e) {
          this.x *= e;
          this.y *= e;
      }
  
      rotarDeg(grados) {
          var ca = Math.cos(grados*(Math.PI/180));
          var sa = Math.sin(grados*(Math.PI/180));
  
          var rx = this.x * ca - this.y * sa;
          var ry = this.x * sa + this.y * ca;
          this.x = rx;
          this.y = ry;
      }
      rotarRad(radianes) {
          var ca = Math.cos(radianes);
          var sa = Math.sin(radianes);
  
          var rx = this.x * ca - this.y * sa;
          var ry = this.x * sa + this.y * ca;
          this.x = rx;
          this.y = ry;
      }
      
      dot(v) {
          return this.x * v.x + this.y * v.y;
      }
  
      esPerpendicular(v) { // Boolean
          return (this.dot (v) == 0);
      }
  
      anguloMedioDeg(v) { // Grados
          var dp = this.dot (v);
          var cosAngle = dp / (this.componente * v.componente);
          return Math.acos(cosAngle)*(180/Math.PI);
      }
      anguloMedioRad(v) { // Radianes
          var dp = this.dot (v);
          var cosAngle = dp / (this.componente * v.componente);
          return Math.acos(cosAngle);
      }
  
      normalizar() {
          // Modifica el vector a uno de de igual orientacion pero de componente=1
          // Modifica el original
          var length = this.componente;
          if (length === 0) {
              this.x = 1;
              this.y = 0;
          } else {
              var vAux = new Vector2D(length, length)
              this.dividir(vAux);
          }
      }
      get_normalizado() {
          // Modifica el vector a uno de de igual orientacion pero de componente=1
          // NO modifica el original. Devuele un Vector2D
          //
          var cloneV = this.clonar()
          var length = cloneV.componente;
          if (length === 0) {
              cloneV.x = 1;
              cloneV.y = 0;
          } else {
              var vAux = new Vector2D(length, length)
              cloneV.dividir(vAux);
          }
          return cloneVV
      }

}
export default Vector2D