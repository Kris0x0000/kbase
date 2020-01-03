import React, { Component, Fragment } from 'react';
import axios from 'axios';
import './issue.css';
import 'react-quill/dist/quill.snow.css';
import * as conf from '../../../src/conf.js';
import { Redirect } from 'react-router-dom';
// material ui
import { Grid } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton } from '@material-ui/core';
import { Chip } from '@material-ui/core';
import Navi from '../../components/navi/navi';



class IssueDisplay extends Component {

    constructor(props) {
      super(props);
      this.state = {
        title: '',
        body:'',
        text:'',
        id:'',
        tags:["tags"],
        isauthenticated: true,
        search_tags: ''
      };
    }

componentDidMount() {
this.setState({search_tags: this.props.location.state.search_tags});
  axios.post(conf.api_url_base+'/api/issue/getIssueById', {id: this.props.match.params.id}, { withCredentials: true })
    .then(res=>{
      console.log(res);
      this.setState({body: res.data.body, id: this.props.match.params.id});
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
      console.log("this.props.location", this.props.location);
      return <Redirect to={{ pathname: "/issue/edit/"+this.state.id , state: {prev_path: this.props.location}}} />;
    }
    if(this.state.redirection_path === 'back_to_search') {
      return <Redirect to={{
        pathname: '/issue/find',
      state: { search_tags: this.state.search_tags }
      }} />;
    }
  }
}

setRedirection(id, path) {
  this.setState({redirection_path: path, id: id});
}

  render() {
  return (
    <Fragment>
<Navi />
    <div id="container">
    {this.isAuthenticated()}
    {this.displayHTML(this.state.body)}
    {this.redirect()}
        <br /><br />
<Grid container alignItems="flex-start" justify="flex-end" direction="row">
<IconButton onClick={()=>{this.setRedirection("back", 'back_to_search')}}>
   <ArrowBackIcon/>
</IconButton>
<IconButton onClick={()=>{this.setRedirection(this.state.id, 'edit')}}>
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
