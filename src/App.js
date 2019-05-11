import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { withAuthenticator } from 'aws-amplify-react';
import Amplify, { Auth, API, Storage } from 'aws-amplify';
import awsmobile from './aws-exports';

Amplify.configure(awsmobile);

// Todo: use dynamodb and s3

class App extends Component{
  state = {
    coolList: [],
    text: null,
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

  add_to_s3 = (file) => {
    console.log(file);
    // how the fuck do I put the content inside?
    Storage.put('folder_one/' + file.name, file)
      .then(result => console.log(result))
      .catch(result => console.log(result));
  }

  get_dynamodb = async () => {
    //put some shit to dynamodb
    console.log('calling get');
    const response = await API.get('dynamodbAPI', '/items/object/1');
    alert(JSON.stringify(response, null, 2));
  }

  put_dynamodb = async (text) => {
    //put some shit to dynamodb
    console.log('calling put');
    const response = await API.post('dynamodbAPI', '/items', {
      body: {
        id: '1',
        name: text
      }
    });
    alert(JSON.stringify(response, null, 2));
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

        {/* s3 code */}
        <input type="file" onChange={e => {
          // if file is uploaded, then get the
          // file data, pass to add_to_s3 function


          // this is actually bad practice lol!!!
          // use states for best practices
          this.add_to_s3(e.target.files[0]);
        }}/>


        {/* dynamodb code */}
        <input type="text" onKeyPress={e => {
          if(e.key === 'Enter'){
            console.log(e.target.value);
            // this.setState({text: e.target.value});
            // pass the reference to dynamodb here
            console.log('enter is pressed!!!');
            this.put_dynamodb(e.target.value);
          }
        }}/>

        <button onClick={this.get_dynamodb}>GET FROM DDB</button>
        
        </header>

      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true })
