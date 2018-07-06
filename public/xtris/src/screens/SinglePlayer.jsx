import React, { Component } from 'react';

import {Route, Link} from 'react-router-dom'

import GameCanvas from "../game/GameCanvas.jsx"

class SinglePlayer extends Component {
    render() {
        console.log("rendering singleplayer"); 
        return (
            <div className="screen">
                <GameCanvas />
            </div>
        );
    }
}

export default SinglePlayer;
