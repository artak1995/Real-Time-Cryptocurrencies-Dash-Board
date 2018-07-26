import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import './App.css';

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
      <div className='App'>
        <h1>Cryptocurrency Realtime Price</h1>
        {response
          ? 
          <div className='grid-container'>
            <div className='crypto-grid'>
              <h2>Bitcon</h2>
              <h4 style={{color: '#F5AE4B'}}> ${response.btc.price}  </h4>
              <div className='half'>volume:<br /> {response.btc.volume}</div>
              <div className='half'>change:<br /> <span style={response.btc.change < 0? {color: '#D75054'} :{color: '#22776D'}}>{response.btc.change}</span></div>  
            </div>
            <div className='crypto-grid'>
              <h2>Ether</h2>
              <h4 style={{color: '#F5AE4B'}}> ${response.eth.price}  </h4>
              <div className='half'>volume:<br /> {response.eth.volume}</div>
              <div className='half'>change:<br /> <span style={response.eth.change < 0? {color: '#D75054'} :{color: '#22776D'}}>{response.eth.change}</span></div>  
            </div>
            <div className='crypto-grid'>
              <h2>Lisk</h2>
              <h4 style={{color: '#F5AE4B'}}> ${response.ltc.price}  </h4>
              <div className='half'>volume:<br /> {response.ltc.volume}</div>
              <div className='half'>change:<br /> <span style={response.ltc.change < 0? {color: '#D75054'} :{color: '#22776D'}}>{response.ltc.change}</span></div>  
            </div>
          </div>
          : <p>Loading...</p>}
      </div>
    );
  }
}

export default App;