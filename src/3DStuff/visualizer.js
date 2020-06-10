import React from "react";
import { randomNumberInRange, getRandomValueFromArray } from "../util";
import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import spark from '../img/spark.png'
import { instanceFragmentShader, instanceVertexShader } from './shaders'
import Stats from 'three/examples/jsm/libs/stats.module'
import AudioPlayer from "../Buttons/AudioPlayer";

const COLOR_PALETTE = [0x04d435, 0x000d08, 0x300001, 0xff7200];

const UNIFORMS = {
  time: {value: 1.0}
}

class Visualizer extends React.Component {
  componentDidMount() {
    this.W = window.innerWidth
    this.H = window.innerHeight

    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0x300001)

    this.clock = new THREE.Clock(true);

    this.camera = new THREE.PerspectiveCamera(95, this.W/this.H, 0.1, 1000);
    this.camera.position.set(0, 0, 10)
    this.camera.lookAt(this.scene.position)
    
    this.bars = []
    this.freqMap = {}
    this.stars = new THREE.Object3D();
    // this.spitBars();
    this.addInstanceGeometry(this.scene);
    this.addStars(this.scene);
    // this.addLights(this.scene);
    // this.scene.add(new THREE.AmbientLight(0xffffff));
    this.setupAudio()
    
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.W, this.H);
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.stats = new Stats();
    this.addEffects(this.scene, this.camera, this.renderer)
    this.mount.appendChild(this.renderer.domElement);
    this.mount.appendChild(this.stats.dom)
    window.addEventListener('resize', () => { this.onResize() });
    this.renderer.render(this.scene, this.camera);
  }

  update = (timestamp) => {
    requestAnimationFrame(this.update);

    const delta = this.clock.getDelta()
    this.stars.rotation.x += 0.0020;
    this.stars.rotation.y -= 0.0020;

    this.doFrequencyUpdates();
    
    this.instanceMesh.rotation.y += (this.lastBass || 0.002)
    UNIFORMS.time.value += delta

    this.renderer.render(this.scene, this.camera);
    this.stats.update();
    if(this.effectsComposer) this.effectsComposer.render(this.scene, this.camera);
  }

  doFrequencyUpdates = () => {
    if(!this.audioPlayer) return;
    const frequencyData = this.audioPlayer.getFrequencyData();
          
    this.instanceMesh.geometry.setAttribute('frequency', new THREE.InstancedBufferAttribute(frequencyData, 1));
    this.instanceMesh.geometry.attributes.frequency.needsUpdate = true;
    
    const length = this.bars.length;
    this.bars.forEach((bar, index) => {
      const percentIdx = index / length
      const frequencyIdx = Math.floor(length * percentIdx)
      bar.scale.z = 1 + 10 * (frequencyData[frequencyIdx] / frequencyData.length)
    })

    this.stars.children.forEach((child, index) => {
      const percentIdx = index / this.stars.children.length
      const frequencyIdx = Math.floor(this.stars.children.length * percentIdx)
      const scaleMultiplier = 1 + 100 * (frequencyData[frequencyIdx] / frequencyData.length)
      child.scale.x = scaleMultiplier
      child.scale.y = scaleMultiplier
      child.scale.z = scaleMultiplier
    })

    const elapsedTime = this.clock.getElapsedTime()
    if(elapsedTime - (this.lastTimeStamp || 0) > 0.2) {
      const freq = frequencyData[0] / 3000
      this.lastBass = (this.freqMap[freq] || 1) * freq
      this.freqMap[freq] = (this.freqMap[freq] || 1) * -1  
      this.lastTimeStamp = elapsedTime
    }
  }
  
  addStars = (scene) => {
    const textureLoader = new THREE.TextureLoader()
    const particleTexture = textureLoader.load(spark);
  
    for (var i = 0; i < 200; i++) {
      const material = new THREE.SpriteMaterial({ 
        map: particleTexture,
        color: 0xffffff,
        blending: THREE.AdditiveBlending
      });
      const sprite = new THREE.Sprite(material);

      sprite.scale.set(32, 32, 32)
      sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      sprite.position.multiplyScalar(90 + (Math.random() * 100));
      sprite.material.color.set(new THREE.Color(getRandomValueFromArray(COLOR_PALETTE)))
      this.stars.add(sprite)
    }

    scene.add(this.stars)
  }

  spitBars = () => {
    this.bars = [];
    const height = randomNumberInRange(10, 15)
    const size = 5
    const geometry = new THREE.BoxBufferGeometry(size, size, height);
    for(var i = 0; i < 100; i++) {
      const color = getRandomValueFromArray(COLOR_PALETTE)
      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 50,
        shininess: 200,
        transparent: true,
        opacity: 0.7
      })
      const row = i % 10
      const column = i / 10
      const spacing = 2
      const offset = (10 * (size + spacing)) / 2
      
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.x = (row * (size + spacing)) - offset
      mesh.position.y = (column * (size + spacing)) - offset
      mesh.position.z = -50
      mesh.castShadow = true
      this.bars.push(mesh);
      this.scene.add(mesh)
    }
  }
  
  addInstanceGeometry = (scene) => {
    // const height = randomNumberInRange(10, 15)
    // const size = 5
    const _geometry = new THREE.BoxBufferGeometry(2, 2, 2);
    
    const geometry = new THREE.InstancedBufferGeometry();
    geometry.index = _geometry.index;
    geometry.attributes = _geometry.attributes;
    
    var particleCount = 500;
    
    var translateArray = []
    var colors = []
    
    for(let i = 0; i < particleCount; i++) {
      // const percentIdx = (i / (particleCount / 2)) - 1;
      // x = 0, y = -1 : x = 1, y = -0.8 
      translateArray.push(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      // translateArray.push(percentIdx, 0, percentIdx);
      colors.push(Math.random(), Math.random(), Math.random(), Math.random());
      // colors.push(1, 1, 1, 1);
    }
    
    geometry.setAttribute('translate', new THREE.InstancedBufferAttribute(new Float32Array(translateArray), 3));
    geometry.setAttribute('color', new THREE.InstancedBufferAttribute(new Float32Array(colors), 4));
    
    const material = new THREE.RawShaderMaterial({
      uniforms: UNIFORMS,
      vertexShader: instanceVertexShader,
      fragmentShader: instanceFragmentShader,
      // wireframe: true,
      depthTest: true,
      depthWrite: true
    });
    
    this.instanceMesh = new THREE.Mesh(geometry, material);
    this.instanceMesh.position.z = -900
    this.instanceMesh.scale.set(300, 300, 300);
    scene.add(this.instanceMesh);
  }
  
  addLights = (scene) => {
    const light = new THREE.DirectionalLight(0xffffff);
    light.intensity = 50
    light.position.set(0, -30, 10);
    light.lookAt(scene.position)
    
    const pointLight = new THREE.PointLight(0xffffff)
    pointLight.intensity = 50
    pointLight.position.set(scene.position)
    scene.add(light);
    // scene.add(pointLight)
  }
  
  addEffects = (scene, camera, renderer) => {
    const params = {
      exposure: 0.9,
      strength: 1,
      threshold: 0,
      radius: 0
    };
    
    const renderPass = new RenderPass(scene, camera);
    
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    Object.assign(bloomPass, params)

    this.GlitchPass = new GlitchPass()
    
    this.effectsComposer = new EffectComposer(renderer);
    this.effectsComposer.addPass(renderPass);
    this.effectsComposer.addPass(bloomPass);
    this.effectsComposer.addPass(this.GlitchPass)
    renderer.toneMappingExposure = Math.pow( params.exposure, 4.0 );
  }

  setupAudio = () => {
    this.audioPlayer = new AudioPlayer({
      camera: this.camera,
      song: this.props.song,
      onAudioPlay: this.onAudioPlay,
      frequencyCount: 1024
    })
    this.mount.appendChild(this.audioPlayer.button);
  }

  onAudioPlay = () => {
    this.mount.removeChild(this.audioPlayer.button);
    this.update()
  }

  onResize = () => {
    this.W = window.innerWidth
    this.H = window.innerHeight

    this.camera.aspect = this.W / this.H

    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.W, this.H)
    if(this.effectsComposer) this.effectsComposer.setSize(this.W, this.H)
  }

  render() {
    return <div ref={ref => (this.mount = ref)} />
  }
}
  
export default Visualizer;