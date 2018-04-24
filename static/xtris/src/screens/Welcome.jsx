import React, { Component } from 'react';

import {Route, Link} from 'react-router-dom'


class Welcome extends Component {
    render() {
        /*return (
            <div className="screen center">
            <h1>HAPPY NEW YEAR!</h1>
            <p style={{margin: "auto"}} className="limit-width">I wish you an amazing <strong>2018</strong>. And to celebrate the beginning of another circle around the sun, here's a little game.</p>
            <p><Link to="/play" className="button">Play</Link></p>
            </div>
            );*/
        
            return (
                <div className="screen center">
                    <h1>GELUKKIG NIEUWJAAR!</h1>
                    <p style={{margin: "auto"}} className="limit-width">Ik wens je een fantastisch <strong>2018</strong>. En om het begin van nog een ritje rond de zon te vieren, geef ik je dit spelletje. </p>
                    <p><Link to="/play" className="button">Speel</Link></p>
                </div>
                );
            }
        }

        export default Welcome;
