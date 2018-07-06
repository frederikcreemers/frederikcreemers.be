import React, { Component } from 'react';

import { Swipeable } from 'react-touch';

import GameRunner from "./GameRunner.js"

let Noop = (props) => props.children

class GameCanvas extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            showButtons: false
        }
    }
    render() {
        let style = {
            display: "block",
            margin: "auto",
            maxHeight: "95vh"
        }
        
        return (
            <Swipeable
                onSwipeLeft={() => this.gr.moveLeft()}
                onSwipeRight={() => this.gr.moveRight()}
                onSwipeDown={() => this.gr.dropDown()}>
            <div>
                <canvas id="screen" style={style} width="520" height="800">
                </canvas>
                {this.getTouchButtons()}
            </div>
            </Swipeable>
        );
    }
    
    getTouchButtons(){
        let contents = "Toon knoppen voor besturing met aanraakscherm.";
        let extraStyles = {
            color: "yellow",
            backgroundColor: "rgba(66, 134, 244, 0.5)",
            fontSize: "1.2em"
        }
        window.React = React;
        if(this.state.showButtons) {
            extraStyles = {}
            contents = <React.Fragment>
                
                    <div style={{float: "left"}}>
                        <span onClick={() => this.gr.moveLeft()}>⬅️</span><br/>
                        <span onClick={() => this.gr.dropDown()}>⏬</span>
                    </div>
                    <div style={{float: "right"}}>
                        <span onClick={() => this.gr.moveRight()}>➡️</span><br/>
                        <span onClick={() => this.gr.rotateRight()}>↩️</span>
                    </div>
                </React.Fragment>
        }
        return <div style={{position:"fixed", bottom:0, left:0, right:0, fontSize: "3em", textAlign: "center", ...extraStyles}} onClick={() => !this.state.showButtons && this.setState({showButtons: true})}>
            {contents}
        </div>
    }
    
    componentDidMount(){
        let can = document.getElementById("screen");
        console.log("canvas: "+can);
        this.gr = new GameRunner(can)
        this.gr.run();
    }
}

export default GameCanvas;
