
import './style.css';
import gsap from "gsap"
//import ScrollTrigger from 'gsap/ScrollTrigger';
import "fpsmeter"

import WebGLApp from './webgl/WebGLApp/WebGLApp';

//gsap.registerPlugin(ScrollTrigger);

/*
ScrollTrigger.create({
    markers:true,
    trigger: "#content",
    start: "top top",
    end: "bottom top",
    onUpdate: (e) => {
        //console.log(e)
    }
})
*/

const app = new WebGLApp({
    $container: document.querySelector('#webgl_app'),
    pathPrefix:"./",
    data: __get_init_data()
})
const meter = new FPSMeter()

//-----------------------------------

init()


//-----------------------------------

function init(){
    window.addEventListener('resize', ()=>{
        app.resize(__get_resize_data())
    })
    //--
    update_RAF()
    app.init()
}
function update_RAF(){
    //console.log("*");
    meter.tick()
    window.requestAnimationFrame( () =>{
        update_RAF()
    })
}


function __get_init_data(){
    const obj = {
        mobileMode:__get_mobileMode(),
    }
    return obj
}

function __get_resize_data(){
    const obj = {
        mobileMode:__get_mobileMode(),
    }
    return obj
}

function __get_mobileMode(){
    const width = document.querySelector('#webgl_app').offsetWidth
    const breakpoint = 750
    let mobileMode = false
    if(width <= breakpoint){
        mobileMode = true
    }
    return mobileMode
}