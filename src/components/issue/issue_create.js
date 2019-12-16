import React, { Component, Fragment } from 'react';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { Router, Redirect } from 'react-router-dom';
import './issue_create.css';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const MyButton = styled(Button)({
  justifyContent: 'center'
});


class IssueCreate extends Component {


    constructor(props) {
      super(props);
      this.state = {
        title: this.props.match.params.id,
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
console.log('submit');
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
  return (
    <Fragment>
    <div id="form">
        <TextField fullWidth={true} id="title" label="title" type="text" variant="outlined" onChange={(r)=>this.handletitle(r.target.value)} />
        <br /><br />
        <TextField multiline={true} rows={10} fullWidth={true} id="abc" label="body" type="text" variant="outlined" onChange={(r)=>this.handlebody(r.target.value)} />
        <br /><br />
        <TextField fullWidth={true} id="tags" label="tags" type="text" variant="outlined" onChange={(r)=>this.handletags(r.target.value)} />
        <br /><br />
<Grid container alignItems="flex-start" justify="flex-end" direction="row">
        <MyButton id="form_button" variant="outlined" onClick={()=>{this.submit()}}>Submit</MyButton>
        </Grid>
</div>
        </Fragment>
      );
  }

  }

  export default IssueCreate;
