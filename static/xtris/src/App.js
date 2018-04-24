import React, { Component } from 'react';
import logo from './logo.svg';

import Welcome from './screens/Welcome.jsx';
import SinglePlayer from './screens/SinglePlayer.jsx';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


class App extends Component {
    render() {
        let style = {  
            backgroundImage: `url('${require("./background.svg")}')`,
            backgroundSize: "cover",
            position:"fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }
        return (
            <Router>
                <div style={style}>
                    <Route exact path='/' component={Welcome} />
                    <Route exact path="/play" component={SinglePlayer} />
                </div>
            </Router>
        );
    }
}

export default App;
