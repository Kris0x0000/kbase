import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
import './issue.css';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { CircularProgress } from '@material-ui/core';
import { Chip } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});


class ShowIssues extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirection_path: '' ,
      id: '',
      object: '',
      table: [],
      search_tags: '',
      all_tags: '',
      is_loading_set: false,
      is_authenticated: true,
      once: false
    };
  }


  componentDidMount(prevProps) {


this.setState({search_tags: this.props.search_tags, prev_path: this.props.prev_path});
  //this.fetchData(this.props.search_tags);
//
axios.post(conf.api_url_base+'/api/issue/getAllTags',{tag: ''}, { withCredentials: true })
.then(res=>{
  this.setState({is_authenticated: true})
  this.setState((state,props)=>{return {all_tags: res}});
})
.catch((e)=>{console.log('error: ', e);
if( e.response.status === 401) {
      this.setState({is_authenticated: false})
  }
});

  }

  componentDidUpdate(prevProps, prevState) {

      if(prevState.search_tags !== this.props.search_tags ) {

        console.log("prevState.search_tags !== this.props.search_tags");

        this.fetchData(this.props.search_tags);
          this.setState({search_tags: this.props.search_tags, prev_path: this.props.prev_path});
      }
  }


  deleteItem(item) {

    console.log('item._id');
    console.log(item);
    axios.post(conf.api_url_base+'/api/issue/delete', {id: item}, { withCredentials: true })
    .then(res=>{
        this.fetchData(this.props.search_tags);
          this.setState({is_authenticated: true})
    })
    .catch((e)=>{console.log('error: ', e);
    if( e.response.status === 401) {
     this.setState({is_authenticated: false});
    }
  });

  }


  redirect() {
    if(this.state.redirection_path !== '') {
      if(this.state.redirection_path === 'edit') {
        console.log("this.props.location", this.props.location);
        return <Redirect to={{ pathname: "/issue/edit/"+this.state.id, state: {prev_path: this.state.prev_path, search_tags: this.props.search_tags} }} />;
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

showLoading() {
  if(this.state.is_loading_set) {
    return <CircularProgress size={64} />;
  }
}

limitString(txt) {
  if(txt.length >= 60) {
    return(txt.substr(0,60)+"...");
  } else {
  return txt;
}
}



renderTableRows(res) {

  let table = <table className="issuelist">
  <colgroup>
    <col style={{ width: '30%'}}/>
    <col style={{ width: '25%'}}/>
    <col style={{ width: '10%'}}/>
    <col style={{ width: '10%'}}/>
    <col style={{ width: '10%'}}/>

  </colgroup>
  <thead>
        <tr>
            <th>Tytuł</th>
            <th>Tagi</th>
            <th>Użytkownik</th>
            <th>Data modyfikacji</th>
            <th>Opcje</th>
        </tr>
    </thead>
  <tbody>
  {this.state.table}
  </tbody>
  </table>;


  if(res) {

  let tab = res.data.map((item)=>

  <tr key={item._id}>
    <td>{this.limitString(item.title)}</td>
    <td>{item.tags.map((element)=><Fragment><Chip variant="outlined" label={element}/> </Fragment>)}</td>
    <td>{item.username}</td>
    <td>{getTime(item.timestamp)}</td>
    <td>
<ThemeProvider theme={theme}>
    <IconButton color="primary" onClick={()=>this.setRedirection(item._id, 'edit')}>
    <EditIcon/>
    </IconButton>
    <IconButton color="primary" onClick={()=>this.deleteItem(item._id)}>
       <DeleteForeverIcon/>
    </IconButton>
    <IconButton color="primary" onClick={()=>this.setRedirection(item._id, 'display')}>
    <VisibilityIcon/>
    </IconButton>
</ThemeProvider>
    </td>
  </tr>);



this.setState((state,props)=>{return {table: tab}});
  }
}

isAuthenticated() {
  if(!this.state.is_authenticated) {
    return (<Redirect to={{ pathname: "/login" }} />);
  }
}

fetchData(tags) {
  this.setState({is_loading_set: true});
  axios.post(conf.api_url_base+'/api/issue/getIssueByTag', {tags: tags}, { withCredentials: true })
  .then(res=>{
    this.setState({is_loading_set: false});
    this.renderTableRows(res);

  })
  .catch((e)=>{console.log(e)
    if( e.response.status === 401) {
     this.setState({is_authenticated: false});

    }
  });

}

render() {

  let table = <table className="issuelist">
  <colgroup>
    <col style={{ width: '30%'}}/>
    <col style={{ width: '25%'}}/>
    <col style={{ width: '10%'}}/>
    <col style={{ width: '10%'}}/>
    <col style={{ width: '10%'}}/>

  </colgroup>
  <thead>
        <tr>
            <th>Tytuł</th>
            <th>Tagi</th>
            <th>Użytkownik</th>
            <th>Data modyfikacji</th>
            <th>Opcje</th>
        </tr>
    </thead>
  <tbody>
  {this.state.table}
  </tbody>
  </table>;

    return(
      <Fragment>
      <div id="loading">{this.showLoading()}</div>
      <div className="form">

      {this.redirect()}
{this.state.table.length>0? table : null}
{this.isAuthenticated()}
</div>
</Fragment>
    );
  }
}


function getTime(millis) {
  let time = new Date(millis).toLocaleDateString();

  return time;
}


export default ShowIssues;
