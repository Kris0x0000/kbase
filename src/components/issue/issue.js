import React, { Component, Fragment } from 'react';
import {TextField } from '@material-ui/core';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
import '../../global.css';
import { Autocomplete } from '@material-ui/lab';
import ShowIssues from './show_issues.js';
import { CircularProgress } from '@material-ui/core';
import Navi from '../../components/navi/navi';
import { Chip } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { ThemeProvider } from '@material-ui/styles';
import matchSorter from 'match-sorter';
import Header from '../header';
import { Grid } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

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
      <Grid container alignItems="flex-start" justify="flex-start" direction="row">
      <Navi /><Header/>
      </Grid>

      <br/>

      {this.isAuthenticated()}
      <div id="autocomplete">
      {this.showLoading()}
      <ThemeProvider theme={theme}>
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
                       </ThemeProvider>
          <br /><br /><br /><br />
            </div>
          <ShowIssues search_tags={this.state.search_tags} prev_path={this.props.location} />

          </Fragment>
        );
    }
  }

export default Issue;
