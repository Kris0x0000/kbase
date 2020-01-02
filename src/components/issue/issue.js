import React, { Component, Fragment } from 'react';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
import './issue.css';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Autocomplete } from '@material-ui/lab';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ShowIssues from './show_issues.js';
import { CircularProgress } from '@material-ui/core';



class Issue extends Component {

  constructor(props) {
    super(props);
    this.state = {
      search_tags:'',
      body:'',
      title:'',
      username:'',
      timestamp:'',
      result:'',
      id: '',
      showIssues: false,
      all_tags: [],
      isauthenticated: true,
      is_loading_set: false
    };
  }


  componentDidMount() {


    if(this.props.location.state) {
      console.log("this.props.location.state: ",this.props.location.state);
      this.setState({search_tags: this.props.location.state.search_tags})
    }

      this.setState({is_loading_set: true});
    axios.post(conf.api_url_base+'/api/issue/getalltags',{tag: ''}, { withCredentials: true })
    .then(res=>{
      this.setState({is_loading_set: false, all_tags: res.data, isauthenticated: true});
    })
    .catch((e)=>{
  if( e.response.status === 401) {
    this.setState({isauthenticated: false})
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

  isAuthenticated() {
    if(!this.state.isauthenticated) {
      return (<Redirect to={{ pathname: "/login" }} />);
    }
  }

  showLoading() {
    if(this.state.is_loading_set) {
      return(<div id="loading"><CircularProgress size={64}/></div>);
    }
  }

    render() {

    return (<Fragment>

      {this.isAuthenticated()}
      <div id="autocomplete">
      {this.showLoading()}
                  <Autocomplete

                         multiple
                         onChange={(event, value) => this.handleAutocompleteChange(event, value)}
                         id="tags-standard"
                         loading="true"
                         loadingText="Ładowanie..."
                         options={this.state.all_tags}
                         getOptionLabel={option => option}

                         renderInput={params => (

                           <TextField
                             {...params}
                             variant="standard"
                             label="Wybierz tagi..."
                             
                             fullWidth
                           />
                         )}
                       />
          <br /><br /><br /><br />
            </div>
          <ShowIssues search_tags={this.state.search_tags} prev_path={this.props.location} />

          </Fragment>
        );
    }
  }

export default Issue;
