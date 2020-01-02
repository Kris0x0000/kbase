import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import Login from './components/login/login'
import Issue from './components/issue/issue'
import IssueCreate from './components/issue/issue_create'
import IssueDisplay from './components/issue/issue_display'
import Home from './components/home/home'
import HomeIcon from '@material-ui/icons/Home';
import { IconButton } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirection_path: ''
    };
  }



render() {
  return(
  <div>
  {this.redirect()}
  <IconButton onClick={()=>this.setRedirection("home")}>
     <HomeIcon/>
  </IconButton>
  <Header />
  <Main />
  </div>
  );
}


  redirect() {
    if(this.state.redirection_path !== '') {
      if(this.state.redirection_path === 'home') {
        return <Redirect to={{ pathname: "/home" }} />;
      }

    }
  }

  setRedirection(path) {
    this.setState({redirection_path: path});
}


}



class Header extends React.Component {
  render() {

    return <div id="header"><h1>Baza Wiedzy</h1></div>;
  }
}


class Main extends React.Component {
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
