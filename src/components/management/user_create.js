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
import Tooltip from '@material-ui/core/Tooltip';
import Header from '../../components/header';
import Footer from '../../components/footer';



class UserCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uname: '',
      password: '',
      password2: '',
      is_authenticated: true,
      error_password2:false,
      helper_password2: '',
      error_uname:false,
      uname_helper:'',
      error_password1: false,
      helper_password1: '',
      show_warning: false,
      warning_body: '',
      prev_path: '',
      is_redirected: false,
      editmode: false,
      is_admin: false,
      id:'',
      usermode: false,

    };
  }

componentDidMount() {

  if(this.props.location.state) {
    if(this.props.location.state.prev_path) {
      this.setState({prev_path: this.props.location.state.prev_path});
    }

    if(this.props.location.state.usermode) {
      this.setState({usermode: true});
      console.log("usermode");
    }
  }


  // if issue id in URL (/edit/id)
  if(this.props.match.params.id) {
  this.setState((state,props)=>{return {editmode: true, id: this.props.match.params.id}});

  //this.setState({is_loading_set: true});
  axios.post(conf.api_url_base+'/api/user/getUserById', {id: this.props.match.params.id}, { withCredentials: true })
  .then(res=>{

  this.setState({is_loading_set: false});
  console.log("res", res);

  this.setState({

  uname: res.data.username,
  password: res.data.password,
  is_admin: res.data.is_admin,
  res: res.data._id,
});

this.setState({password2: this.state.password});

})
  .catch((e)=>{console.log(e)});
  }



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
    this.setState({is_admin: value});
  }
}


handletextfield(id, data) {
  if(id === 'uname') {

if(!(data === '')) {
      axios.post(conf.api_url_base+'/api/user/getUserByName', {username: data}, { withCredentials: true })
        .then(res=>{
          console.log(res.data._id, this.state.id);
          if((res.data !== "") && (res.data._id !== this.state.id)) {
            this.setState({uname_helper: 'Podana nazwa użytkownika istnieje już w systemie.', error_uname: true});
            this.setState({uname: data});
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
        this.setState({uname: data});
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
      this.setState({password: data});
    }
  }


  if(id === 'password2') {
    if(this.state.password !== data) {
        this.setState({error_password2: true});
        this.setState({helper_password2: 'hasła nie są zgodne'});
        this.setState({password2: data});
    } else {
      this.setState({error_password2: false});
      this.setState({helper_password2: ''});
      this.setState({password2: data});
    }

  }
}


setRedirection(path) {
  this.setState({prev_path: path, is_redirected: true});
}

redirect() {
  if(this.state.is_redirected) {
      return (<Redirect to={{pathname: this.state.prev_path}} />);
  }
}

adminSwitch() {
  if(!this.state.usermode) {
  return(<div><p>Administrator</p>
    <Switch
    id="is_admin"
 onChange={(r)=>this.handleswitch(r.target.id, !this.state.is_admin)}
 checked={this.state.is_admin}
 color="primary"
 inputProps={{ 'aria-label': 'primary checkbox' }} /></div>);

  }
}

submit(option) {
  setTimeout(()=>{
  if(option === 'accept') {

    if((this.state.uname === '') || (this.state.password === '') || (this.state.password2 === '') || this.state.error_password1 || this.state.error_uname || this.state.error_password2){
        this.setState({show_warning: true, warning_body: "Wypełnij prawidłowo wszyskie pola."});
        setTimeout(()=>{
          this.setState({show_warning: false, warning_body: ""});
        }, 2000);
    } else {

if(this.state.editmode && !this.state.usermode) {

  console.log("editmode");
  //this.setState({is_loading_set: true});
  axios.post(conf.api_url_base+'/api/user/edit', {username: this.state.uname, password: this.state.password, is_admin: this.state.is_admin, id: this.state.id }, { withCredentials: true })
    .then(res=>{
      //this.setState({is_loading_set: false});
      console.log("res::", res);
      this.setRedirection('/management/main/');
    })
    .catch(e=>{console.log(e)
    });


} else if (this.state.usermode) {

  console.log("usermode");
  //this.setState({is_loading_set: true});
  axios.post(conf.api_url_base+'/api/user/editMyUser', {username: this.state.uname, password: this.state.password}, { withCredentials: true })
    .then(res=>{
      //this.setState({is_loading_set: false});
      console.log("res::", res);
      this.setRedirection('/home');
    })
    .catch(e=>{console.log(e)
    });

} else {
  axios.post(conf.api_url_base+'/api/user/create',{username: this.state.uname, password: this.state.password2, is_admin: this.state.is_admin}, { withCredentials: true })
    .then(res=>{
      this.setRedirection('/management/main/');
    })
    .catch(e=>{
      if( e.response.status === 401) {
        this.setState({is_authenticated: false});
      }
    });
    }
    }

} //accept
},500);

  if(option === 'back' && !this.state.usermode) {
    this.setRedirection('/management/main/');
  } else {
    this.setRedirection('/home/');
  }
}


  render() {
    return(
      <Fragment>
      {this.isAuthenticated()}
      {this.redirect()}
      <Grid container alignItems="flex-start" justify="flex-start" direction="row">
      <Navi /><Header/>
      </Grid><br/><br /><br />
      <Snackbar variant="warning"
      open={this.state.show_warning}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
        <SnackbarContent message={this.state.warning_body} style={{backgroundColor:'#cc0000'}}/>
      </Snackbar>

        <div id="container">
        {(this.state.editmode)? <h1>Edycja użytkownika</h1> :<h1>Dodawanie nowego użytkownika</h1> }

        <TextField  value={this.state.uname} fullWidth={true} autoComplete='off' error={this.state.error_uname} helperText={this.state.uname_helper} id="uname" label="nazwa użytkownika" type="text" variant="outlined" onChange={(r)=>this.handletextfield(r.target.id, r.target.value)} />
        <br/><br/>
        <TextField   value={this.state.password} fullWidth={true} autoComplete="new-password" error={this.state.error_password1} helperText={this.state.helper_password1} id="password" label="hasło" type="password" variant="outlined" onChange={(r)=>this.handletextfield(r.target.id, r.target.value)} />
        <br/><br/>
        <TextField  value={this.state.password2} fullWidth={true} autoComplete="new-password" error={this.state.error_password2} helperText={this.state.helper_password2} id="password2" label="powtórz hasło" type="password" variant="outlined" onChange={(r)=>this.handletextfield(r.target.id, r.target.value)} />
        <br/><br/>

   <br/><br/>
        {this.adminSwitch()}
        </div>
        <div class="bottom_navi">
        <Grid container alignItems="flex-start" justify="flex-start" direction="row">
        <IconButton color="secondary" onClick={()=>{this.submit('back')}}>
           <ArrowBackIcon/>
        </IconButton>
        <IconButton color="primary" onClick={()=>{this.submit('accept')}}>
           <DoneIcon/>
        </IconButton>
                </Grid>

        </div>
        <Footer/>
      </Fragment>
    );
  }
}

export default UserCreate;
