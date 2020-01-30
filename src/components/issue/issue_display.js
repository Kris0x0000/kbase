import React, { Component, Fragment } from 'react';
import axios from 'axios';
import '../../global.css';
import 'react-quill/dist/quill.snow.css';
import * as conf from '../../../src/conf.js';
import { Redirect } from 'react-router-dom';
// material ui
import { Grid } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton } from '@material-ui/core';
import Navi from '../../components/navi/navi';
import Tooltip from '@material-ui/core/Tooltip';
import Header from '../header';
import Footer from '../footer';



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
        search_tags: '',
        create_timestamp: '',
         creator: '',
         edit_timestamp: '',
         editor: ''
      };
    }

componentDidMount() {
this.setState({search_tags: this.props.location.state.search_tags});
  axios.post(conf.api_url_base+'/api/issue/getIssueById', {id: this.props.match.params.id}, { withCredentials: true })
    .then(res=>{

      this.setState({
        body: res.data[0].body,
         id: this.props.match.params.id,
          title: res.data[0].title,
           create_timestamp: res.data[0].create_timestamp,
            creator: res.data[0].creator,
            edit_timestamp: res.data[0].edit_timestamp,
            editor: res.data[0].editor
          });
    })
    .catch(e=>{

      this.setState({isauthenticated: false});

    });
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
  return <p dangerouslySetInnerHTML={this.createHTML(code)} />;
}

redirect() {
  if(this.state.redirection_path !== '') {
    if(this.state.redirection_path === 'edit') {

      return <Redirect to={{ pathname: "/issue/edit/"+this.state.id , state: {prev_path: this.props.location.pathname}}} />;
    }
    if(this.state.redirection_path === 'back_to_search') {
      return <Redirect to={{
        pathname: '/issue/find',
      state: { search_tags: this.state.search_tags, prev_path: this.props.location.pathname }
      }} />;
    }
  }
}

setRedirection(id, path) {
  this.setState({redirection_path: path, id: id});
}


getTime(millis) {
  let time = new Date(millis).toLocaleDateString();
  return time;
}


  render() {
  return (
    <Fragment>
    <Grid container alignItems="flex-start" justify="flex-start" direction="row">
    <Navi /><Header/>
    </Grid><br/>
    <div id="container">
    {this.isAuthenticated()}

    <table id="issuedisplaytab">
<thead>
      <tr>
      <th>
      {this.displayHTML(this.state.title)}
      </th>
</tr>
</thead>


    <tbody>
      <tr>
      <td valign="top">
        {this.displayHTML(this.state.body)}
        </td>
      </tr>
    </tbody>
    </table>
  <br />
    {this.redirect()}

 Utworzony przez <b>{this.state.creator}</b>, w dniu <b>{this.getTime(this.state.create_timestamp)}</b>.
 <br/>
 {(this.state.editor !== '') ? <p>Zmodyfikowany przez <b>{(this.state.editor !== '') ? this.state.editor :''}</b>, w dniu <b>{this.getTime(this.state.edit_timestamp)}.</b></p> :''}


</div>
<div class="bottom_navi">
<Grid container alignItems="flex-start" justify="flex-end" direction="row">
<Tooltip title="Wróć">
<IconButton color="secondary" onClick={()=>{this.setRedirection("back", 'back_to_search')}}>
   <ArrowBackIcon/>
</IconButton>
</Tooltip>
<Tooltip title="Edytuj">
<IconButton color="primary" onClick={()=>{this.setRedirection(this.state.id, 'edit')}}>
   <EditIcon/>
</IconButton>
</Tooltip>
  </Grid>

</div>
<br /><br /><br /><br />
<Footer />
        </Fragment>
      );
  }

  }

  export default IssueDisplay;
