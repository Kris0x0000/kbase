import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as getConf from '../../../src/conf.js';
import '../../global.css';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Navi from '../../components/navi/navi';
import Checkbox from '@material-ui/core/Checkbox';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Grid } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Tooltip from '@material-ui/core/Tooltip';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

let timeoutHandle;

class Management extends Component {

  constructor(props) {
    super(props);
     this.state = {
        table: [],
        users: [],
        redirection_path:'',
        is_authenticated:true,
        logged_uname: '',
        show_warning:false,
        warning_title:'',
        warning_body:'',
        itemid:'',
        username:'',
     };
  }

  setSessionTimeout = ()=>{
    timeoutHandle = setTimeout(()=>{
        this.setState({is_authenticated: false});
    }, getConf('session_timeout'));
  };


componentDidUpdate() {
  clearTimeout(timeoutHandle);
  this.setSessionTimeout();
}

  componentDidMount() {
    this.setSessionTimeout();

    axios.post(getConf('api_url_base')+'/api/user/getAllUsers',{}, { withCredentials: true })
      .then(res=>{
        this.renderTableRows(res);
      })
      .catch(e=>{console.log(e);
        if( e.response.status === 401) {
          this.setState({is_authenticated: false});
        }
      });

      let logged_uname = localStorage.getItem('username');
      this.setState({logged_uname: logged_uname});


  }


  fetchData() {
    axios.post(getConf('api_url_base')+'/api/user/getAllUsers',{}, { withCredentials: true })
      .then(res=>{
        this.renderTableRows(res);
      })
      .catch(e=>{console.log(e);
        if( e.response.status === 401) {
          this.setState({is_authenticated: false});
        }
      });
  }

  handleDelete = (itemid, username)=> {
    this.setState({itemid: itemid, username: username, show_warning: true, warning_title:'Czy napewno chcesz usunąć tego użytkownika?',warning_body:'Ta operacja jest nieodwracalna.'});
  };

  handleWarningClick = (accept) => {
    console.log('accept: ',accept);
    console.log('this.state.itemid: ',this.state.itemid);
    console.log('this.state.username: ',this.state.username);
    if(accept) {
        this.deleteItem(this.state.itemid, this.state.username);
        this.setState({show_warning: false});
    } else {
      this.setState({show_warning: false});
    }
  };

renderDeleteButton(item) {
  let uname = this.state.logged_uname;
  if(item.username !== uname || !(item.is_admin)) {
    return (
      <Tooltip title="Usuń">
      <IconButton color="secondary" onClick={()=>this.handleDelete(item._id, item.username)}>
      <DeleteForeverIcon/>
      </IconButton>
      </Tooltip>);
    } else {
        return (
          <Tooltip title="Usuń">
      <IconButton disabled={true} color="secondary" onClick={()=>this.handleDelete(item._id, item.username)}>
      <DeleteForeverIcon/>
      </IconButton>
    </Tooltip> );
    }
  }

  renderTableRows(res) {

    if(res) {

    let tab = res.data.map((item)=>
    <tr key={item._id}>
      <td>{item.username}</td>
      <td>
      <Checkbox
    checked={item.is_admin}
    disabled={true}
    color="primary"
    inputProps={{ 'aria-label': 'primary checkbox' }}
  />
      </td>
      <td>
<Tooltip title="Edytuj">
  <IconButton color="primary" onClick={()=>this.setRedirection(item._id, 'edit')}>
  <EditIcon/>
  </IconButton>
  </Tooltip>
    {this.renderDeleteButton(item)}

      </td>
    </tr>);
  this.setState((state,props)=>{return {table: tab}});
    }
  }

  deleteItem(id, username) {
    let uname = this.state.logged_uname;
if(username !== uname) {
    axios.post(getConf('api_url_base')+'/api/user/delete', {id: id}, { withCredentials: true })
    .then(res=>{
        this.fetchData();
          this.setState({is_authenticated: true})
    })
    .catch((e)=>{console.log('error: ', e);
    if( e.response.status === 401) {
      this.setState({is_authenticated: false});
    }
      });
    }
  }



  setRedirection(id, path) {

    if(path === 'edit') {
        this.setState({redirection_path: path, id: id});
    }

    if(path === 'create') {
      this.setState({redirection_path: path});
    }

    if(path === 'back') {
      this.setState({redirection_path: path});
    }
  }


  redirect() {

      if(this.state.redirection_path === 'edit') {
               return (<Redirect push to={{ pathname: "/management/user/edit/"+this.state.id, state: {prev_path: this.props.location.pathname} }} />);
            }

      if(this.state.redirection_path === 'create') {
        return <Redirect push to={{ pathname: "/management/user/create", state: {prev_path: this.props.location.pathname}}} />;
      }

      if(this.state.redirection_path === 'back') {
        //return <Redirect push to={{ pathname: this.state.prev_path}} />;
        return window.history.back();
      }
  }


  isAuthenticated() {
    if(!this.state.is_authenticated) {
      return (<Redirect to={{ pathname: "/login", state: { prev_path: this.props.location.pathname } }} />);
    }
  }



  render() {

    let table = <table className="issuelist">
    <colgroup>
      <col style={{ width: '20%'}}/>
      <col style={{ width: '20%'}}/>
      <col style={{ width: '20%'}}/>

    </colgroup>
    <thead>
          <tr>
              <th>Nazwa użytkownika</th>
              <th>Administrator</th>
              <th>Opcje</th>
          </tr>
      </thead>
    <tbody>
    {this.state.table}
    </tbody>
    </table>;

    return (
      <Fragment>

      <Dialog
            open={this.state.show_warning}

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
              <Button onClick={()=>this.handleWarningClick(false)} color="primary">
                Nie
              </Button>
              <Button onClick={()=>this.handleWarningClick(true)} color="primary">
                Tak
              </Button>
            </DialogActions>
          </Dialog>


      <Header/>
      <Grid container alignItems="flex-start" justify="flex-start" direction="row">
      <Navi location={this.props.location.pathname}/>
      </Grid><br/><br /><br />
      <br/><br/>
      {this.isAuthenticated()}
      {this.redirect()}
      <div id="container">
{this.state.table.length>0? table : null}
<br/>

</div>
<div class="bottom_navi">
<Grid container alignItems="flex-end" justify="flex-start" direction="column" spacing={0}>
<Tooltip title="Wróć">
<IconButton color="secondary" onClick={()=>{this.setRedirection('','back')}}>
   <ArrowBackIcon/>
</IconButton>
</Tooltip>
<Tooltip title="Dodaj użytkownika">
<IconButton color="primary" onClick={()=>this.setRedirection('','create')}>
 <AddCircleIcon/>
</IconButton>
</Tooltip>
</Grid>
</div>
<Footer/>
      </Fragment>
    );
  }
}

export default Management;
