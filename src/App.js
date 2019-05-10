import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { withAuthenticator } from 'aws-amplify-react';
import Amplify, { Auth, API } from 'aws-amplify';
import awsmobile from './aws-exports';

Amplify.configure(awsmobile);

/*

okay, this is the power of aws amplify: being able to connect serverless
aws resource to the front end with ease. Before I need to create the backend
and connect it manually to the front end. With this, I can create and integrate the backend
to the react application easily. Not only that, I also get to use component from aws amplify react
so I can directly access the resource of my aws account

*/

class App extends Component{
  state = {
    coolList: [],
  }

  async componentDidMount() {
    const user = await Auth.currentAuthenticatedUser()

    // sub: user id
    // aud: identity pool id
    console.log('user info:', user.signInUserSession.idToken.payload)
    console.log('username:', user.username)


    try {
      // I still don't understand what the fuck is the first
      // params of API.get should be though
      const data = await API.get('testAPI', '/getsomething')
      console.log('data from Lambda REST API: ', data)
      this.setState({ coolList: data.coolList })
    } catch (err) {
      console.log('error fetching data..', err)
    }
  }

  render(){
    let coolList = null;

    if(this.state.coolList){
      coolList = (
        <div>
          {this.state.coolList.map((one_item) => {
            return <p>{one_item}</p>
          })}
        </div>
      )
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
  
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true })
