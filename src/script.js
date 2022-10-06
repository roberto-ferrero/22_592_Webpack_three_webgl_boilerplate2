
import './style.css';
import gsap from "gsap"
import ScrollTrigger from 'gsap/ScrollTrigger';
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
    pathPrefix:"./"
})

gsap.delayedCall(1, ()=>{
    app.init()
})

const meter = new FPSMeter()
function RAF_update(){
    //console.log("*");
    meter.tick()
    window.requestAnimationFrame( () =>{
        RAF_update()
    })
}
RAF_update()
