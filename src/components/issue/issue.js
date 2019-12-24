import React, { Component, Fragment } from 'react';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import './issue.css';
import { styled } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';



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
      showIssues: false
    };
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



    render() {

    return (<Fragment>
          <br /><br />
          <TextField id="tags" label="tags" type="text" variant="outlined" onChange={(r)=>this.handletags(r.target.value)} />
          <br /><br />
          <br /><br />
          <ShowIssues search_tags={this.state.search_tags} />
          </Fragment>
        );
    }
  }


function getTime(millis) {
  let time = new Date(millis).toDateString();

  return time;
}


class ShowIssues extends Component {
  //function DisplayResult(props) {
  constructor(props) {
    super(props);
    this.state = {
      isredirected: false ,
      id: '',
      object: '',
      table: [],
      search_tags: '',
      all_tags: ''
    };
  }


  componentDidMount() {
console.log('dupa');

axios.post('http://localhost:1234/api/issue/getAllTags',{tag: ''}, { withCredentials: true })
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
    axios.post('http://localhost:1234/api/issue/delete', {id: item}, { withCredentials: true })
    .then(res=>{
                this.fetchData(this.props.search_tags);
    })
    .catch((e)=>{console.log('error: ', e)});
  }


  redirect() {
    if(this.state.isredirected) {
      return <Redirect to={{ pathname: "/issue/edit/"+this.state.id }} />;
    }
  }

  setResult(data) {
    this.setState((state,props)=>{
      return {isredirected: true,
        id: data
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
    <td>{item.body}</td>
    <td><div>{item.tags}</div></td>
    <td>{item.username}</td>
    <td>{getTime(item.timestamp)}</td>
    <td>
    <IconButton onClick={()=>this.setResult(item._id)}>
       <EditIcon/>
    </IconButton>
    <IconButton onClick={()=>this.deleteItem(item._id)}>
       <DeleteForeverIcon/>
    </IconButton>
    </td>
  </tr>);

this.setState((state,props)=>{return {table: tab}}
);
  }
}

fetchData(tags) {
  console.log('fetching data...', tags);
  axios.post('http://localhost:1234/api/issue/getIssueByTag', {tags: tags}, { withCredentials: true })
  .then(res=>{
console.log('fetchData: ', res);

this.renderTable(res);

  })
  .catch((e)=>{console.log(e)});
}

render() {

    return(
      <Fragment>
      <div>
      {this.redirect()}
      </div>
<table>
<tbody>
{this.state.table}
</tbody>
</table>
</Fragment>
    );
  }
}

export default Issue;
