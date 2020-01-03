import React, { Component, Fragment } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
// material ui
import { Button, TextField } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Chip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import DoneIcon from '@material-ui/icons/Done';
import './issue.css';
import Snackbar from '@material-ui/core/Snackbar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Navi from '../../components/navi/navi';



class IssueCreate extends Component {

    constructor(props) {
      super(props);
      this.state = {
        //editfiled / Quill
        title: '',
        body:'',
        text:'',
        id:'',
        editmode: false,
        all_tags:["all_tags"],
        tags:[],
        isauthenticated: true,
        prev_path: '',
        go_back: false,
        to_many_tags: false,
        show_warning_too_many_tags: false,
        accepted: false
      };
      this.handleChange = this.handleChange.bind(this);

    }

componentDidMount() {

// if redirected from other components
if(this.props.location.state) {
  this.setState({prev_path: this.props.location.state.prev_path, search_tags: this.props.location.state.search_tags});
}
    // fetching all tags for autocomplete field
    axios.post(conf.api_url_base+'/api/issue/getalltags',{tag: ''}, { withCredentials: true })
    .then(res=>{
      this.setState((state,props)=>{return {all_tags: res.data}});
      console.log("res: ", res);

    })
    .catch((e)=>{
  if( e.response.status === 401) {
    this.setState({isauthenticated: false});
  }
      console.log('error: ', e.response.status)}
  );

        // if issue id in URL (/edit/id)
    if(this.props.match.params.id) {
    this.setState((state,props)=>{return {editmode: true, id: this.props.match.params.id}});

    axios.post(conf.api_url_base+'/api/issue/getIssueById', {id: this.props.match.params.id}, { withCredentials: true })
    .then(res=>{
    console.log("res.data.tags: ", res.data.tags);

  this.setState({
    title: res.data.title,
    body: res.data.body,
  tags: res.data.tags});
    console.log("ddd", this.state.tags);
    })
    .catch((e)=>{console.log(e)});
      }

}

componentDidUpdate() {

}


handletitle(data) {
  this.setState((state,props)=>{return {title: data}});
}

handlebody(data) {
  this.setState((state,props)=>{return {body: data}});
}

handleChange(value) {
  this.setState({ body: value })
  console.log(value);
}


submit(option) {

if(!(option !== 'accept')) {
  if(this.state.editmode) {

  axios.post(conf.api_url_base+'/api/issue/edit', {title: this.state.title, body: this.state.body, tags: this.state.tags, id: this.state.id }, { withCredentials: true })
    .then(res=>{
      console.log(res);

    })
    .catch(e=>{console.log(e)});

  } else {

  axios.post(conf.api_url_base+'/api/issue/create', {title: this.state.title, body: this.state.body, tags: this.state.tags }, { withCredentials: true })
  .then(res=>{
    if(res.status == 200) {
      this.setState((state, props)=>{
        return {isredirected: true};
      });
    }
    console.log(res.status)})
  .catch((e)=>{console.log(e)});
  } //else
}

  this.setState({go_back: true});
}


handleAutocompleteChange(event, value) {

  if(value.length > 5) {
    this.setState({to_many_tags: true, show_warning_too_many_tags: true});
    setTimeout(()=>{
        this.setState({show_warning_too_many_tags: false});
    }, 1000);
  } else {
    this.setState({to_many_tags: false});
  }
  console.log("value: ", value);
    this.setState({tags: value});
    console.log(this.state.tags);
}

removeLastElement() {

  let arr = this.state.tags;
    arr.splice(arr.length, 1);
    this.setState({tags: arr});
};




isAuthenticated() {
  if(!this.state.isauthenticated) {
    return (<Redirect to={{ pathname: "/login" }} />);
  }
}

redirect() {
  if(this.state.go_back) {
    if(this.state.prev_path !== '') {
      console.log(this.state.search_tags);
      return (<Redirect to={{pathname: this.state.prev_path.pathname, state: {search_tags: this.state.search_tags}}} />);
    }
  }
}


  render() {

  return (
    <Fragment>
    <Navi />
    <Snackbar variant="warning"
    open={this.state.show_warning_too_many_tags}
    message="Maksymalna liczba tagów..."
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}

    />
    {this.redirect()}
{this.isAuthenticated()}
    <div id="container">
        <TextField fullWidth={true} id="title" label="title" type="text" variant="outlined" value={this.state.title} onChange={(r)=>this.handletitle(r.target.value)} />
        <br /><br />
        <ReactQuill value={this.state.body} onChange={this.handleChange} />
        <br /><br />

        <Autocomplete
               multiple
               freeSolo
               disabled={this.state.to_many_tags}
               value={this.state.tags}
               onChange={(event, value) => this.handleAutocompleteChange(event, value)}
               id="tags-standard"
               options={this.state.all_tags}
               getOptionLabel={option => option}

               renderInput={params => (

                 <TextField
                   {...params}
                   variant="standard"
                   label="Multiple values"
                   placeholder="Favorites"
                   fullWidth
                 />
               )}
             />
        <br />
<Grid container alignItems="flex-start" justify="flex-end" direction="row">
<IconButton onClick={()=>{this.submit('decline')}}>
   <ArrowBackIcon/>
</IconButton>
<IconButton onClick={()=>{this.submit('accept')}}>
   <DoneIcon/>
</IconButton>
<br />
        </Grid>
</div>
        </Fragment>
      );
  }

  }

  export default IssueCreate;
