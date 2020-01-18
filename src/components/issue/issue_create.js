import React, { Component, Fragment } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
// material ui
import { TextField } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import DoneIcon from '@material-ui/icons/Done';
import '../../global.css';
import Snackbar from '@material-ui/core/Snackbar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Navi from '../../components/navi/navi';
import { CircularProgress } from '@material-ui/core';
import { Chip } from '@material-ui/core';
import { SnackbarContent } from '@material-ui/core';



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
        show_warning: false,
        accepted: false,
        is_loading_set: false,
        warning_body:''
      };
      this.handleChange = this.handleChange.bind(this);

    }

componentDidMount() {

// if redirected from other components
if(this.props.location.state) {
  this.setState({prev_path: this.props.location.state.prev_path, search_tags: this.props.location.state.search_tags});
}
    this.setState({is_loading_set: true});
    // fetching all tags for autocomplete field
    axios.post(conf.api_url_base+'/api/issue/getalltags',{tag: ''}, { withCredentials: true })
    .then(res=>{
      this.setState((state,props)=>{return {all_tags: res.data}});
      console.log("res: ", res);
      this.setState({is_loading_set: false});
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

    this.setState({is_loading_set: true});
    axios.post(conf.api_url_base+'/api/issue/getIssueById', {id: this.props.match.params.id}, { withCredentials: true })
    .then(res=>{
      this.setState({is_loading_set: false});


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

if(option === 'accept') {
  if(this.state.editmode) {

this.setState({is_loading_set: true});
  axios.post(conf.api_url_base+'/api/issue/edit', {title: this.state.title, body: this.state.body, tags: this.state.tags, id: this.state.id }, { withCredentials: true })
    .then(res=>{
      //this.setState({is_loading_set: false});
      this.setState({go_back: true});
    })
    .catch(e=>{console.log(e)
      if(e.response.status === 405) {
        this.setState({show_warning: true, warning_body: "Nie możesz edytować wpisu którego nie jesteś właścicielem"});
      }
    });

  } else {

this.setState({is_loading_set: true});
  axios.post(conf.api_url_base+'/api/issue/create', {title: this.state.title, body: this.state.body, tags: this.state.tags }, { withCredentials: true })
  .then(res=>{
    this.setState({is_loading_set: false});
    if(res.status === 200) {
    this.setState({go_back: true});
    }
    console.log(res.status)})
  .catch((e)=>{console.log(e)});
  } //else
} else {
  this.setState({go_back: true});
}

}


handleAutocompleteChange(event, value) {

  if(value.length > 6) {
    value = this.removeLastElement(value);
    this.setState({to_many_tags: true, show_warning: true, warning_body: "Nie możesz ustawić więcej niż 6 tagów"});
    setTimeout(()=>{
        this.setState({show_warning: false});
    }, 2000);
  } else {
    this.setState({to_many_tags: false});
  }
  console.log("value: ", value);
    this.setState({tags: value});
    console.log(this.state.tags);
}

removeLastElement(arr) {

console.log(arr.length);
let arr2 = arr.splice(arr.length -1, 1);
console.log("removed: ", arr2);
    return arr;
};


showLoading() {
  if(this.state.is_loading_set) {
    return(<div id="loading"><CircularProgress size={64}/></div>);
  }
}


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
    {this.showLoading()}

    <Snackbar variant="warning"
    open={this.state.show_warning}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
      <SnackbarContent message={this.state.warning_body}/>
    </Snackbar>

    {this.redirect()}
{this.isAuthenticated()}
    <div id="container">
        <TextField fullWidth={true} autoComplete="off" id="title" label="title" type="text" variant="outlined" value={this.state.title} onChange={(r)=>this.handletitle(r.target.value)} />
        <br /><br />
        <ReactQuill value={this.state.body} onChange={this.handleChange} color="primary" />
        <br /><br />

        <Autocomplete
               multiple
               freeSolo

               value={this.state.tags}
               onChange={(event, value) => this.handleAutocompleteChange(event, value)}
               id="tags-standard"
               options={this.state.all_tags}
               getOptionLabel={option => option}

               renderTags={(value, getTagProps) =>
                 value.map((option, index) => (
                   <Chip  variant="outlined" label={option} color="primary" {...getTagProps({ index })} />
                 ))
               }


               renderInput={params => (

                 <TextField
                   {...params}
                   variant="outlined"
                   label="Wybierz tagi..."

                   fullWidth
                 />
               )}
             />
        <br />
<Grid container alignItems="flex-start" justify="flex-end" direction="row">
<IconButton color="secondary" onClick={()=>{this.submit('decline')}}>
   <ArrowBackIcon/>
</IconButton>
<IconButton color="primary" onClick={()=>{this.submit('accept')}}>
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
