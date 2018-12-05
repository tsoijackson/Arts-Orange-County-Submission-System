import React, { Component } from 'react';
import {Link,Route,Switch} from 'react-router-dom';
import RegisterForm from './registerForm.js';
import ChangeForm from './changeForm.js';
import PrintForm from './components/printForm/printForm.js';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/register" component={RegisterForm}/>
        <Route path="/modify/:unique_url" component={ChangeForm}/>
        <Route path="/print/:user_email" component={ PrintForm }/>
      </div>
    );
  }
}
export default App;
