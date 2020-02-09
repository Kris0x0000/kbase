import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as getConf from '../../../src/conf.js';
import { IconButton } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import '../../global.css';



class Navi extends Component {
  constructor(props){
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    ///modyfikacja
      axios.post(getConf('api_url_base')+'/api/user/isadmin', {}, { withCredentials: true })
        .then(res=>{
          this.setState({is_admin: true});
        })
        .catch(e=>{console.log(e.response)});
  }

  settings() {
    if(this.state.is_admin) {
      return (
        <IconButton color="primary" onClick={()=>this.setRedirection("settings")}>
        <SettingsIcon/>
        </IconButton>
      );
    }
  }


  redirect() {
    if(this.state.redirection_path !== '') {
      if(this.state.redirection_path === 'home') {
        return <Redirect to={{ pathname: "/home" }} />;
      }
      if(this.state.redirection_path === 'settings') {
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
      <IconButton color="primary" onClick={()=>this.setRedirection("home")}>
         <HomeIcon/>
      </IconButton>

        {this.settings()}
</div>
      </Fragment>
    );
  }
}

export default Navi;
