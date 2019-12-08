import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import Login from './components/login/login'
import Issues from './components/issues/issues'



function App() {
  return (
    <div>
    <Link to="/issues">Props!!!</Link>
    <Header />
    <Main />
    </div>
  );
}


class Header extends React.Component {
  render() {
    return <h1>header!m</h1>;
  }
}

function Users() {
  return <h2>Users</h2>;
}


class Main extends React.Component {
  render() {
  return(

  <Router>
      <Switch>
        <Route exact path='/' component={Login}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/issues' component={Issues}/>
      </Switch>
  </Router>

  );
}

}


export default App;
