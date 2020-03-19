import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as getConf from '../../../src/conf.js';
import '../../global.css';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { CircularProgress } from '@material-ui/core';
import { Chip } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { Pagination } from '@material-ui/lab';
import Navi from '../../components/navi/navi';
import Header from '../header';
import Footer from '../footer';

let timeoutHandle;


class AllIssues extends Component {

  constructor(props) {
    super(props);

    this.state = {
      redirection_path: '' ,
      id: '',
      object: '',
      table: [],
      is_loading_set: false,
      is_authenticated: true,
      show_warning: false,
      warning_body: 'f',
      this_path:'',
      stats:{},
      item_to_delete: '',
      is_admin: false,
      warning_title: '',
      current_page: 1,
      issues_per_page: 20,
    };
  }


  setSessionTimeout = ()=>{
    timeoutHandle = setTimeout(()=>{
        this.setState({isauthenticated: false});
    }, getConf('session_timeout'));
  };


  componentDidMount(prevProps) {
this.setSessionTimeout();


    let is_admin = localStorage.getItem('is_admin');

    if(is_admin === 'true') {
          this.setState({is_admin: true});
        } else {
          this.setState({is_admin: false});
        }

this.setState({this_path: this.props.prev_path, is_loading_set: true});
axios.post(getConf('api_url_base')+'/api/issue/getAllIssues',{}, { withCredentials: true })
.then(res=>{

  this.setState({object: res.data, is_loading_set: false});
//  this.renderTableRows(res);
this.paginate(1);
})
.catch((e)=>{
if(e.response) {
if(e.response.status === 401) {
      this.setState({is_authenticated: false});
  }
}

});
  }

  componentDidUpdate(prevProps, prevState) {
    this.setSessionTimeout();
    if(prevState.current_page !== this.state.current_page ) {
    this.paginate(this.state.current_page);
  }

  }


  deleteItem(item) {

    axios.post(getConf('api_url_base')+'/api/issue/delete', {id: item}, { withCredentials: true })
    .then(res=>{
        this.fetchData(this.props.search_tags);
          this.setState({is_authenticated: true})
    })
    .catch((e)=>{
    if( e.response.status === 401) {
     this.setState({is_authenticated: false});
    }
    if( e.response.status === 405) {
     this.setState({warning_title: 'User error', show_warning: true, warning_body: 'Nie możesz usunąć tego wpisu ponieważ nie jesteś jego właścicielem.'});

    }
  });
  }


  redirect() {

      if(this.state.redirection_path === 'edit') {
               return (<Redirect push to={{ pathname: "/issue/edit/"+this.state.id, state: {prev_path: this.props.location.pathname, search_tags: this.props.search_tags} }} />);
            }

      if(this.state.redirection_path === 'display') {
        return <Redirect push to={{ pathname: "/issue/display/"+this.state.id, state: { prev_path: this.props.location.pathname, search_tags: this.state.search_tags } }} />;
      }

      if(this.state.redirection_path === 'back') {
      //  return <Redirect push to={{ pathname: this.props.location.state.prev_path, state: { prev_path: this.props.location.pathname}}} />;
      return window.history.back();
      }

      if(this.state.redirection_path === 'add') {
        return <Redirect push to={{ pathname: "/issue/create/", state: { prev_path: this.props.location.pathname}}} />;
      }

  }

  setRedirection(id, path) {

    if(path === 'back') {
      this.setState({redirection_path: path});
    }

    if(path === 'edit') {

    axios.post(getConf('api_url_base')+'/api/issue/isOwner', {id: id}, { withCredentials: true })
      .then(res=>{
        if(res.status === 200) {
        this.setState({redirection_path: path, id: id});
        }
      })
      .catch(e=>{
        if(e.response.status === 405) {
          this.setState({warning_title: 'Błąd', show_warning: true, warning_body: "Nie możesz edytować tego wpisu ponieważ nie jesteś jego właścicielem", redirection_path:''});

        }
      });

    }

    if(path === 'display') {
      this.setState({redirection_path: path, id: id});
    }
  }


showLoading() {
  if(this.state.is_loading_set) {
    return <CircularProgress size={64} />;
  }
}

limitString(txt) {
  if(txt.length >= 90) {
    return(txt.substr(0,90)+"...");
  } else {
  return txt;
  }
}


showEditButtor(itemowner, itemid) {

  let current_username = localStorage.getItem('username');
  if((itemowner === current_username) || (this.state.is_admin)) {
    return (
      <Tooltip title="Edytuj">
      <IconButton color="primary" onClick={()=>this.setRedirection(itemid, 'edit')}>
      <EditIcon/>
      </IconButton>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title="Edytuj">
      <IconButton color="primary" disabled={true} onClick={()=>this.setRedirection(itemid, 'edit')}>
      <EditIcon/>
      </IconButton>
      </Tooltip>
    );
  }
}


showDeleteButton(itemowner, itemid) {

  let current_username = localStorage.getItem('username');

if((itemowner === current_username) || (this.state.is_admin)) {
  return (

    <Tooltip title="Usuń">
        <IconButton color="secondary" onClick={()=>this.handleDeleteClick(itemid)}>
           <DeleteForeverIcon/>
        </IconButton>
        </Tooltip>
  );
} else {
  return (
    <Tooltip title="Usuń">
        <IconButton disabled={true} color="secondary" onClick={()=>this.handleDeleteClick(itemid)}>
           <DeleteForeverIcon />
        </IconButton>
        </Tooltip>
  );
}

}


renderTableRows(res) {
  this.setState({is_loading_set: true});
  if(res) {

    if(window.innerHeight < window.innerWidth) {

      let tab = res.sort((a, b) => parseFloat(b.create_timestamp) - parseFloat(a.create_timestamp)).map((item)=>

      <tr key={item._id} >
        <td onClick={()=>this.setRedirection(item._id, 'display')}>{this.limitString(item.title)}</td>
        <td key={item.index} onClick={()=>this.setRedirection(item._id, 'display')}>{item.tags.sort().map((element)=><Fragment><Chip key={element.index} variant="outlined" size="small" label={element}/> </Fragment>)}</td>
        <td onClick={()=>this.setRedirection(item._id, 'display')}>{item.creator}</td>
        <td onClick={()=>this.setRedirection(item._id, 'display')}>{getTime(item.create_timestamp)}</td>
        <td>

        <Tooltip title="Pokaż">
            <IconButton color="primary" onClick={()=>this.setRedirection(item._id, 'display')}>
            <VisibilityIcon/>
            </IconButton>
        </Tooltip>
    {this.showEditButtor(item.creator, item._id)}

    {this.showDeleteButton(item.creator, item._id)}

        </td>
      </tr>);
      this.setState((state,props)=>{return {table: tab}});

    } else {
      let tab = res.data.sort((a, b) => parseFloat(b.create_timestamp) - parseFloat(a.create_timestamp)).map((item)=>

      <tr key={item._id} >
        <td onClick={()=>this.setRedirection(item._id, 'display')}>{this.limitString(item.title)}</td>
        <td onClick={()=>this.setRedirection(item._id, 'display')}>{item.tags.map((element)=><Fragment><Chip variant="outlined" size="small" label={element}/> </Fragment>)}</td>

        <td>
        <Tooltip title="Pokaż">
            <IconButton color="primary" onClick={()=>this.setRedirection(item._id, 'display')}>
            <VisibilityIcon/>
            </IconButton>
        </Tooltip>


        <Tooltip title="Edytuj">
        <IconButton color="primary" onClick={()=>this.setRedirection(item._id, 'edit')}>
        <EditIcon/>
        </IconButton>
        </Tooltip>


    {this.showDeleteButton(item.creator, item._id)}

        </td>
      </tr>);
      this.setState((state,props)=>{return {table: tab}});
    }
  }


  this.setState({is_loading_set: false});
}

isAuthenticated() {
  if(!this.state.is_authenticated) {
    return (<Redirect to={{ pathname: "/login" }} />);
  }
}


tableHeader() {
  if(window.innerHeight < window.innerWidth) {
  return(

     <table id="issuelist">
    <colgroup>
      <col style={{ width: '20%'}}/>
      <col style={{ width: '30%'}}/>
      <col style={{ width: '10%'}}/>
      <col style={{ width: '10%'}}/>
      <col style={{ width: '10%'}}/>

    </colgroup>
    <thead>
          <tr>
              <th>Tytuł</th>
              <th>Tagi</th>
              <th>Dodane przez</th>
              <th>W dniu</th>
              <th>Opcje</th>
          </tr>
      </thead>
    <tbody>
    {this.state.table}
    </tbody>
    </table>
  );
  } else {

    return(
       <table id="issuelist">
      <colgroup>
        <col style={{ width: '40%'}}/>
        <col style={{ width: '40%'}}/>
        <col style={{ width: '20%'}}/>

      </colgroup>
      <thead>
            <tr>
                <th>Tytuł</th>
                <th>Tagi</th>
                <th>Opcje</th>
            </tr>
        </thead>
      <tbody>
      {this.state.table}
      </tbody>
      </table>
    );
  }
}


handleDeleteClick(item) {

this.setState({show_warning: true, item_to_delete: item, warning_body: 'Dobrze się zastanów, ta operacja jest nieodwracalna.', warning_title: "Czy napewno chcesz usunąć ten wpis?"});
}

handleDeleteWarningClick(acc) {
  console.log("acc", acc);
  if(acc) {

  this.deleteItem(this.state.item_to_delete);
  this.setState({show_warning: false});
  } else {
    this.setState({show_warning: false});
  }
}


iterateOverElements(arr) {

  let it =arr.map(i=>
<Chip variant="outlined" label={i.name +" ("+ i.occurrences+")"}/>
  );
  return it;
}

paginate(page) {

  let indexOfLastElement = this.state.current_page * this.state.issues_per_page;
  let indexOfFirstElement = indexOfLastElement - this.state.issues_per_page;
  let currentIssues = this.state.object.slice(indexOfFirstElement, indexOfLastElement);
  this.renderTableRows(currentIssues);
  this.setState({current_page: page});

}


render() {

    return(

      <Fragment>
<Header />
<Navi location={this.props.location.pathname}/>
<br/>
<Grid container style={{ marginTop: '40px' }} alignItems="flex-start" justify="center" direction="row">
<Pagination
count={Math.ceil(this.state.object.length/this.state.issues_per_page)}
onChange={(event: object, page: number) => this.paginate(page)}
 /> <br/>
</Grid>

      <Grid container style={{ marginTop: '30px' }} alignItems="flex-start" justify="center" direction="row">

      <Grid item align="center" xs>
    <div>{this.tableHeader()}</div>
    </Grid>
</Grid>
      <div id="loading">{this.showLoading()}</div>
      <div id="container">

      {this.redirect()}
{this.isAuthenticated()}

</div>
<div className="bottom_navi">
<Tooltip title="Wróć">
<IconButton color="secondary" onClick={()=>{this.setRedirection('','back')}}>
   <ArrowBackIcon/>
</IconButton>
</Tooltip>

</div>


<Dialog
      open={this.state.show_warning}
      onClose={()=>this.handleDeleteWarningClick(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{this.state.warning_title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {this.state.warning_body}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>this.handleDeleteWarningClick(false)} color="primary">
          Nie
        </Button>
        <Button onClick={()=>this.handleDeleteWarningClick(true)} color="primary">
          Tak
        </Button>
      </DialogActions>
    </Dialog>

<Grid container style={{ marginTop: '30px' }} alignItems="flex-start" justify="center" direction="row">
    <Pagination
    count={Math.ceil(this.state.object.length/this.state.issues_per_page)}
    onChange={(event: object, page: number) => this.paginate(page)}
     /> <br/>
     </Grid>
 <Footer />
</Fragment>

    );
  }
}


function getTime(millis) {
  let time = new Date(millis).toLocaleDateString();
  return time;
}


export default AllIssues;
