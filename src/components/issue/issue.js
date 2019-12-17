import React, { Component, Fragment } from 'react';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { Router, Redirect } from 'react-router-dom';
import './issue.css';
import { styled } from '@material-ui/core/styles';

const MyButton = styled(Button)({
  justifyContent: 'center'
});

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
      object:''
    };
  }

  handletags(data) {
    this.setState((state,props)=>{
      return {search_tags: data.split(",")};
    }
    );
  }

  setResultt(data) {
    this.setState((state,props)=>{
      return {object: data};
    });


  }

  submit() {
  console.log(this.state);
    axios.post('http://localhost:1234/api/issue/getByTag', {tags: this.state.search_tags}, { withCredentials: true })
    .then(res=>{
      this.setResultt(res);
    })
    .catch((e)=>{console.log(e)});
  }

    render() {

    return (<Fragment>
          <br /><br />
          <TextField id="tags" label="tags" type="text" variant="outlined" onChange={(r)=>this.handletags(r.target.value)} />
          <br /><br />
          <Button variant="outlined" onClick={()=>{this.submit()}}>Submit</Button>
          <br /><br />

          <ShowIssues object={this.state.object} />

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
      id: ''
    };
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

  //edit(object, id)  {

//  let v = object.find(x=>x._id === id);
//  console.log(v);
//  }

render() {



  if(!this.props.object) {
    return null;
  }

  const tab = this.props.object.data.map((item)=>
  <tr key={item._id}>
    <td>{item.title}</td>
    <td>{item.body}</td>
    <td><div>{item.tags}</div></td>
    <td>{item.username}</td>
    <td>{getTime(item.timestamp)}</td>
    <td><MyButton id="form_button" variant="outlined" onClick={()=>this.setResult(item._id)}>Edit</MyButton></td>
  </tr>);

    return(
      <Fragment>
      <div>
      {this.redirect()}
      </div>
<table>
<tbody>

{tab}

</tbody>
</table>
</Fragment>
    );
  }
}

export default Issue;
