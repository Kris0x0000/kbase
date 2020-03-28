import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as getConf from '../../../src/conf.js';
import { TextField } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import Snackbar from '@material-ui/core/Snackbar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Navi from '../../components/navi/navi';
import { SnackbarContent } from '@material-ui/core';
import '../../global.css';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Header from '../../components/header';
import Footer from '../../components/footer';

let timeoutHandle;

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
      is_edited_user_admin: false,
      id:'',
      path: '',

    };
  }


  setSessionTimeout = ()=>{
    timeoutHandle = setTimeout(()=>{
        this.setState({isauthenticated: false});
    }, getConf('session_timeout'));
  };

componentDidMount() {

  if(localStorage.getItem('is_admin') === 'true') {
    this.setState({is_admin: true, usermode: false});
  }


  this.setSessionTimeout();

  //this.setState({is_admin: localStorage.getItem('is_admin')});
  if(this.props.location.state) {
    if(this.props.location.state.prev_path) {
      this.setState({prev_path: this.props.location.state.prev_path});
    }
      //this.setState({usermode: !this.state.is_admin});
    //  console.log(this.state.usermode);
  }


  // if issue id in URL (/edit/id)
  if(this.props.match.params.id) {
  this.setState((state,props)=>{return {editmode: true, id: this.props.match.params.id}});

  //this.setState({is_loading_set: true});
  axios.post(getConf('api_url_base')+'/api/user/getUserById', {id: this.props.match.params.id}, { withCredentials: true })
  .then(res=>{

  this.setState({is_loading_set: false});

  this.setState({

  uname: res.data.username,
  password: res.data.password,
  is_edited_user_admin: res.data.is_admin,
  res: res.data._id,
});

this.setState({password2: this.state.password});

})
  .catch((e)=>{console.log(e);
    if( e.response.status === 401) {
      this.setState({is_authenticated: false});
    }
  });
  }



  axios.post(getConf('api_url_base')+'/api/isauthenticated', {}, { withCredentials: true })
    .then(res=>{
      this.setState({is_authenticated: true});
    })
    .catch(e=>{
      this.setState({is_authenticated: false});
    });
}

componentDidUpdate(prevState) {
  clearTimeout(timeoutHandle);
    this.setSessionTimeout();
    if(prevState.is_admin !== localStorage.getItem('is_admin')) {
    }


}

isAuthenticated() {
  if(!this.state.is_authenticated) {
    return (<Redirect to={{ pathname: "/login"}} />);
  }
}

handleswitch(id, value) {
  if(id === 'is_admin') {
    this.setState({is_edited_user_admin: value});
  }
}


handletextfield(id, data) {
  if(id === 'uname') {

if(!(data === '')) {
      axios.post(getConf('api_url_base')+'/api/user/getUserByName', {username: data}, { withCredentials: true })
        .then(res=>{
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
          if( e.response.status === 401) {
            this.setState({is_authenticated: false});
          }
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
  this.setState({path: path, is_redirected: true});
}

redirect() {
  if(this.state.is_redirected) {
      return (<Redirect push to={{pathname: this.state.path}} />);
  }
}

adminSwitch() {
  if(this.state.is_admin) {
  return(<div><p>Administrator</p>
    <Switch
    id="is_admin"
 onChange={(r)=>this.handleswitch(r.target.id, !this.state.is_edited_user_admin)}
 checked={this.state.is_edited_user_admin}
 color="primary"
 inputProps={{ 'aria-label': 'primary checkbox' }} /></div>);

} else {
  // nothing
}
}

submit(option) {
  setTimeout(()=>{
  if(option === 'accept') {

    if((this.state.uname === '') || (this.state.password === '') || (this.state.password2 === '') || this.state.error_password1 || this.state.error_uname || this.state.error_password2){
        this.setState({show_warning: true, warning_body: "Wypełnij prawidłowo wszyskie pola."});
        setTimeout(()=>{
          this.setState({show_warning: false, warning_body: ""});
        }, 3000);
    } else {


if(this.state.editmode && this.state.is_admin) {
  //console.log('editmode');

  axios.post(getConf('api_url_base')+'/api/user/edit', {username: this.state.uname, password: this.state.password, is_admin: this.state.is_edited_user_admin, id: this.state.id }, { withCredentials: true })
    .then(res=>{
      this.setRedirection('/management/main');
    })
    .catch(e=>{console.log(e);
      if( e.response.status === 401) {
        this.setState({is_authenticated: false});
      }
    });


} else if (!this.state.is_admin) {

  axios.post(getConf('api_url_base')+'/api/user/editMyUser', {username: this.state.uname, password: this.state.password}, { withCredentials: true })
    .then(res=>{
      this.setRedirection('/home/');
    })
    .catch(e=>{console.log(e);
      if( e.response.status === 401) {
        this.setState({is_authenticated: false});
      }

    });

} else {
  axios.post(getConf('api_url_base')+'/api/user/create',{username: this.state.uname, password: this.state.password2, is_admin: this.state.is_edited_user_admin}, { withCredentials: true })
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


}


  render() {
    return(
      <Fragment>
      {this.isAuthenticated()}
      {this.redirect()}
      <Header/>
      <Grid container alignItems="flex-start" justify="flex-start" direction="row">
      <Navi location={this.props.location.pathname}/>
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
        <Grid container alignItems="flex-end" justify="flex-start" direction="column" spacing={0}>
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
