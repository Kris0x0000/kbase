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
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarContent } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CountUp from 'react-countup';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';




class ShowIssues extends Component {

  constructor(props) {
    super(props);

    this.state = {
      redirection_path: '' ,
      id: '',
      object: '',
      table: [],
      search_tags: [],
      all_tags: '',
      is_loading_set: false,
      is_authenticated: true,
      once: false,
      show_warning: false,
      warning_body: '',
      this_path:'',
      stats:{},
      tag_count:'',
      issue_count:'',
      open_warning_delete: false,
      item_to_delete: '',
      is_admin: false
    };
  }


  componentDidMount(prevProps) {

    let is_admin = localStorage.getItem('is_admin');
    if(is_admin) {
          this.setState({is_admin: true});
        }

this.setState({search_tags: this.props.search_tags, this_path: this.props.prev_path, is_loading_set: true});
axios.post(getConf('api_url_base')+'/api/issue/getAllTags',{tag: ''}, { withCredentials: true })
.then(res=>{
  this.setState({is_loading_set: false, is_authenticated: true, all_tags: res, tags_count: res.data.length});
})
.catch((e)=>{
if(e.response) {
if(e.response.status === 401) {
      this.setState({is_authenticated: false});
  }
}

});

axios.post(getConf('api_url_base')+'/api/issue/getStats', {}, { withCredentials: true })
.then(res=>{
  this.setState({stats: res.data});
  this.setState({tag_count: res.data.tag_count, issue_count: res.data.issue_count});
console.log("stats: ", res.data);
})
.catch((e)=>{console.log(e)
  if( e.response.status === 401) {
   this.setState({is_authenticated: false});
  }
});



  }

  componentDidUpdate(prevProps, prevState) {

      if(prevState.search_tags !== this.props.search_tags ) {
        this.fetchData(this.props.search_tags);
          this.setState({search_tags: this.props.search_tags, this_path: this.props.prev_path});
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
     this.setState({show_warning: true, warning_body: "Nie możesz usunąć tego wpisu ponieważ nie jesteś jego właścicielem."});
     setTimeout(()=>{
         this.setState({show_warning: false});
     }, 2000);
    }
  });
  }


  redirect() {

      if(this.state.redirection_path === 'edit') {
               return (<Redirect to={{ pathname: "/issue/edit/"+this.state.id, state: {prev_path: this.state.this_path, search_tags: this.props.search_tags} }} />);
            }

      if(this.state.redirection_path === 'display') {
        return <Redirect to={{ pathname: "/issue/display/"+this.state.id, state: { prev_path: this.state.this_path, search_tags: this.state.search_tags } }} />;
      }

      if(this.state.redirection_path === 'back') {
        return <Redirect to={{ pathname: "/home/", state: { prev_path: this.state.this_path}}} />;
      }

      if(this.state.redirection_path === 'add') {
        return <Redirect to={{ pathname: "/issue/create/", state: { prev_path: this.state.this_path}}} />;
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
          this.setState({show_warning: true, warning_body: "Nie możesz edytować tego wpisu ponieważ nie jesteś jego właścicielem", redirection_path:''});
          setTimeout(()=>{
              this.setState({show_warning: false});
          }, 2000);
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


showDeleteButton(itemowner, itemid) {
  let current_username = localStorage.getItem('username');
if((itemowner === current_username) || this.state.is_admin) {
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
        <IconButton disabled="true" color="secondary" onClick={()=>this.handleDeleteClick(itemid)}>
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
      let tab = res.data.map((item)=>

      <tr key={item._id} >
        <td onClick={()=>this.setRedirection(item._id, 'display')}>{this.limitString(item.title)}</td>
        <td onClick={()=>this.setRedirection(item._id, 'display')}>{item.tags.map((element)=><Fragment><Chip variant="outlined" size="small" label={element}/> </Fragment>)}</td>
        <td onClick={()=>this.setRedirection(item._id, 'display')}>{item.creator}</td>
        <td onClick={()=>this.setRedirection(item._id, 'display')}>{getTime(item.create_timestamp)}</td>
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

    } else {
      let tab = res.data.map((item)=>

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

fetchData(tags) {
  this.setState({is_loading_set: true});
  axios.post(getConf('api_url_base')+'/api/issue/getIssueByTag', {tags: tags}, { withCredentials: true })
  .then(res=>{
    this.setState({object: res.data, is_loading_set: false});
    this.renderTableRows(res);

  })
  .catch((e)=>{console.log(e)
    if( e.response.status === 401) {
     this.setState({is_authenticated: false});
    }
  });

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


chooseComp() {
  if(this.state.search_tags) {
    if(this.state.search_tags.length > 0) {
  return (
    <div>{this.tableHeader()}</div>
  );

}    else {
return this.showStats();
  }
} else {
  return this.showStats();
  }
}



handleDeleteClick(item) {

this.setState({open_warning_delete: true, item_to_delete: item});
}

handleDeleteWarningClick(acc) {
  console.log("acc", acc);
  if(acc) {

  this.deleteItem(this.state.item_to_delete);
  this.setState({open_warning_delete: false});
  } else {
    this.setState({open_warning_delete: false});
  }
}




showStats() {
  return (




<div>
<Grid container className="stats">
<Grid item xs justify="center">

    <p>Liczba tagów: <CountUp redraw={true} duration={4} start={0} end={this.state.tag_count} delay={0}></CountUp></p>


    <p>Liczba wpisów: <CountUp redraw={true} duration={4} start={0} end={this.state.issue_count} delay={0}></CountUp></p>

    </Grid>
</Grid>
</div>

  );
}



render() {

    return(
      <Fragment>



{this.chooseComp()}
      <Snackbar variant="warning"
      open={this.state.show_warning}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
      <SnackbarContent message={this.state.warning_body} style={{backgroundColor:'#cc0000'}}/>
      </Snackbar>
      <div id="loading">{this.showLoading()}</div>
      <div id="container">

      {this.redirect()}

{this.isAuthenticated()}

</div>
<div class="bottom_navi">
<Tooltip title="Wróć">
<IconButton color="secondary" onClick={()=>{this.setRedirection('','back')}}>
   <ArrowBackIcon/>
</IconButton>
</Tooltip>

</div>


<Dialog
      open={this.state.open_warning_delete}
      onClose={()=>this.handleDeleteWarningClick(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Czy napewno chcesz usunąć ten wpis?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Dobrze się zastanów, ta operacja jest nieodwracalna.
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



</Fragment>
    );
  }
}


function getTime(millis) {
  let time = new Date(millis).toLocaleDateString();
  return time;
}


export default ShowIssues;
