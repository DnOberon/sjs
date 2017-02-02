import React, { Component } from 'react';
import './App.css';
import 'whatwg-fetch';

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
                })


            }).catch((ex) => {
                console.log('parsing failed', ex)
                this.setState({"hasError": true, "errorMessage":ex, "selectedQuote": "I sat close to the microwave as a kid. Sometimes I got headaches."})
            })
    }

    changeQuote() {
        let newQuote = this.state.quotes[Math.floor(Math.random() * this.state.quotes.length)].text

        while(newQuote === this.state.selectedQuote) {
            newQuote = this.state.quotes[Math.floor(Math.random() * this.state.quotes.length)].text
        }

        this.setState({
            "selectedQuote" : newQuote
        })
    }

     render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>{this.state.selectedQuote}</h2>
                    <div><button className="button" type="button" onClick={this.changeQuote}>New</button></div>
                </div>
            </div>
        );
    }
}

export default App;
