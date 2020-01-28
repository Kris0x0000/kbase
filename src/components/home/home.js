import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
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
      usermode: true,
      this_path: '/home',
    };
  }

  componentDidMount() {
    axios.post(conf.api_url_base+'/api/isauthenticated',{tag: ''}, { withCredentials: true })
    .then(res=>{
      this.setState((state,props)=>{return {all_tags: res.data}});

    })
    .catch((e)=>{
  if( e.response.status !== 200) {
    this.setState({isauthenticated: false});
  }

}
  );


  axios.post(conf.api_url_base+'/api/user/isadmin', {}, { withCredentials: true })
    .then(res=>{

      this.setState({is_admin: true});
    })
    .catch(e=>{});

    axios.post(conf.api_url_base+'/api/user/getMyId', {}, { withCredentials: true })
      .then(res=>{

        this.setState({my_id: res.data});
      })
      .catch(e=>{});

}



redirect() {
  if(this.state.is_redirected) {
    return <Redirect to={{ pathname: this.state.path, state: {prev_path: this.state.this_path, usermode: this.state.usermode} }} />;
  }
}

setRedirection(path) {
  this.setState({path: path, is_redirected: true});
}

settings() {
  if(this.state.is_admin) {
    return (
      <Tooltip title="Opcje">
      <IconButton color="primary" onClick={()=>this.setRedirection("/management/main")}>
      <SettingsIcon style={{fontSize: '128px'}}/>
      </IconButton>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title="Opcje">
      <IconButton color="primary" onClick={()=>{
        this.setState({usermode: true});
        this.setRedirection("/management/user/edit/"+this.state.my_id);
    }}>
      <SettingsIcon style={{fontSize: '128px'}}/>
      </IconButton>
      </Tooltip>
    );

  }
}



setRedirection_old(option) {
  if (option === "goSearch") {
    this.setState({gosearch: true});
  } else if (option === "goCreate") {
    this.setState({gocreate: true});
  }
  else if (option === "settings") {
    this.setState({gocreate: true});
  }
}

isAuthenticated() {
  if(!this.state.isauthenticated) {
    return (<Redirect to={{ pathname: "/login" }} />);
  }
}


render() {
  return(
    <Fragment>
    <Header/>
    {this.isAuthenticated()}
    {this.redirect()}

    <div className="home_icons">
    <Grid container alignItems="flex-start" justify="flex-start" direction="row">
  <Tooltip title="Szukaj">
    <IconButton color="primary" onClick={()=>this.setRedirection("/issue/find/")}>
       <SearchIcon style={{fontSize: '128px'}}/>
    </IconButton>
    </Tooltip>
      <Tooltip title="Dodaj">
    <IconButton color="primary" onClick={()=>this.setRedirection("/issue/create/")}>
       <AddCircleIcon style={{fontSize: '128px'}}/>
    </IconButton>
    </Tooltip>
    <Tooltip title="Pomoc">
  <IconButton color="primary" onClick={()=>this.setRedirection("/help/")}>
     <HelpOutlineIcon style={{fontSize: '128px'}}/>
  </IconButton>
  </Tooltip>
    {this.settings()}
    </Grid>
    </div>
    <br /><br /><br /><br />
    <Footer/>
    </Fragment>
  );

 }
}

export default Home;
