import React from 'react';
import ReactDom from 'react-dom';
import { gsap, TimelineLite } from 'gsap/all';
import './navbar.css';

function Animation() {
    const navBody = document.getElementById("navBody");
    let animation = new TimelineLite({onComplete: () => {
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
        // .to(navBody, 0, {rotationZ: 180, rotationY: 180})
        // .to(navBody, 0.2, {rotationX: 90, onComplete: () => ReactDom.render(element, navBody)})
        // .to(navBody, 0.2, {rotationX: 180})
        .play();
}

const home = <div className="NavBody bgGreen"> Home </div>;
const page2 = <div className="NavBody bgRed"></div>;
const page3 = <div className="NavBody bgBlue"></div>;
const page4 = <div className="NavBody bgPurple"></div>;
const page5 = <div className="NavBody bgOrange"></div>;

class Navbar extends React.Component {
    render() {
      return (
        <div className="navbar">
            <NavButton body={home}> Home </NavButton>
            <NavButton body={page2}> Red </NavButton>
            <NavButton body={page3}> Blue </NavButton>
            <NavButton body={page4}> Purple </NavButton>
            <NavButton body={page5}> Orange </NavButton>
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
            <span className={"NavButton"} onClick={e => renderBody(this.props.body)}>
                {this.props.children}
            </span>
        )
    }
}

export default Navbar;