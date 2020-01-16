import React, { Component, Fragment } from 'react';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as conf from '../../../src/conf.js';
import '../../global.css';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { CircularProgress } from '@material-ui/core';
import { Chip } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { ThemeProvider } from '@material-ui/styles';
import Navi from '../../components/navi/navi';
import Checkbox from '@material-ui/core/Checkbox';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Grid } from '@material-ui/core';


const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

class Management extends Component {

  constructor(props) {
    super(props);
     this.state = {
        table: [],
        users: [],
        redirection_path:'',
     };
  }


  componentDidMount() {

    axios.post(conf.api_url_base+'/api/user/getAllUsers',{}, { withCredentials: true })
      .then(res=>{
        console.log(res);
        //this.setState({users: res.data});
        this.renderTableRows(res);
      })
      .catch(e=>{console.log(e)});

  }


  renderTableRows(res) {

    if(res) {

    let tab = res.data.map((item)=>
    <tr key={item._id}>
      <td>{item.username}</td>
      <td>
      <Checkbox
    checked={item.is_admin}
    color="primary"
    inputProps={{ 'aria-label': 'primary checkbox' }}
  />
      </td>
      <td>
  <ThemeProvider theme={theme}>
  <IconButton color="primary" onClick={()=>this.setRedirection(item._id, 'edit')}>
  <EditIcon/>
  </IconButton>
        <IconButton color="primary" onClick={()=>this.deleteItem(item._id)}>
         <DeleteForeverIcon/>
      </IconButton>
  </ThemeProvider>
      </td>
    </tr>);
  this.setState((state,props)=>{return {table: tab}});
    }
  }



  setRedirection(id, path) {

    if(path === 'edit') {
        this.setState({redirection_path: path, id: id});
    }

    if(path === 'create') {
      this.setState({redirection_path: path});
    }
  }


  redirect() {

      if(this.state.redirection_path === 'edit') {
               return (<Redirect to={{ pathname: "/user/edit/"+this.state.id, state: {prev_path: this.state.prev_path, search_tags: this.props.search_tags} }} />);
            }

      if(this.state.redirection_path === 'create') {
        return <Redirect to={{ pathname: "/management/user/create"}} />;
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
      <Navi />
      {this.redirect()}
      <div id="container">
{this.state.table.length>0? table : null}

<Grid container alignItems="flex-start" justify="flex-end" direction="row">
<ThemeProvider theme={theme}>
      <IconButton color="primary" onClick={()=>this.setRedirection('','create')}>
       <AddCircleIcon/>
    </IconButton>
</ThemeProvider>
</Grid>
</div>

      </Fragment>
    );
  }
}

export default Management;
