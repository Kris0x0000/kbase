import React, { Component, Fragment } from 'react';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
import '../../global.css';
import { Grid } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import Header from '../header';



class Login extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      login: '',
      password: '',
      isredirected: false
    };

  }

  handleLogin(data) {
    this.setState((state, props)=>{
      return {login: data};
    });
  }

  handlePassword(data) {
    this.setState((state, props)=>{
      return {password: data};
    });
  }


  redirect() {
    if(this.state.isredirected) {
      return <Redirect to={{ pathname: `/home` }} />;
    }
  }

  submit() {

    console.log(this.state.login);
    console.log(this.state.password);
    axios.post(conf.api_url_base+'/login', {username: this.state.login, password: this.state.password}, { withCredentials: true })
    .then(res=>{
      if(res.status === 200) {
        //this.props.history.push('/issues');
        this.setState((state, props)=>{
          return {isredirected: true};
        });


      }
      console.log(res.status)})
    .catch((e)=>{console.log(e)});
  }

  render() {
    return (
      <Fragment>
      <Header/>
      <div id="loginform">
      {this.redirect()}

      <TextField id="Login" label="Login" type="text" variant="outlined" onChange={(r)=>this.handleLogin(r.target.value)} />
      <br /><br />
      <TextField id="Login" label="Password" type="password" variant="outlined" onChange={(r)=>this.handlePassword(r.target.value)} />
      <br /><br />

<Grid container alignItems="center" justify="center" direction="row">

      <IconButton color="primary" onClick={()=>{this.submit()}}>
         <DoneIcon/>
      </IconButton>

</Grid>
      </div>

      </Fragment>
    );
  }

}

export default Login;
