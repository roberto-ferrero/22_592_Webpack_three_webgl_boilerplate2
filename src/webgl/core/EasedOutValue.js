class EasedOutValue{
    constructor (_value, _factor, _threshold, _updateEmitter, _eventName){
        //console.log("(EasedOutValue.CONSTRUCTORA): "+_value)
        this.value = _value
        this.factor = _factor
        this.threshold = _threshold || 0.05
        this.updateEmitter = _updateEmitter // Instancia de EventEmitter
        //--
        //--
        this.active = false
        this.value_wanted = this.value
        this.factor_overrided = this.threshold
        //--
        if(this.updateEmitter){
            this.updateEmitter.on(_eventName, ()=>{
                this.update()
            })
        }
    }
    set(newValue, newFactor = this.factor){
        this.factor_overrided = newFactor
        this.active = true
        if(newFactor == 1){
            this.value = newValue
        }
        this.value_wanted = newValue
    }
    update(){
        const dif = this.value_wanted - this.value
        if(Math.abs(dif) <= this.threshold){
            //console.log("*1:"+dif )
            this.active = false
            this.factor_overrided = this.factor
            this.value = this.value_wanted
        }else{
            //console.log("*2:"+dif)
            this.active = true
            this.value = this.value+(dif*this.factor_overrided)
        }
        //console.log("this.value: "+this.value+"/"+this.value_wanted)
        return this.value
    }
    get(){
        return this.value
    }
}
export default EasedOutValue