import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './components/login/login'
import Issue from './components/issue/issue'
import IssueCreate from './components/issue/issue_create'
import IssueDisplay from './components/issue/issue_display'
import Home from './components/home/home'



class App extends React.Component {

render() {
  return(
    <Router>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/issue/find' component={Issue}/>
          <Route exact path='/issue/create' component={IssueCreate}/>
          <Route exact path='/issue/display/:id' component={IssueDisplay}/>
          <Route path='/issue/edit/:id' component={IssueCreate}/>
          <Route exact path='/home' component={Home}/>
        </Switch>
    </Router>
  );
}

}

export default App;
