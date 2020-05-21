import React from "react";
import { randomNumberInRange, getRandomValueFromArray } from "../util";
import * as THREE from "three";

const COLOR_PALETTE = [0xffdef3, 0xff61be, 0x3b55ce, 0x35212a];

class Visualizer extends React.Component {
  componentDidMount() {
    this.W = window.innerWidth
    this.H = window.innerHeight

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xDD709B);

    this.camera = new THREE.PerspectiveCamera( 75, this.W/this.H, 0.1, 1000 );
    this.camera.position.x = 0
    this.camera.position.y = 50
    this.camera.position.z = 30
    this.camera.lookAt(this.scene.position)
    
    this.spotLight = new THREE.SpotLight( 0xffffff,0.8)
    this.spotLight.position.set(100,140,130)
    this.spotLight.castShadow = true
    this.spotLightReverse = new THREE.SpotLight( 0x534da7,0.2)
    this.spotLightReverse.position.set(-100,140,-130)
    this.spotLightReverse.castShadow = true
    this.scene.add(this.spotLight)
    this.scene.add(this.spotLightReverse)
    
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( this.W, this.H );
    this.renderer.shadowMap.enabled = true;

    this.mount.appendChild( this.renderer.domElement );

    this.bars = [];
    for(var i = 0; i < 1600; i++) {
        const height = randomNumberInRange(1, 10)
        const size = 3
		const geometry = new THREE.BoxGeometry(size, height, size)
        const material = new THREE.MeshPhongMaterial({
            color: getRandomValueFromArray(COLOR_PALETTE),
            emissive: getRandomValueFromArray(COLOR_PALETTE),
            shininess: 100,
            specular: 0xfff
        })
		const mesh = new THREE.Mesh(geometry, material)
		mesh.position.x = ((i % 40) * size) - 60
		mesh.position.y = -5
		mesh.position.z = ((i / 40) * size) - 50
        mesh.castShadow = true
        this.bars.push(mesh);
		this.scene.add(mesh)
    }

    window.addEventListener('resize', () => { this.onResize() });
    this.setupAudio()
  }

  setupAudio = () => {
    const audioCtx = new AudioContext()
    const analyser = audioCtx.createAnalyser()
    this.frequencyData = new Uint8Array(analyser.frequencyBinCount)    
    const audio = new Audio()
    audio.crossOrigin = "anonymous";
    audio.controls = false
    audio.src = "https://thomasvanglabeke.github.io/SoundCity/assets/holy.mp3"
    this.mount.appendChild(audio)
    audio.addEventListener('canplay', function() {
        const audioSource = audioCtx.createMediaElementSource(audio)
        audioSource.connect(analyser)
        analyser.connect(audioCtx.destination)
        this.analyser = analyser;
        audio.play()
        this.update();
    }.bind(this))
  }

  update = () => {
    requestAnimationFrame(this.update);
    this.analyser.getByteFrequencyData(this.frequencyData)
    const length = this.bars.length;

    this.bars.forEach((bar, index) => {
        const percentIdx = index / length
        const frequencyIdx = Math.floor(length * percentIdx)
        bar.scale.y = 1 + 15 * (this.frequencyData[frequencyIdx] / this.frequencyData.length)
    })

    this.renderer.render( this.scene, this.camera );
  }

  onResize() {
    this.W = window.innerWidth
    this.H = window.innerHeight

    this.camera.aspect = this.W / this.H

    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.W, this.H)
  }

  render() {
    return (
      <div ref={ref => (this.mount = ref)} />
    )
  }
}

export default Visualizer;