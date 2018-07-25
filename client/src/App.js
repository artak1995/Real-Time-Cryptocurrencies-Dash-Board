import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://localhost:8000/"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ response: data }));
    console.log(this.state);
  }

  render() {
    const { response } = this.state;
    return (
      <div style={{padding: 20}}>
        <h1>Cryptocurrency Real Time</h1>
        {response
          ? <div>
            <h2>Bitcon</h2>
            {/* {response.ticker.price ? */}
            <h4 style={{color: '#F5AE4B'}}> Price: {response.ticker.price}  </h4>
            <h6>Volume: {response.ticker.volume}</h6>
            <h6 style={response.ticker.change < 0? {color: '#D75054'} :{color: '#22776D'}}>{response.ticker.change}</h6>
            {/* :
            <h6 style={{color: '#F5AE4B'}}> Price: Loading </h6> */}
            {/* } */}
            
            </div>
          : <p>Loading...</p>}
      </div>
    );
  }
}

export default App;