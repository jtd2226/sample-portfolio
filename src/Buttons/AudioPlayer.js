import {Audio, AudioLoader, AudioAnalyser, AudioListener} from "three";

class AudioPlayer {
    constructor(props) {
        this.props = props;

        // This is how you create an html element in javascript
        this.button = document.createElement("button"); //<button></button>
        this.button.innerHTML = "Play"; // <button> Play </button>
        this.button.style = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        `;
        
        this.addEventListeners();
    }

    getFrequencyData = () => {
        return this.audioAnalyser.getFrequencyData();
    }

    addEventListeners = () => {
        this.button.addEventListener("click", this.handleClick);
        if(this.props.audioFinishedPlaying) this.audio.addEventListener('ended', this.props.audioFinishedPlaying);
    }

    removeEventListeners = () => {
        this.button.removeEventListener("click", this.handleClick);
        if(this.props.audioFinishedPlaying) this.audio.removeEventListener('ended', this.props.audioFinishedPlaying);
    }

    handleClick = () => {
        const listener = new AudioListener();
        const audio = new Audio(listener); // <audio></audio>
        this.props.camera.add(listener);
    
        const loader = new AudioLoader();
        loader.load(this.props.song, function(buffer) {
            audio.setBuffer(buffer)
            audio.play()
            this.props.onAudioPlay()
        }.bind(this));
    
        this.audioAnalyser = new AudioAnalyser(audio, this.props.frequencyCount || 2048);
    }
}

export default AudioPlayer;