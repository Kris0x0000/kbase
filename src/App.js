import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import Login from './components/login/login'
import Issue from './components/issue/issue'
import IssueCreate from './components/issue/issue_create'



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




class Main extends React.Component {
  render() {
  return(

  <Router>
      <Switch>
        <Route exact path='/' component={Login}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/issue/list' component={Issue}/>
        <Route exact path='/issue/create' component={IssueCreate}/>
        <Route path='/issue/edit/:id' component={IssueCreate}/>
      </Switch>
  </Router>

  );
}

}


export default App;
