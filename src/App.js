import React, { Component } from 'react';

import './App.css';
import 'whatwg-fetch';
import 'bulma';
import gopher from './jasongopher.png';

class App extends Component {

    constructor(props) {
        super(props)
        // init with default quote
        this.state = {selectedQuote: ""}
        this.changeQuote = this.changeQuote.bind(this)

        // fetch and set the quotes array to state
        fetch('/quotes.json')
                               .then((response) => {
                                   return response.json()
                               }).then((json) => {
                                   let quotes = json.quotes
                                   let randQuote = quotes[Math.floor(Math.random() * quotes.length)];

                                   this.setState({
                                       "selectedQuote": randQuote.text,
                                       "quotes": quotes,
                                       "author": randQuote.author
                                   })


                               }).catch((ex) => {
                                   console.log('parsing failed', ex)
                                   this.setState({"hasError": true,
                                                  "errorMessage":ex,
                                                  "selectedQuote": "I sat close to the microwave as a kid. Sometimes I got headaches.",
                                                  "author": "johnthewayne"
                                   })
                               })
    }

    changeQuote() {
        let newQuote = this.state.quotes[Math.floor(Math.random() * this.state.quotes.length)]

        while(newQuote.text === this.state.selectedQuote) {
            newQuote = this.state.quotes[Math.floor(Math.random() * this.state.quotes.length)]
        }

        this.setState({
            "selectedQuote" : newQuote.text,
            "author": newQuote.author
        })
    }

    render() {
        return (

            <section className="hero is-primary is-fullheight">
                                <div className="">
                    <div className="container">
                        <div className="columns hero-body">
                            <div className="column">
                                <h1 className="title">
                                    {this.state.selectedQuote}
                                </h1>
                                <h2 className="subtitle">
                                    added by @{this.state.author}
                                </h2>
                                <div><a className="button  is-primary is-inverted is-outlined"  onClick={this.changeQuote}>New</a></div>
                            </div>
                            <div className="column">
                                <figure className="image is-square">
                                    <img src={gopher}  alt="gopher"/>
                                </figure>
                            </div>
                        </div>
                    </div>
                                </div>


                                <div className="hero-foot">
                                    <header className="nav">
                                        <div className="container">
                                            <div className="nav-left">
                                                <a className="nav-item">
                                                    Shit Jason Says
                                                </a>
                                            </div>
                                            <span className="nav-toggle">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </span>
                                            <div className="nav-right nav-menu">
                                                <span className="nav-item">
                                                    <a className="button is-primary is-outlined is-inverted" href="https://github.com/DnOberon/sjs" target="_blank">
                                                        <span className="icon">
                                                            <i className="fa fa-github"></i>
                                                        </span>
                                                        <span>Now with more open source!</span>
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                    </header>
                                </div>

            </section>
        );
    }
}

export default App;
