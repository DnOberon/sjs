import React, { Component } from 'react';
import { hashHistory } from 'react-router';

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
                                       "selectedQuote": randQuote,
                                       "quotes": quotes
                                   })

                                   // change to quote matching param if exists
                                   if(typeof(this.props.params.id) !== "undefined") {
                                       let quote = quotes.filter((n) => this.props.params.id.toString() === n.id.toString() )
                                       this.setState({
                                           "selectedQuote": quote[0]
                                       })
                                   }

                                   hashHistory.push("/" + this.state.selectedQuote.id)

                               }).catch((ex) => {
                                   console.log('parsing failed', ex)
                                   this.setState({"hasError": true,
                                                  "errorMessage":ex,
                                                  "selectedQuote": {"text":"I sat close to the microwave as a kid. Sometimes I got headaches."},
                                   })
                               })
    }

    changeQuote() {
        let newQuote = this.state.quotes[Math.floor(Math.random() * this.state.quotes.length)]

        while(newQuote.text === this.state.selectedQuote.text) {
            newQuote = this.state.quotes[Math.floor(Math.random() * this.state.quotes.length)]
        }

        this.setState({
            "selectedQuote" : newQuote,
        })

        hashHistory.push("/" + newQuote.id)
    }

    render() {
        return (
            <section className="hero is-primary is-fullheight">
                <div>
                    <div className="container">
                        <div className="columns hero-body">
                            <div className="column">
                                <h1 className="title">
                                    {this.state.selectedQuote.text}
                                </h1>
                                <h2 className="subtitle">
                                    added by @{this.state.selectedQuote.author}
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
            </section>
        );
    }
}

export default App;
