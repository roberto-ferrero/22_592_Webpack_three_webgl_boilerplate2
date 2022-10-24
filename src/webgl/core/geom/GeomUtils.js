class GeomUtils{
    constructor (obj){
        //console.log("(static CONSTRUCTORA)!")
    }

    //-------------------
    // STATICOS:
    static DEG2RAD = 0.0174532925199433

    // Change radians to degree
	// 180/Math.PI
    static RAD2DEG = 57.2957795130823

    // The golden mean (phi)
	// (1+Math.sqrt(5))/2
    static PHI = 1.61803398874989

	// Euler-Mascheroni constant (lambda or C)<br>
    static LAMBDA = 0.57721566490143


    static sinD(angle) {
        /**
        * Takes an angle in degrees and returns its sine.
        * angle	The angle in degrees.
        * Returns the sine of the angle.
        */
		return Math.sin(angle*(Math.PI/180));
    }

    static cosD(angle) {
        /**
        * Takes an angle in degrees and returns its cosine.
        * angle	The angle in degrees.
        * Returns the cosine of the angle.
        */
		return Math.cos(angle*(Math.PI/180));
    }

    static tanD(angle) {
        /**
        * Takes an angle in degrees and returns its tangent.
        * angle	The angle in degrees.
        * Returns the tangent of the angle.
        */
        return Math.tan(angle*(Math.PI/180));
    }

    static asinD(ratio) {
        /**
        * Takes the inverse sine of a slope ratio and returns its angle in degrees.
        * ratio	The slope ratio.
        * Returns the angle in degrees.
        */
        return Math.asin(ratio)*(180/Math.PI);
    }

    static acosD(ratio) {
        /**
        * Takes the inverse cosine of a slope ratio and returns its angle in degrees.
        * ratio	The slope ratio.
        * Returns the angle in degrees.
        */
        return Math.acos(ratio)*(180/Math.PI);
    }

    static atanD(ratio) {
        /**
        * Takes the inverse tangent of a slope ratio and returns its angle in degrees.
        * ratio	The slope ratio.
        * Returns the angle in DEGREES.
        */
        return Math.atan(ratio)*(180/Math.PI);
    }

    static atan2D(y, x) {
        /**
        * Takes the inverse tangent of a slope ratio and returns its angle in degrees.
        * y	The y coordinate of the slope ratio.
        * x	The x coordinate of the slope ratio.
        * Returns the angle in DEGREES.
        */
       return Math.atan2(y, x)*(180/Math.PI);
    }

    static distance(x1, y1, x2, y2) {
        // Finds the distance between two points.
        var dx = x2-x1;
		var dy = y2-y1;
		return Math.sqrt(dx*dx+dy*dy);
    }

    static distancePts(p1, p2) {
        // Finds the distance between two points.
        var dx = p2.x-p1.x;
		var dy = p2.y-p1.y;
		return Math.sqrt(dx*dx+dy*dy);
    }

    static angleDegOfLine(x1, y1, x2, y2) {
        // Finds the angle of the line formed between two points. RADIANES
        return GeomUtils.atan2D(y2-y1, x2-x1);
    }
    static angleRadOfLine(x1, y1, x2, y2) {
        // Finds the angle of the line formed between two points. RADIANES
        return Math.atan2(y2-y1, x2-x1);
    }

    static angleDegOfLinePts(p1, p2) {
        // Finds the angle of the line formed between two points. RADIANES
        //console.log("(static angleDegOfLinePts)!")
        return GeomUtils.atan2D(p2.y-p1.y, p2.x-p1.x);
    }

    static angleRadOfLinePts(p1, p2) {
        // Finds the angle of the line formed between two points. RADIANES
        //console.log("(static angleRadOfLinePts)!")
        return Math.atan2(p2.y-p1.y, p2.x-p1.x);
    }

    static fixAngle(angle) {
        // Takes an angle in degrees and returns the equivalent standardized angle between 0 and 360 degrees.
        return ((angle %= 360)<0) ? angle+360 : angle;
    }

    static degreesToRadians(angle) {
        // Changes degrees to radians.
        return angle*(Math.PI/180);
    }

    static radiansToDegrees(angle) {
        // Changes radians to degrees.
        return angle*(180/Math.PI);
    }

    static randRangeFloat(low, high) {
        // Returns a random floating-point number between two numbers.
        return Math.random()*(high-low)+low;
    }

    static randRangeInt(low, high) {
        // Returns a random integer between two numbers.
        return Math.floor(Math.random()*(high-low+1)+low);
    }
}
export default GeomUtils