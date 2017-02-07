import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router';
import App from './App.js';

class Nav extends Component {

    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={App}/>
                <Route path="/:id" component={App}/>
            </Router>
        );
    }

}

export default Nav;
