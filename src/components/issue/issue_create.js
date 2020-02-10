import React, { Component, Fragment } from 'react';
import axios from 'axios';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
import Header from '../header';
import Tooltip from '@material-ui/core/Tooltip';
import Footer from '../footer';



class IssueCreate extends Component {

    constructor(props) {
      super(props);
      this.myRef = React.createRef();

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
        warning_body:'',
        images:[],

      };
      this.handleChange = this.handleChange.bind(this);

      this.modules = {
          toolbar: {
            container: [['bold', 'italic', 'underline', 'blockquote','strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['image'],
            ],
            handlers: {
              'image': this.selectLocalImage
            }
          }
        }

    }

componentDidMount() {

// if redirected from other components
if(this.props.location.state) {
  this.setState({prev_path: this.props.location.state.prev_path, search_tags: this.props.location.state.search_tags});
}
    this.setState({is_loading_set: true});
    // fetching all tags for autocomplete field
    axios.post(getConf('api_url_base')+'/api/issue/getalltags',{tag: ''}, { withCredentials: true })
    .then(res=>{
      this.setState((state,props)=>{return {all_tags: res.data}});

      this.setState({is_loading_set: false});
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
console.log(res.data[0].images);
    })
    .catch((e)=>{

      if( e.response.status === 401) {
        this.setState({isauthenticated: false});
      }
    });
      }

}

componentDidUpdate() {
//console.log(this.state.images[0]);
}


handletitle(data) {
  this.setState((state,props)=>{return {title: data}});
}

handlebody(data) {
  this.setState((state,props)=>{return {body: data}});
}

handleChange(value) {
  this.setState({ body: value })

}

addImagesToArray(body) {
  var b=[];
  let first = body.match(/https?\:\/\/\w+\:?\w*.?\w*\/uploads\/\w*.\w{3,4}/g);
  if(first) {
  first.forEach((i)=>{
    let a = (i.split("/uploads/", 2));
    b.push(a[1]);
  });
}
  return b;
}


submit(option) {

if(option === 'accept') {

  if((this.state.title === '') || (this.state.body === '') || (this.state.tags.length === 0)) {
      this.setState({show_warning: true, warning_body: "Uzupełnij wszystkie pola przed dodaniem wpisu."});
      setTimeout(()=>{
          this.setState({show_warning: false});
      }, 2000);
  } else {

  if(this.state.editmode) {
//console.log(this.state.images);
this.setState({is_loading_set: true});


  axios.post(getConf('api_url_base')+'/api/issue/edit', {title: this.state.title, body: this.state.body, tags: this.state.tags, id: this.state.id, images: this.addImagesToArray(this.state.body) }, { withCredentials: true })
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

this.setState({is_loading_set: true});
  axios.post(getConf('api_url_base')+'/api/issue/create', {title: this.state.title, body: this.state.body, tags: this.state.tags, images: this.addImagesToArray(this.state.body) }, { withCredentials: true })
  .then(res=>{
    this.setState({is_loading_set: false});
    if(res.status === 200) {
    this.setState({go_back: true});
    }
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
    this.setState({to_many_tags: true, show_warning: true, warning_body: "Nie możesz ustawić więcej niż 6 tagów"});
    setTimeout(()=>{
        this.setState({show_warning: false});
    }, 2000);
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
    return (<Redirect to={{ pathname: "/login" }} />);
  }
}

redirect() {
  if(this.state.go_back) {
    if(this.state.prev_path !== '') {
      return (<Redirect to={{pathname: this.props.location.state.prev_path, state: {search_tags: this.state.search_tags, prev_path: this.props.location}}} />);
    }
  }
}

normalizeTag(tag) {
  return tag.toLowerCase();
}

selectLocalImage = ()=> {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.click();

      // Listen upload local image and save to server
      input.onchange = () => {
        const file = input.files[0];

        // file type is only image.
        if (/^image\//.test(file.type)) {
          this.saveToServer(file);
        } else {
          console.warn('You could only upload images.');
        }
      };
    };


  saveToServer = (file)=> {
      const fd = new FormData();
      fd.append('image', file);
      axios.post(getConf('api_url_base')+'/api/upload/', fd,{
    headers: {
      'Content-Type': 'multipart/form-data',
    }, withCredentials: true

})
      .then(res=>{
let img = res.data.path+res.data.filename;
console.log("img", img);

this.insertToEditor(img);
      })
      .catch((e)=>{
        console.log(e);
        if(e.response) {
    if( e.response.status === 401) {
      this.setState({isauthenticated: false});
          }}
        });
    };
    // Step3. insert image url to rich editor.


  insertToEditor(url) {
      // push image url to rich editor.
      const range = this.myRef.current.getEditor().getSelection();
      this.myRef.current.getEditor().insertEmbed(range.index, 'image', url);
    }


  render() {

  return (
    <Fragment>
    <Header />

    <Grid container alignItems="flex-start" justify="flex-start" direction="row">

    <Navi />


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
        <TextField fullWidth={true} autoComplete="off" id="title" label="Tytuł" type="text" variant="outlined" value={this.state.title} onChange={(r)=>this.handletitle(r.target.value)} />
        <br /><br /><br />
        <ReactQuill
        ref={this.myRef}
        value={this.state.body}
        onChange={this.handleChange}
         color="primary"
modules={this.modules}

formats={[
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]}

          />
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
</div>



<div class="bottom_navi">
<Grid container alignItems="flex-start" justify="flex-start" direction="row">
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
