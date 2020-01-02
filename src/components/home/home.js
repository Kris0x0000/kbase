import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
import { IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import './home.css';



class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gosearch: false,
      gocreate: false,
      redirection: "",
      isauthenticated: true
    };
  }

  componentDidMount() {
    axios.post(conf.api_url_base+'/api/isauthenticated',{tag: ''}, { withCredentials: true })
    .then(res=>{
      this.setState((state,props)=>{return {all_tags: res.data}});
      console.log("res: ", res);
    })
    .catch((e)=>{
  if( e.response.status !== 200) {
    this.setState({isauthenticated: false})
  }
      console.log('error: ', e.response.status)}

  );
  }


redirect() {
  if(this.state.gosearch) {
    return <Redirect to={{ pathname: `/issue/find` }} />;
  } else if(this.state.gocreate) {
    return <Redirect to={{ pathname: `/issue/create`, state: {prev_path: this.props.location} }} />;
  }
}


setRedirection(option) {
  if (option === "goSearch") {
    this.setState({gosearch: true});
  } else if (option === "goCreate") {
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
    {this.isAuthenticated()}
    {this.redirect()}
    <div id="main">
    <IconButton onClick={()=>this.setRedirection("goSearch")}>
       <SearchIcon style={{fontSize: '128px'}}/>
    </IconButton>
    <IconButton onClick={()=>this.setRedirection("goCreate")}>
       <AddCircleIcon style={{fontSize: '128px'}}/>
    </IconButton>
    </div>
    </Fragment>
  );

 }
}

export default Home;
