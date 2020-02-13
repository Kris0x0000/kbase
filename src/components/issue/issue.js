import React, { Component, Fragment } from 'react';
import {TextField } from '@material-ui/core';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as getConf from '../../../src/conf.js';
import '../../global.css';
import { Autocomplete } from '@material-ui/lab';
import ShowIssues from './show_issues.js';
import { CircularProgress } from '@material-ui/core';
import Navi from '../../components/navi/navi';
import { Chip } from '@material-ui/core';
import matchSorter from 'match-sorter';
import Header from '../header';
import { Grid } from '@material-ui/core';
import Footer from '../footer';


const filterOptions = (options, { inputValue }) =>
  matchSorter(options, inputValue, {threshold: matchSorter.rankings.STRING_CASE_ACRONYM});


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
      is_loading_set: false,
      is_redirected: false,
      path:'',

    };
  }



  componentDidMount() {
    if(this.props.location.state) {

      this.setState({search_tags: this.props.location.state.search_tags})
    }

      this.setState({is_loading_set: true});
    axios.post(getConf('api_url_base')+'/api/issue/getalltags',{tag: ''}, { withCredentials: true })
    .then(res=>{
      this.setState({is_loading_set: false, all_tags: res.data, isauthenticated: true});
    })
    .catch((e)=>{
  if( e.response.status === 401) {
    this.setState({isauthenticated: false})
  }
      }
    );
  }

  redirect() {
    if(this.state.is_redirected) {
      return <Redirect to={{ pathname: this.props.location.state.prev_path, state: {prev_path: this.props.location.pathname} }} />;
    }
  }

  setRedirection(path) {
    this.setState({path: path, is_redirected: true});
  }



  handletags(data) {
    //let data1 = data;
    setTimeout((data1)=>{
      this.setState((state,props)=>{
         return {search_tags: data.split(",")};
      });

    }, 1000);
  }

  handleAutocompleteChange(event, value) {
      this.setState({search_tags: value});
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
      <Header/>
      <Grid container alignItems="flex-start" justify="flex-start" direction="row">
      <Navi location='/issue/find' search_tags={this.state.search_tags}/>
      </Grid>

      <br/><br/><br/>

      {this.isAuthenticated()}
      <div id="autocomplete">
      {this.showLoading()}

                  <Autocomplete

                         multiple
                         filterOptions={filterOptions}
                         onChange={(event, value) => this.handleAutocompleteChange(event, value)}
                         id="tags-standard"
                         loadingText="Ładowanie..."
                         options={this.state.all_tags}
                         getOptionLabel={option => option}
                         renderTags={(value, getTagProps) =>
                           value.map((option, index) => (
                             <Chip  variant="outlined" label={option} color="primary" style={{colorPrimary: 'green'}} {...getTagProps({ index })} />
                           ))
                         }

                         renderInput={params => (

                           <TextField
                             {...params}
                             variant="outlined"
                             label="Wybierz tagi..."
                             color="primary"
                             fullWidth
                           />
                         )}
                       />

          <br /><br /><br /><br />
            </div>
          <ShowIssues search_tags={this.state.search_tags} prev_path={this.props.location.pathname} />
          <br /><br /><br /><br />
          <Footer/>
          </Fragment>
        );
    }
  }

export default Issue;
