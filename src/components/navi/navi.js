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



class Navi extends Component {
  constructor(props){
    super(props);

    this.state = {
redirection_path: ''
    };
  }

  componentDidMount() {
    ///modyfikacja
    let is_admin = localStorage.getItem('is_admin');
    if(is_admin) {
          this.setState({is_admin: true});
        }
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
    }
  }


  addArt() {
//console.log(this.props.location);
    if(this.props.location !== '/issue/create/') {
    return(
      <Tooltip title="Dodaj nowy wpis">
      <IconButton color="primary" onClick={()=>{this.setRedirection("add")}}>
         <AddCircleIcon/>
      </IconButton>
      </Tooltip>
    );
    }
  }


  redirect() {
    if(this.state.redirection_path !== '') {
      if(this.state.redirection_path === 'home') {
        return <Redirect to={{ pathname: "/home" }} />;
      }
      if(this.state.redirection_path === 'admin_settings') {
        return <Redirect to={{ pathname: "/management/main" }} />;
      }
      if(this.state.redirection_path === 'add') {
        return <Redirect to={{ pathname: "/issue/create/", state: { prev_path: this.props.location, search_tags: this.props.search_tags } }} />;
      }
      if(this.state.redirection_path === 'admin_settings') {
        return <Redirect to={{ pathname: "/management/main" }} />;
      }
    }
  }

  setRedirection(path) {

    this.setState({redirection_path: path});
    }

  render() {
    return(
      <Fragment>

      {this.redirect()}
<div className="navi">
      <Tooltip title="Strona główna">
      <IconButton color="primary" onClick={()=>this.setRedirection("home")}>
         <HomeIcon/>
      </IconButton>
      </Tooltip>


        {this.settings()}
          {this.addArt()}
</div>
      </Fragment>
    );
  }
}

export default Navi;
