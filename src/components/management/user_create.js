import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
import { TextField } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import Snackbar from '@material-ui/core/Snackbar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Navi from '../../components/navi/navi';
import { CircularProgress } from '@material-ui/core';
import { SnackbarContent } from '@material-ui/core';
import '../../global.css';
import Switch from '@material-ui/core/Switch';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { ThemeProvider } from '@material-ui/styles';


const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});


class UserCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uname: '',
      password: '',
      password2: '',
      isadmin: false,
      is_authenticated: true,
      error_password2:false,
      helper_password2: '',
      error_uname:false,
      uname_helper:'',
      error_password1: false,
      helper_password1: '',
      show_warning: false,
      warning_body: '',

    };
  }

componentDidMount() {
  axios.post(conf.api_url_base+'/api/isauthenticated', {}, { withCredentials: true })
    .then(res=>{
      console.log("200");
      this.setState({is_authenticated: true});
    })
    .catch(e=>{
      this.setState({is_authenticated: false});
    });
}

componentDidUpdate(prevState) {

}

isAuthenticated() {
  if(!this.state.is_authenticated) {
    return (<Redirect to={{ pathname: "/login" }} />);
  }
}

handleswitch(id, value) {
  if(id === 'is_admin') {


    console.log("value:",value);
    this.setState({isadmin: value});
  }
}


handletextfield(id, data) {
  setTimeout(()=>{

  if(id === 'uname') {

if(!(data === '')) {
      axios.post(conf.api_url_base+'/api/user/getUserByName', {username: data}, { withCredentials: true })
        .then(res=>{
          console.log(res);
          if(res.data !== "") {
            this.setState({uname_helper: 'Podana nazwa użytkownika istnieje już w systemie.', error_uname: true});
          } else {
            this.setState({uname_helper: '', error_uname: false});
            this.setState({uname: data});
          }
        })
        .catch(e=>{
          console.log(e.response);
        });
      } else {
        this.setState({error_uname: true});
      }
  }

  if( id === 'password') {
    if(data.length >= 8) {
      this.setState({error_password1: false});
      this.setState({helper_password1: ''});
      this.setState({password: data});
    } else {
      this.setState({error_password1: true});
      this.setState({helper_password1: 'hasło musi mieć minimum 8 znaków'});
    }
  }

  if(id === 'password2') {
    if(this.state.password !== data) {
        this.setState({error_password2: true});
        this.setState({helper_password2: 'hasła nie są zgodne'});
    } else {
      this.setState({error_password2: false});
      this.setState({helper_password2: ''});
    }

  } else {
    this.setState({password2: data});
  }

  }, 500);
}


submit(option) {
  if(option === 'accept') {
    if((this.state.uname === '') || (this.state.password === '') || (this.state.password2 === '')){
        this.setState({show_warning: true, warning_body: "Wypełnij wszyskie Pola."});
        setTimeout(()=>{
          this.setState({show_warning: false, warning_body: ""});
        }, 2000);
    } else {

  axios.post(conf.api_url_base+'/api/user/create',{username: this.state.uname, password: this.state.password2, is_admin: this.state.isadmin}, { withCredentials: true })
    .then(res=>{
      console.log(res);
    })
    .catch(e=>{
      if( e.response.status === 401) {
        this.setState({is_authenticated: false});
      }

    });

  }
  }
}


  render() {
    return(
      <Fragment>
      {this.isAuthenticated()}
      <Navi/>
      <Snackbar variant="warning"
      open={this.state.show_warning}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
        <SnackbarContent message={this.state.warning_body} style={{backgroundColor:'#cc0000'}}/>
      </Snackbar>

        <div id="container">
        <h1>Dodawanie nowego użytkownika</h1>
        <TextField fullWidth={true} autoComplete='off' error={this.state.error_uname} helperText={this.state.uname_helper} id="uname" label="nazwa użytkownika" type="text" variant="outlined" onChange={(r)=>this.handletextfield(r.target.id, r.target.value)} />
        <br/><br/>
        <TextField  fullWidth={true} autoComplete="new-password" error={this.state.error_password1} helperText={this.state.helper_password1} id="password" label="hasło" type="password" variant="outlined" onChange={(r)=>this.handletextfield(r.target.id, r.target.value)} />
        <br/><br/>
        <TextField fullWidth={true} autoComplete="new-password" error={this.state.error_password2} helperText={this.state.helper_password2} id="password2" label="powtórz hasło" type="password" variant="outlined" onChange={(r)=>this.handletextfield(r.target.id, r.target.value)} />
        <br/><br/>
        Administrator
        <Switch
        id="is_admin"
     onChange={(r)=>this.handleswitch(r.target.id, r.target.checked)}
     value={false}
     color="primary"
     inputProps={{ 'aria-label': 'primary checkbox' }}
   />
   <br/><br/>
   <Grid container alignItems="flex-start" justify="flex-end" direction="row">
   <ThemeProvider theme={theme}>
   <IconButton color="primary" onClick={()=>{this.submit('decline')}}>
      <ArrowBackIcon/>
   </IconButton>
   <IconButton color="primary" onClick={()=>{this.submit('accept')}}>
      <DoneIcon/>
   </IconButton>
   </ThemeProvider>
        <br />
           </Grid>
        </div>
      </Fragment>
    );
  }
}

export default UserCreate;
