import React, { Component, Fragment } from 'react';
import axios from 'axios';

import { Redirect } from 'react-router-dom';
import * as getConf from '../../../src/conf.js';
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
import Headerr from '../header';
import Tooltip from '@material-ui/core/Tooltip';
import Footer from '../footer';
import MyQuill from '../myquill';

let timeoutHandle;

class IssueCreate extends Component {

    constructor(props) {
      super(props);

      this.state = {
        //editfiled / Quill
        title: '',
        body:'',
        body_edited:'',
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
        warning_body:'',
        images:[],
        submit_clicked: false,

      };
      this.handleChange = this.handleChange.bind(this);
    }

setSessionTimeout = ()=>{
  timeoutHandle = setTimeout(()=>{
      this.setState({isauthenticated: false});
  }, getConf('session_timeout'));
};

componentDidMount() {


  this.setSessionTimeout();

// if redirected from other components
if(this.props.location.state) {
  this.setState({prev_path: this.props.location.state.prev_path, search_tags: this.props.location.state.search_tags});
}
   this.setState({is_loading_set: true});
    // fetching all tags for autocomplete field
    axios.post(getConf('api_url_base')+'/api/issue/getalltags',{tag: ''}, { withCredentials: true })
    .then(res=>{
      this.setState({is_loading_set: false, all_tags: res.data});
    })
    .catch((e)=>{
  if( e.response.status === 401) {
    this.setState({isauthenticated: false});
  }

});

        // if issue id in URL (/edit/id)
    if(this.props.match.params.id) {
    this.setState((state,props)=>{return {editmode: true, id: this.props.match.params.id}});

   this.setState({is_loading_set: true});
    axios.post(getConf('api_url_base')+'/api/issue/getIssueById', {id: this.props.match.params.id}, { withCredentials: true })
    .then(res=>{
      this.setState({is_loading_set: false});
  this.setState({
    title: res.data[0].title,
    body: res.data[0].body,
    tags: res.data[0].tags,
    images: this.state.images.concat(res.data[0].images)});
//console.log(res.data[0].images);
    })
    .catch((e)=>{

      if( e.response.status === 401) {
        this.setState({isauthenticated: false});
      }
    });
      }

}

componentDidUpdate() {
console.log('update');
  clearTimeout(timeoutHandle);
  this.setSessionTimeout();
}





handletitle(data) {
  this.setState((state,props)=>{return {title: data}});
}



handleChange(value) {
  this.setState({ body: value })

}

addImagesToArray(body) {
//console.log("body", body);
  var b=[];
  let first = body.match(/https?\:\/\/\w+(\.\w+)*\:?\w*.?\w*\/uploads\/\w*.\w{3,4}/g);
  if(first) {
  first.forEach((i)=>{
    console.log("image", i);
    let a = (i.split("/uploads/", 2));
    b.push(a[1]);
  });
}
  return b;
}


submit(option) {

  //this.setState({submit_clicked: true});
//console.log(this.state.body_edited);
if(option === 'accept') {

  if((this.state.title === '') || (this.state.body_edited === '') || (this.state.tags.length === 0)) {
      this.setState({show_warning: true, warning_body: "Uzupełnij wszystkie pola przed dodaniem wpisu."});
      setTimeout(()=>{
          this.setState({show_warning: false});
      }, 3000);
  } else {

  if(this.state.editmode) {

  axios.post(getConf('api_url_base')+'/api/issue/edit', {title: this.state.title, body: this.state.body_edited, tags: this.state.tags, id: this.state.id, images: this.addImagesToArray(this.state.body_edited) }, { withCredentials: true })
    .then(res=>{
      //this.setState({is_loading_set: false});
      this.setState({go_back: true});
    })
    .catch(e=>{
      if(e.response.status === 401) {
        this.setState({is_authenticated: false});
      }
    });

  } else {

  axios.post(getConf('api_url_base')+'/api/issue/create', {title: this.state.title, body: this.state.body_edited, tags: this.state.tags, images: this.addImagesToArray(this.state.body_edited) }, { withCredentials: true })
  .then(res=>{
      this.setState({go_back: true});
}
  ).catch((e)=>{
    if(e.response.status === 401) {
      this.setState({is_authenticated: false});
    }

  });
  } //else

}


} else {
  this.setState({go_back: true});
}

}


handleAutocompleteChange(event, value) {

  if(value.length > 8) {
    value = this.removeLastElement(value);
    this.setState({to_many_tags: true, show_warning: true, warning_body: "Nie możesz ustawić więcej niż 8 tagów"});
    setTimeout(()=>{
        this.setState({show_warning: false});
    }, 3000);
  } else {
    this.setState({to_many_tags: false});
  }

  this.ProcessArray(value).then(data => {
    this.setState({tags: data});
  });

}


ProcessArray = async (docs) => {
  return Promise.all(docs.map((item)=>this.ProcessItem(item)));
}

ProcessItem = async (item) => {

let item2 = item.toLowerCase();
let item3 = item2.replace("-", " ").replace("_"," ").replace("error","");

  return item3;
}


removeLastElement(arr) {
//let arr2 = arr.splice(arr.length -1, 1);
    return arr;
};


showLoading() {
  if(this.state.is_loading_set) {
    return(<div id="loading"><CircularProgress size={64}/></div>);
  }
}


isAuthenticated() {
  if(!this.state.isauthenticated) {
    return (<Redirect to={{ pathname: "/login", state: { prev_path: this.props.location.pathname } }} />);
  }
}

redirect() {
  if(this.state.go_back) {
    if(this.state.prev_path !== '') {
      //return (<Redirect push to={{pathname: this.props.location.state.prev_path, state: {search_tags: this.state.search_tags, prev_path: this.props.location}}} />);
      return window.history.back();
    }
  }
}

normalizeTag(tag) {
  return tag.toLowerCase();
}

handleMyQuillChange = (content) => {
//  console.log(content);

  this.setState({body_edited: content, submit_clicked: false});

};

handleMyQuillWarning = (show, title, body) => {
  this.setState({show_warning: show, warning_title: title, warning_body: body});
  setTimeout(()=>{
      this.setState({show_warning: false});
  }, 3000);
};



  render() {

  return (
    <Fragment>
    <Headerr />

    <Grid container alignItems="flex-start" justify="flex-start" direction="row">
    <Navi location={this.props.location.pathname}/>


    </Grid><br /><br />
    {this.showLoading()}

    <Snackbar variant="warning"
    open={this.state.show_warning}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
      <SnackbarContent message={this.state.warning_body} style={{backgroundColor:'#cc0000'}}/>
    </Snackbar>

    {this.redirect()}
{this.isAuthenticated()}

    <div id="container">
    <div class="editor">
    <Autocomplete
           multiple
           freeSolo
           value={this.state.tags}
           onChange={(event, value) => this.handleAutocompleteChange(event, value)}
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
         /><br/><br/>

        <TextField fullWidth={true} autoComplete="off" id="title" label="Tytuł" type="text" variant="outlined" value={this.state.title} onChange={(r)=>this.handletitle(r.target.value)} />
        <br /><br /><br />
<MyQuill content={this.state.body} onContentChange={this.handleMyQuillChange} onWarningChange={this.handleMyQuillWarning}/>
</div></div>

<div class="bottom_navi">
<Grid container alignItems="flex-end" justify="flex-start" direction="column" spacing={0}>
<Tooltip title="Wróć">
<IconButton color="secondary" onClick={()=>{this.submit('decline')}}>
   <ArrowBackIcon/>
</IconButton>
</Tooltip>
<Tooltip title="Zatwierdź">
<IconButton color="primary" onClick={()=>{this.submit('accept')}}>
   <DoneIcon/>
</IconButton>
</Tooltip>
        </Grid>
        </div>
        <br /><br /><br /><br />
        <Footer/>
        </Fragment>
      );
  }

  }

  export default IssueCreate;
