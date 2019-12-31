import React, { Component, Fragment } from 'react';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
import './issue.css';
import { styled } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Autocomplete } from '@material-ui/lab';
import VisibilityIcon from '@material-ui/icons/Visibility';




class Issue extends Component {

  constructor(props) {
    super(props);
    this.state = {
      search_tags:'',
      tags:'',
      body:'',
      title:'',
      username:'',
      timestamp:'',
      result:'',
      object:'',
      id: '',
      showIssues: false,
      all_tags: []
    };
  }


  componentDidMount() {

    axios.post(conf.api_url_base+'/api/issue/getalltags',{tag: ''}, { withCredentials: true })
    .then(res=>{
      this.setState((state,props)=>{return {all_tags: res.data}});
      console.log("res: ", res);
    })
    .catch((e)=>{
  if( e.response.status === 401) {
  //  this.setState({isauthenticated: false})
  }
      console.log('error: ', e.response.status)}

  );

  }

  handletags(data) {
    //let data1 = data;
    setTimeout((data1)=>{
      console.log("h: ",data);
      this.setState((state,props)=>{
         return {search_tags: data.split(",")};
      });

    }, 1000);
  }

  handleAutocompleteChange(event, value) {
      this.setState({search_tags: value});
      console.log("search_tags: ", this.state.search_tags);
  }



    render() {

    return (<Fragment>
      <div id="autocomplete">
                  <Autocomplete
                         multiple
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
          <br /><br />
          <ShowIssues search_tags={this.state.search_tags} />
          </div>
          </Fragment>
        );
    }
  }


function getTime(millis) {
  let time = new Date(millis).toDateString();

  return time;
}


class ShowIssues extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirection_path: '' ,
      id: '',
      object: '',
      table: [],
      search_tags: '',
      all_tags: ''
    };
  }


  componentDidMount() {
console.log('dupa');

axios.post(conf.api_url_base+'/api/issue/getAllTags',{tag: ''}, { withCredentials: true })
.then(res=>{
console.log(res);

  this.setState((state,props)=>{return {all_tags: res}});
})
.catch((e)=>{console.log('error: ', e)});

  }

  componentDidUpdate(prevProps) {

      if(prevProps.search_tags != this.props.search_tags ) {
        this.fetchData(this.props.search_tags);
      }
  }


  deleteItem(item) {

    console.log('item._id');
  console.log(item);
    axios.post(conf.api_url_base+'/api/issue/delete', {id: item}, { withCredentials: true })
    .then(res=>{
                this.fetchData(this.props.search_tags);
    })
    .catch((e)=>{console.log('error: ', e)});
  }


  redirect() {
    if(this.state.redirection_path !== '') {
      if(this.state.redirection_path === 'edit') {
        return <Redirect to={{ pathname: "/issue/edit/"+this.state.id }} />;
      }
      if(this.state.redirection_path === 'display') {
        return <Redirect to={{ pathname: "/issue/display/"+this.state.id }} />;
      }
    }
  }

  setRedirection(id, path) {
    this.setState((state,props)=>{
      return {redirection_path: path,
        id: id
      }
    }
);
}



renderTable(res) {
  if(res) {
  console.log('map: ', res);
  let tab = res.data.map((item)=>
  <tr key={item._id}>
    <td>{item.title}</td>

    <td><div>{item.tags}</div></td>
    <td>{item.username}</td>
    <td>{getTime(item.timestamp)}</td>
    <td>
    <IconButton onClick={()=>this.setRedirection(item._id, 'edit')}>
       <EditIcon/>
    </IconButton>
    <IconButton onClick={()=>this.deleteItem(item._id)}>
       <DeleteForeverIcon/>
    </IconButton>
    <IconButton onClick={()=>this.setRedirection(item._id, 'display')}>
    <VisibilityIcon/>
    </IconButton>
    </td>
  </tr>);

this.setState((state,props)=>{return {table: tab}}
);
  }
}

fetchData(tags) {
  console.log('fetching data...', tags);
  axios.post(conf.api_url_base+'/api/issue/getIssueByTag', {tags: tags}, { withCredentials: true })
  .then(res=>{
console.log('fetchData: ', res);

this.renderTable(res);

  })
  .catch((e)=>{console.log(e)});
}

render() {

    return(
      <Fragment>
      <div className="form">
      {this.redirect()}

<table>
<tbody>
{this.state.table}
</tbody>
</table>
</div>
</Fragment>
    );
  }
}

export default Issue;
