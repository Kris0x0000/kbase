import React, { Component, Fragment } from 'react';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { Router, Redirect } from 'react-router-dom';


class IssueCreate extends Component {

    constructor(props) {
      super(props);
      this.state = {
        title: '',
        body:'',
        tags:''
      };
    }

handletitle(data) {
  this.setState((state,props)=>{return {title: data}});
}

handlebody(data) {
  this.setState((state,props)=>{return {body: data}});
}

handletags(data) {
  this.setState((state,props)=>{
    return {tags: data.split(",")};
  }
  );
}

submit() {
console.log(this.state);
  axios.post('http://localhost:1234/api/issue/create', {title: this.state.title, body: this.state.body, tags: this.state.tags }, { withCredentials: true })
  .then(res=>{
    if(res.status == 200) {
      //this.props.history.push('/issues');
      this.setState((state, props)=>{
        return {isredirected: true};
      });
    }
    console.log(res.status)})
  .catch((e)=>{console.log(e)});
}


  render() {
  return (<Fragment>
        <TextField id="title" label="title" type="text" variant="outlined" onChange={(r)=>this.handletitle(r.target.value)} />
        <br /><br />
        <TextField id="body" label="body" type="text" variant="outlined" onChange={(r)=>this.handlebody(r.target.value)} />
        <br /><br />
        <TextField id="tags" label="tags" type="text" variant="outlined" onChange={(r)=>this.handletags(r.target.value)} />
        <br /><br />
        <Button variant="outlined" onClick={()=>{this.submit()}}>Submit</Button>

        </Fragment>
      );
  }

  }

  export default IssueCreate;
