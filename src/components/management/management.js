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



class Management extends Component {

  constructor(props) {
    super(props);
     this.state = {
        table: [],
        users: [],
        redirection_path:'',
        is_authenticated:true,
     };
  }


  componentDidMount() {

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

  <IconButton color="primary" onClick={()=>this.setRedirection(item._id, 'edit')}>
  <EditIcon/>
  </IconButton>
        <IconButton color="secondary" onClick={()=>this.deleteItem(item._id)}>
         <DeleteForeverIcon/>
      </IconButton>

      </td>
    </tr>);
  this.setState((state,props)=>{return {table: tab}});
    }
  }

  deleteItem(item) {

    axios.post(getConf('api_url_base')+'/api/user/delete', {id: item}, { withCredentials: true })
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
               return (<Redirect to={{ pathname: "/management/user/edit/"+this.state.id, state: {prev_path: this.state.prev_path} }} />);
            }

      if(this.state.redirection_path === 'create') {
        return <Redirect to={{ pathname: "/management/user/create"}} />;
      }

      if(this.state.redirection_path === 'back') {
        return <Redirect to={{ pathname: this.state.prev_path}} />;
      }

  }


  isAuthenticated() {
    if(!this.state.is_authenticated) {
      return <Redirect to={{ pathname: "/login"}} />;
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
      <Header/>
      <Grid container alignItems="flex-start" justify="flex-start" direction="row">
      <Navi />
      </Grid><br/><br /><br />
      <br/><br/>
      {this.isAuthenticated()}
      {this.redirect()}
      <div id="container">
{this.state.table.length>0? table : null}
<br/>



</div>
<div class="bottom_navi">
<Grid container alignItems="flex-start" justify="flex-end" direction="row">
<Tooltip title="Wróć">
<IconButton color="secondary" onClick={()=>{this.setRedirection('','back')}}>
   <ArrowBackIcon/>
</IconButton>
</Tooltip>
<Tooltip title="Dodaj">
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
