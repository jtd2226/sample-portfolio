(this["webpackJsonpsample-portfolio"]=this["webpackJsonpsample-portfolio"]||[]).push([[0],{19:function(e,t,n){e.exports=n(27)},24:function(e,t,n){},25:function(e,t,n){},26:function(e,t,n){},27:function(e,t,n){"use strict";n.r(t);var a=n(1),o=n.n(a),r=n(8),i=n.n(r),s=(n(24),n(2)),c=n(6),l=n(3),u=n(4),d=n(7);function h(e){return e[Math.floor(Math.random()*e.length)]}var m=n(5),p=[16768755,16736702,3888590,3481898],f=function(e){Object(u.a)(n,e);var t=Object(l.a)(n);function n(){var e;Object(s.a)(this,n);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(e=t.call.apply(t,[this].concat(o))).setupAudio=function(){var t=new(window.AudioContext||window.webkitAudioContext),n=t.createAnalyser();e.frequencyData=new Uint8Array(n.frequencyBinCount);var a=new Audio;a.crossOrigin="anonymous",a.controls=!1,a.src="https://thomasvanglabeke.github.io/SoundCity/assets/holy.mp3",e.mount.appendChild(a),a.addEventListener("canplay",function(){t.createMediaElementSource(a).connect(n),n.connect(t.destination),this.analyser=n,a.play(),this.update()}.bind(Object(d.a)(e)))},e.update=function(){requestAnimationFrame(e.update),e.analyser.getByteFrequencyData(e.frequencyData);var t=e.bars.length;e.bars.forEach((function(n,a){var o=a/t,r=Math.floor(t*o);n.scale.y=1+e.frequencyData[r]/e.frequencyData.length*15})),e.renderer.render(e.scene,e.camera)},e}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var e,t,n=this;this.W=window.innerWidth,this.H=window.innerHeight,this.scene=new m.f,this.scene.background=new m.b(14512283),this.camera=new m.e(75,this.W/this.H,.1,1e3),this.camera.position.x=0,this.camera.position.y=50,this.camera.position.z=30,this.camera.lookAt(this.scene.position),this.spotLight=new m.g(16777215,.8),this.spotLight.position.set(100,140,130),this.spotLight.castShadow=!0,this.spotLightReverse=new m.g(5459367,.2),this.spotLightReverse.position.set(-100,140,-130),this.spotLightReverse.castShadow=!0,this.scene.add(this.spotLight),this.scene.add(this.spotLightReverse),this.renderer=new m.h,this.renderer.setSize(this.W,this.H),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.shadowMap.enabled=!0,this.mount.appendChild(this.renderer.domElement),this.bars=[];for(var a=0;a<1600;a++){var o=(e=1,t=10,Math.floor(Math.random()*(t-e+1)+e)),r=new m.a(3,o,3),i=new m.d({color:h(p),emissive:h(p),shininess:100,specular:4095}),s=new m.c(r,i);s.position.x=a%40*3-60,s.position.y=-5,s.position.z=a/40*3-50,s.castShadow=!0,this.bars.push(s),this.scene.add(s)}window.addEventListener("resize",(function(){n.onResize()})),this.setupAudio()}},{key:"onResize",value:function(){this.W=window.innerWidth,this.H=window.innerHeight,this.camera.aspect=this.W/this.H,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.W,this.H)}},{key:"render",value:function(){var e=this;return o.a.createElement("div",{ref:function(t){return e.mount=t}})}}]),n}(o.a.Component),v=n(0),y=n(10);n(25);function w(e){var t=document.getElementById("navBody");y.a.isTweening(t)||function(){var e=document.getElementById("navBody"),t=new v.c({onComplete:function(){t.pause(),t.progress(0),e.style=""}});return t}().to(t,.3,{x:-2e3,opacity:0}).to(t,0,{x:2e3,onComplete:function(){return i.a.render(e,t)}}).to(t,.4,{x:0,opacity:1,ease:"elastic.out(.75, 1)"}).play()}var b=o.a.createElement("div",{className:"NavBody bgGreen"}," Home "),g=o.a.createElement("div",{className:"NavBody bgSawtooth"}),E=o.a.createElement(f,null),k=function(e){Object(u.a)(n,e);var t=Object(l.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"render",value:function(){var e=o.a.createElement(O,{src:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3471.7839936992755!2d-98.55656528450163!3d29.52265478207502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x865c60a37282e1f1%3A0x37cdd47cd27f5da3!2s8511%20Rockmoor%2C%20San%20Antonio%2C%20TX%2078230!5e0!3m2!1sen!2sus!4v1587334744014!5m2!1sen!2sus"}),t=o.a.createElement(O,{src:"https://www.youtube.com/embed/DR6TtBmJ-CE?autoplay=1&mute=1"});return o.a.createElement("div",{className:"navbar"},o.a.createElement(j,{body:b}," Home "),o.a.createElement(j,{body:e}," Location "),o.a.createElement(j,{body:t}," Video "),o.a.createElement(j,{body:g}," Trip "),o.a.createElement(j,{body:E}," Ballz "))}},{key:"componentDidMount",value:function(){w(b)}}]),n}(o.a.Component),j=function(e){Object(u.a)(n,e);var t=Object(l.a)(n);function n(){var e;Object(s.a)(this,n);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(e=t.call.apply(t,[this].concat(o))).handleClick=function(t){document.querySelectorAll(".NavButton.selected").forEach((function(e){return e.classList.remove("selected")})),t.target.classList.add("selected"),w(e.props.body)},e}return Object(c.a)(n,[{key:"render",value:function(){return o.a.createElement("span",{className:"NavButton",onClick:this.handleClick},this.props.children)}}]),n}(o.a.Component),C=k;n(26);var O=function(e){Object(u.a)(n,e);var t=Object(l.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"render",value:function(){return o.a.createElement("iframe",{title:"frame",src:this.props.src,frameBorder:"0",allow:"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0})}}]),n}(o.a.Component),B=function(){return o.a.createElement("div",{id:"app",className:"App"},o.a.createElement(C,null),o.a.createElement("div",{id:"navBody"}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(B,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[19,1,2]]]);
//# sourceMappingURL=main.18e628cd.chunk.js.map