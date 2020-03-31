import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as getConf from '../../../src/conf.js';
import { IconButton } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import '../../global.css';
import Tooltip from '@material-ui/core/Tooltip';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import MyTimeer from '../mytimeer';
import Grid from '@material-ui/core/Grid';

let update=true;

class Navi extends Component {
  constructor(props){
    super(props);

    this.state = {
      redirection_path: '',
      username: '',
      random: 0
    };
  }

  componentDidMount() {
    ///modyfikacja
    let is_admin = localStorage.getItem('is_admin');
    this.setState({username: localStorage.getItem('username')});
    if(is_admin === true) {
          this.setState({is_admin: true});
        }
  }

  componentDidUpdate() {

    this.flipState(); // reset logout timer
  }

  settings() {
    if(this.state.is_admin) {
      return (
              <Tooltip title="Opcje">
        <IconButton color="primary" onClick={()=>this.setRedirection("admin_settings")}>
        <SettingsIcon/>
        </IconButton>
        </Tooltip>
      );
    } else {

    }
  }


beginsWith(a) {
  let b = a.match(/\/issue\/edit\/\w+/g);
  return b;
}


  addArt() {
//console.log(this.props.location);
    if(this.props.location !== '/issue/create/' && !this.beginsWith(this.props.location)) {
    return(
      <Tooltip title="Dodaj nowy wpis">
      <IconButton color="primary" onClick={()=>{this.setRedirection("add")}}>
         <AddCircleIcon/>
      </IconButton>
      </Tooltip>
    );
    }
  }

  flipState() {
    update = !update;
  }

  setTimer() {
    return(
<MyTimeer time={15*60*1000} update={update}/>
  );
  }


  redirect() {
    if(this.state.redirection_path !== '') {
      if(this.state.redirection_path === 'login') {
        return <Redirect push to={{ pathname: "/login" }} />;
      }
      if(this.state.redirection_path === 'home') {
        return <Redirect push to={{ pathname: "/home" }} />;
      }
      if(this.state.redirection_path === 'admin_settings') {
        return <Redirect push to={{ pathname: "/management/main" }} />;
      }
      if(this.state.redirection_path === 'add') {
        return <Redirect push to={{ pathname: "/issue/create/", state: { prev_path: this.props.location, search_tags: this.props.search_tags } }} />;
      }
      if(this.state.redirection_path === 'admin_settings') {
        return <Redirect push to={{ pathname: "/management/main" }} />;
      }
    }
  }

  setRedirection(path) {

    this.setState({redirection_path: path});

    }

    logOut() {
      axios.post(getConf('api_url_base')+'/logout', {}, { withCredentials: true })
      .then(res=>{
        console.log("ff");
this.setRedirection('login');
      })
      .catch((e)=>{console.log('error: ', e);
      if( e.response.status === 401) {
        this.setRedirection('/login');
        this.setState({is_authenticated: false});
      }
        });
    }

  render() {
    return(
      <Fragment>

      {this.redirect()}
      <div className="navi">
      <Grid container alignItems="flex-start" justify="flex-start" direction="row">


      <Tooltip title="Strona główna">
      <IconButton color="primary" onClick={()=>this.setRedirection("home")}>
         <HomeIcon/>
      </IconButton>
      </Tooltip>

      <Tooltip title={"Wyloguj: "+this.state.username}>
<IconButton color="primary" onClick={()=>this.logOut()}>
<MeetingRoomIcon/>
</IconButton>
</Tooltip>


        {this.settings()}
          {this.addArt()}
</Grid>
<div className="timeout">
     koniec sesji za: {this.setTimer()}
</div>
</div>


      </Fragment>
    );
  }
}

export default Navi;
