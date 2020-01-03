import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
import { IconButton } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';


class Navi extends Component {
  constructor(props){
    super(props);

    this.state = {

    };
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
      console.log(this.state.redirection_path);
    }

  render() {
    return(
      <Fragment>
      {this.redirect()}
      <IconButton onClick={()=>this.setRedirection("home")}>
         <HomeIcon/>
      </IconButton>
      </Fragment>
    );
  }
}

export default Navi;
