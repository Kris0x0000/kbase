import React, { Component, Fragment } from 'react';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
import './management.css';

class Management extends Component {

  constructor(props) {
    super(props);
     this.state = {

     };
  }


  componentDidMount() {
    
    axios.post(conf.api_url_base+'/api/issue/getIssueById', {id: this.props.match.params.id}, { withCredentials: true })
      .then(res=>{
        console.log(res);
        this.setState({body: res.data.body, id: this.props.match.params.id, title: res.data.title});
      })
      .catch(e=>{console.log(e)});

  }

  render() {
    return (
      <Fragment>

      </Fragment>
    );
  }
}

export default Management;
