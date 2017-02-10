import React, { Component } from 'react';
import { hashHistory } from 'react-router';

import './App.css';
import 'whatwg-fetch';
import 'bulma';
import gopher from './jasongopher.png';

// accepts an array of quote objects and a single quote object
// TODO you're better than this, fix it!
function seenQuoteCheck(array, value) {
    let check = array.filter((n) => n.text === value.text)

    if(check.length > 0) {
        return true
    }
    return false
}

// takes a string and cuts it down to 100 characters
// w.out overflowing =P
function tweet(value) {
    if (value.length < 100){
        return "https://twitter.com/intent/tweet?text="+encodeURIComponent(value)+"&url=http%3A%2F%2Fshitjasonsays.com%2F%23%2F"
    }

    return "https://twitter.com/intent/tweet?text="+encodeURIComponent(value.slice(0, 100))+"&url=http%3A%2F%2Fshitjasonsays.com%2F%23%2F"
}

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
                                       "quotes": quotes,
                                       "seenQuotes":[],
                                       "tweet": tweet(randQuote.text)
                                   })

                                   // change to quote matching param if exists
                                   if(typeof(this.props.params.id) !== "undefined") {
                                       let quote = quotes.filter((n) => this.props.params.id.toString() === n.id.toString() )
                                       this.setState({
                                           "selectedQuote": quote[0],
                                           "tweet": tweet(quote[0].text)
                                       })
                                   }

                                   hashHistory.push("/" + this.state.selectedQuote.id)

                               }).catch((ex) => {
                                   console.log('parsing failed', ex)
                                   this.setState({"hasError": true,
                                                  "errorMessage":ex,
                                                  "selectedQuote": {"text":"I sat close to the microwave as a kid. Sometimes I got headaches."},
                                                  "tweet": "I sat close to the microwave as a kid. Sometimes I got headaches."
                                   })
                               })
    }

    componentDidUpdate(){
        if(typeof(this.props.params.id) === "undefined")  {return}

        if(this.props.params.id.toString() !== this.state.selectedQuote.id.toString() && this.props.params.id !== 0){
            // change to quote matching param if exists
            if(typeof(this.props.params.id) !== "undefined") {
                let quotes = this.state.quotes
                let quote = quotes.filter((n) => this.props.params.id.toString() === n.id.toString() )
                this.setState({
                    "selectedQuote": quote[0],
                    "tweet": tweet(quote[0].text)
                })
            }
        }
    }

    changeQuote() {
        let newQuote = this.state.quotes[Math.floor(Math.random() * this.state.quotes.length)]
        let seen = this.state.seenQuotes

        // reset seen quotes if we've seen all of them
        if (seen.length === this.state.quotes.length - 1){
            seen = []
        }

        while(newQuote.text === this.state.selectedQuote.text || seenQuoteCheck(seen, newQuote) === true ) {
            newQuote = this.state.quotes[Math.floor(Math.random() * this.state.quotes.length)]
        }

        seen.push(newQuote)

        this.setState({
            "selectedQuote" : newQuote,
            "seenQuotes": seen,
            "tweet": tweet(newQuote.text)
        })

        hashHistory.push("/" + newQuote.id)
    }

    render() {
        return (
            <section className="hero is-primary is-fullheight">
                <div className="container is-fluid">
                    <div className="columns hero-body is-multiline">
                        <div className="column is-offset-1 is-12-mobile ">
                            <h1 className="title">
                                {this.state.selectedQuote.text}
                            </h1>
                            <h2 className="subtitle">
                                added by @{this.state.selectedQuote.author}
                            </h2>
                            <div>
                                <a className="button  is-primary is-inverted is-outlined "  onClick={this.changeQuote}>More shit</a>
                                <a className="button is-primary" href={" " + this.state.tweet + this.state.selectedQuote.id} target="_blank">
                                    <span className="icon">
                                        <i className="fa fa-twitter"></i>
                                    </span>
                                    <span>Twitter</span>
                                </a>
                            </div>
                        </div>
                        <div className="column ">
                            <figure className="image is-square">
                                <img src={gopher}  alt="gopher"/>
                            </figure>
                        </div>
                    </div>
                </div>

                <footer className="footer" style={{background: "#00d1b2"}}>
                    <div className="container">
                        <div className="content" style={{color: "white"}}>
                            <p>
                                <a className="icon" href="https://github.com/DnOberon/sjs">
                                    <i className="fa fa-github"></i>
                                </a>
                                <strong><a href="https://github.com/DnOberon/sjs">Shit Jason Says</a></strong> by John D.

                            </p>
                        </div>
                    </div>
                </footer>
            </section>
        );
    }
}

export default App;
