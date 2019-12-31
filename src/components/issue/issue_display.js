import React, { Component, Fragment } from 'react';
import axios from 'axios';
import './issue_create.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
// material ui
import { Button, TextField } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import { Chip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';



class IssueDisplay extends Component {

    constructor(props) {
      super(props);
      this.state = {
        title: '',
        body:'',
        text:'',
        id:'',
        tags:["tags"],
        isauthenticated: true
      };
    }

componentDidMount() {
console.log('test');
  axios.post(conf.api_url_base+'/api/issue/getIssueById', {id: this.props.match.params.id}, { withCredentials: true })
    .then(res=>{
      console.log(res);
      this.setState({body: res.data.body});
    })
    .catch(e=>{console.log(e)});

}
componentDidUpdate() {

}

isAuthenticated() {
  if(!this.state.isauthenticated) {
    return (<Redirect to={{ pathname: "/login" }} />);
  }
}

createHTML(code) {
  return {__html: code };
}

displayHTML(code) {
  return <div dangerouslySetInnerHTML={this.createHTML(code)} />;
}

redirect() {
  if(this.state.redirection_path !== '') {
    if(this.state.redirection_path === 'edit') {
      return <Redirect to={{ pathname: "/issue/edit/"+this.state.id }} />;
    }
    if(this.state.redirection_path === 'home') {
      return <Redirect to={{ pathname: '/' }} />;
    }
  }
}

setRedirection(id, path) {
  this.setState({redirection_path: path, id: id});
}


  render() {

  return (
    <Fragment>

    <div id="form">
    {this.isAuthenticated()}
    {this.displayHTML(this.state.body)}

        <br /><br />

        <br />
<Grid container alignItems="flex-start" justify="flex-end" direction="row">
<IconButton onClick={()=>{this.submit()}}>
   <EditIcon/>
</IconButton>
<br />
        </Grid>
</div>
        </Fragment>
      );
  }

  }

  export default IssueDisplay;
