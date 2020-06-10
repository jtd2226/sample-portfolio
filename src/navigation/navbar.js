import React from 'react';
import ReactDom from 'react-dom';
import Visualizer from '../3DStuff/visualizer'
import { gsap, TimelineLite } from 'gsap/all';
import { Iframe } from '../App'
import './navbar.css';
import song from "../music/disclosureEWM.mp3"

function Animation() {
    const navBody = document.getElementById("navBody");
    const animation = new TimelineLite({onComplete: () => {
        animation.pause();
        animation.progress(0);
        navBody.style = "";
    }});
    return animation;
}

function renderBody(element) {
    const navBody = document.getElementById("navBody");
    if(gsap.isTweening(navBody)) return;
    let animation = Animation();
    animation
        .to(navBody, 0.3, {x: -2000, opacity: 0})
        .to(navBody, 0, {x: 2000, onComplete: () => ReactDom.render(element, navBody)})
        .to(navBody, 0.4, {x: 0, opacity: 1, ease: "elastic.out(.75, 1)"})
        .play();
}

const googleMapsUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3471.7839936992755!2d-98.55656528450163!3d29.52265478207502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x865c60a37282e1f1%3A0x37cdd47cd27f5da3!2s8511%20Rockmoor%2C%20San%20Antonio%2C%20TX%2078230!5e0!3m2!1sen!2sus!4v1587334744014!5m2!1sen!2sus";
const lateJuly = "https://www.youtube.com/embed/DR6TtBmJ-CE?autoplay=1&mute=1";

const home = <div className="NavBody bgGreen"> Home </div>;
const page4 = <div className="NavBody bgSawtooth"></div>;
const page5 = <Visualizer song={song}></Visualizer>;

class Navbar extends React.Component {
    render() {
      const location = <Iframe src={googleMapsUrl}></Iframe>
      const mia = <Iframe src={lateJuly}></Iframe>
      return (
        <div className="navbar">
            <NavButton body={home}> Home </NavButton>
            <NavButton body={location}> Location </NavButton>
            <NavButton body={mia}> Video </NavButton>
            <NavButton body={page4}> Trip </NavButton>
            <NavButton body={page5}> Ballz </NavButton>
        </div>
      );
    }

    componentDidMount() {
        renderBody(home)
    }
}

class NavButton extends React.Component {
    render() {
        return (
            <span className="NavButton" onClick={this.handleClick}>
                {this.props.children}
            </span>
        )
    }

    handleClick = event => {
        document.querySelectorAll('.NavButton.selected').forEach(x => x.classList.remove('selected'));
        event.target.classList.add('selected');
        renderBody(this.props.body);
    }
}

export default Navbar;