import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import * as getConf from '../../../src/conf.js';
import { IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import '../../global.css';
import Header from '../header';
import Tooltip from '@material-ui/core/Tooltip';
import SettingsIcon from '@material-ui/icons/Settings';
import Footer from '../footer';
import { Grid } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import { spacing } from '@material-ui/system';
import ListIcon from '@material-ui/icons/List';

let timeoutHandle;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gosearch: false,
      gocreate: false,
      redirection: "",
      isauthenticated: true,
      is_admin: false,
      my_id:'',
      this_path: '/home',
      username:'',
    };
  }


  setSessionTimeout = ()=>{
    timeoutHandle = setTimeout(()=>{
        this.setState({isauthenticated: false});
    }, getConf('session_timeout'));
  };


  componentDidMount() {

    this.setSessionTimeout();
    let is_admin = localStorage.getItem('is_admin');
    let username = localStorage.getItem('username');

setTimeout(()=>{
  if(is_admin === 'true') {
  this.setState({is_admin: true, username: username});

} else {
  this.setState({is_admin: false, username: username});
}
},50);



    axios.post(getConf('api_url_base')+'/api/isauthenticated',{tag: ''}, { withCredentials: true })
    .then(res=>{
      this.setState((state,props)=>{return {all_tags: res.data}});

    })
    .catch((e)=>{
    this.setState({isauthenticated: false});

}
  );


    axios.post(getConf('api_url_base')+'/api/user/getMyId', {}, { withCredentials: true })
      .then(res=>{

        this.setState({my_id: res.data});
      })
      .catch(e=>{});
}

componentDidUpdate() {
  clearTimeout(timeoutHandle);
  this.setSessionTimeout();
}


redirect() {
  if(this.state.is_redirected) {
    return <Redirect push to={{ pathname:this.state.path, state: {prev_path: this.state.this_path} }} />;
  }
}

setRedirection(path) {
  this.setState({path: path, is_redirected: true});
}

settings() {
  if(this.state.is_admin === true) {
    return (
      <Tooltip title="Opcje">
      <IconButton color="primary" onClick={()=>this.setRedirection("/management/main")}>
      <SettingsIcon style={{fontSize: '128px'}}/>
      </IconButton>
      </Tooltip>
    );
  } else {
    //this.setState({usermode: true});
    return (
      <Tooltip title="Opcje">
      <IconButton color="primary" onClick={()=>{

        this.setRedirection("/management/user/edit/"+this.state.my_id);
    }}>
      <SettingsIcon style={{fontSize: '128px'}}/>
      </IconButton>
      </Tooltip>
    );

  }
}



isAuthenticated() {
  if(!this.state.isauthenticated) {
    return (<Redirect push to={{ pathname: '/login' }} />);
  }
}

logOut() {
  axios.post(getConf('api_url_base')+'/logout', {}, { withCredentials: true })
  .then(res=>{
localStorage.clear();
this.setState({isauthenticated: false});
  })
  .catch((e)=>{console.log('error: ', e);
  if( e.response.status === 401) {


  }
    });
}


render() {
  return(
    <Fragment>
    <Header/>
    {this.isAuthenticated()}
    {this.redirect()}

<div className="home_icons">
    <Grid container style={{ marginTop: '50px' }} alignItems="flex-start" justify="center" direction="row">
    <Grid item align="center" xs>
  <Tooltip title="Szukaj">
    <IconButton color="primary" onClick={()=>this.setRedirection("/issue/find/")}>
       <SearchIcon style={{fontSize: '128px'}}/>
    </IconButton>
    </Tooltip>
    </Grid>
    <Grid item align="center" xs>
      <Tooltip title="Dodaj">
    <IconButton color="primary" onClick={()=>this.setRedirection("/issue/create/")}>
       <AddCircleIcon style={{fontSize: '128px'}}/>
    </IconButton>
    </Tooltip>
    </Grid>
    <Grid item align="center" xs>


    {this.settings()}
    </Grid>


<Grid item align="center" xs>
  <Tooltip title={"Lista wszystkich wpisów"}>
<IconButton color="primary" onClick={()=>this.setRedirection("/issue/all")}>
<ListIcon style={{fontSize: '128px'}} />
</IconButton>
</Tooltip>
</Grid>

<Grid item align="center" xs>
<Tooltip title="Pomoc">
<IconButton color="primary" onClick={()=>this.setRedirection("/help/")}>
 <HelpOutlineIcon style={{fontSize: '128px'}}/>
</IconButton>
</Tooltip>
</Grid>

<Grid item align="center" xs>
  <Tooltip title={"Wyloguj: "+this.state.username}>
<IconButton color="primary" onClick={()=>this.logOut()}>
<MeetingRoomIcon style={{fontSize: '128px'}} />
</IconButton>
</Tooltip>
</Grid>


    </Grid>
</div>
    <br /><br /><br /><br />
    <Footer/>
    </Fragment>
  );

 }
}

export default Home;
