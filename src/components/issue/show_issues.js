import React, { Component, Fragment } from 'react';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
import './issue.css';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import VisibilityIcon from '@material-ui/icons/Visibility';




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


  componentDidMount(prevProps) {
console.log("componentDidMount: ",this.state.search_tags);
if(this.props.location) {
console.log(this.props.location.state.search_tags);
}
//if(prevProps.search_tags != this.props.search_tags ) {
console.log("prevs...");
this.setState({search_tags: this.props.search_tags});
  this.fetchData(this.props.search_tags);
//
axios.post(conf.api_url_base+'/api/issue/getAllTags',{tag: ''}, { withCredentials: true })
.then(res=>{
console.log(res);

  this.setState((state,props)=>{return {all_tags: res}});
})
.catch((e)=>{console.log('error: ', e)});



  }

  componentDidUpdate(prevProps) {
console.log("componentDidUpdate: ",this.state.search_tags);
      if(prevProps.search_tags != this.props.search_tags ) {
console.log("prevs...");
/// ! sprawdzić
        this.setState({search_tags: this.props.search_tags});
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
        console.log('display: ',this.state.search_tags)
        return <Redirect to={{ pathname: "/issue/display/"+this.state.id, state: { search_tags: this.state.search_tags } }} />;
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


function getTime(millis) {
  let time = new Date(millis).toDateString();

  return time;
}


export default ShowIssues;
