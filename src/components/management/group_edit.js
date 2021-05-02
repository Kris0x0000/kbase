import React, { Component, Fragment } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import * as getConf from "../../../src/conf.js";
import "../../global.css";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Navi from "../../components/navi/navi";
import Checkbox from "@material-ui/core/Checkbox";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Grid } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Tooltip from "@material-ui/core/Tooltip";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

class GroupEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table: [],
      users: [],
      redirection_path: "",
      is_authenticated: true,
      show_warning: false,
      warning_title: "",
      warning_body: "",
      is_admin: false,
      selected_users: [],
      selected_group:[],
      groups: [{name: ""}],
      is_checked: false,
      activeCheckboxes:[],
    };
  }

  componentDidMount() {
    if (localStorage.getItem("is_admin") === "true") {
      this.setState({ is_admin: true, usermode: false });
    }

    this.getAvailableUsers();
    this.getAllGroups();

    // if issue id in URL (/edit/id)
    if (this.props.match.params.id) {
      this.setState((state, props) => {
        return {
          editmode: true,
          id: this.props.match.params.id,
        };
      });
    }
}
    getAvailableUsers = () => {
      axios
        .post(
          getConf("api_url_base") + "/api/user/getAllUsers",
          {},
          { withCredentials: true }
        )
        .then((res) => {
        this.setState({users: res.data});
        })
        .catch((e) => {
          if (e === 401) {
            this.setState({ is_authenticated: false });
          }
        });
    };

    getAllGroups = () => {

      axios
        .post(
          getConf("api_url_base") + "/api/group/getallgroups",
          {},
          { withCredentials: true }
        )
        .then((res) => {

          this.setState({groups: res.data, });
          console.log(res.data);
        })
        .catch((e) => {
          if (e.response.status === 401) {

            this.setState({ is_authenticated: false });
          }
        });
    };


    checkIfChecked = (id) => {
      let found = this.state.activeCheckboxes.includes(id)
      if(found) {
        console.log("true");
        return true;
      } else {
        console.log("false");
        return false;
      }
    };

    handleCheck(id) {
        console.log(id);
      let found = this.state.activeCheckboxes.includes(id)
      if (found) {
        console.log('found');
        this.setState({
          //activeCheckboxes: this.state.activeCheckboxes.filter(x => x !== id)

        })
        return true;
      } else {
        console.log('not found');
        this.setState({
          //activeCheckboxes: [ ...this.state.activeCheckboxes, id ]
        })
        return false;
      }
    }

  handleSelectedGroup = (event) => {
    this.setState({activeCheckboxes:[]},() => {this.displayGroupMembers()});
    let gr = this.state.groups.find(element => element._id === event.target.value);
    this.setState({selected_group: event.target.value });
    console.log(gr.members);
    let arr=[]
    for(let i=0; i<gr.members.length;i++) {
      let found = this.state.activeCheckboxes.includes(gr.members[i].user_id)
      if(!found) {
        arr.push(gr.members[i].user_id);
      }
    }
      this.setState({activeCheckboxes: arr},() => {this.displayGroupMembers()});
    console.log(this.state.activeCheckboxes);
  };

  setCheckbox = (id) => {
    for(let chkbox of this.state.checkboxes) {
      if(chkbox === id) {
        return true;
    }
  }
  return false;
  };


  displayGroupMembers = () => {
    let array_of_elements = this.state.users
    let tab = array_of_elements.map((item) => (
      <FormControlLabel
        key={Math.random()}
        control={
          <Checkbox
           onChange={(event)=>this.handleCheck(event.target.value)}
           name={item.username}
            key={item._id}
            value={item._id}
            defaultChecked={this.checkIfChecked(item._id)}
            disabled={false}
            color="primary"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        }
        label={item.username}
      />
    ));

    this.setState({ table: tab });
  };

  submit(option) {

    if(option === "accept") {
      this.updateGroup();
    }

  }

  updateGroup = (id, members) => {
    axios
      .post(
        getConf("api_url_base") + "/api/group/updategroup",
        {id: id, members: members},
        { withCredentials: true }
      )
      .then((res) => {
        console.log("data", res.data);
      //  this.setState({groups: res.data});
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({ is_authenticated: false });
        }
      });
  };

  setRedirection(id, path) {
    if (path === "edit") {
      this.setState({ redirection_path: path, id: id });
    }

    if (path === "create") {
      this.setState({ redirection_path: path });
    }

    if (path === "back") {
      this.setState({ redirection_path: path });
    }
  }

  redirect() {
    if (this.state.redirection_path === "edit") {
      return (
        <Redirect
          push
          to={{
            pathname: "/management/user/edit/" + this.state.id,
            state: { prev_path: this.props.location.pathname },
          }}
        />
      );
    }

    if (this.state.redirection_path === "create") {
      return (
        <Redirect
          push
          to={{
            pathname: "/management/user/create",
            state: { prev_path: this.props.location.pathname },
          }}
        />
      );
    }

    if (this.state.redirection_path === "back") {
      //return <Redirect push to={{ pathname: this.state.prev_path}} />;
      return window.history.back();
    }
  }

  isAuthenticated() {
    if (!this.state.is_authenticated) {
      return (
        <Redirect
          to={{
            pathname: "/login",
            state: { prev_path: this.props.location.pathname },
          }}
        />
      );
    }
  }

  handletextfield(id, data) {
    this.setState({ name: data });
    console.log(this.state.name);
  }

  render() {
    let data = (
      <Fragment>
        <Dialog
          open={this.state.show_warning}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {this.state.warning_title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.warning_body}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.handleWarningClick(false)}
              color="primary"
            >
              Nie
            </Button>
            <Button
              onClick={() => this.handleWarningClick(true)}
              color="primary"
            >
              Tak
            </Button>
          </DialogActions>
        </Dialog>

        <Header />
        <Grid
          container
          alignItems="flex-start"
          justify="flex-start"
          direction="row"
        >
          <Navi location={this.props.location.pathname} />
        </Grid>
        <br />
        <br />
        <br />
        <br />
        <br />
        {this.isAuthenticated()}
        {this.redirect()}
        <div id="container">
          <FormControl>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.selected_group}
              onChange={(event) => this.handleSelectedGroup(event)}
            >
            {this.state.groups.map((i)=>(
        <MenuItem value={i._id} key={Math.random()} name={i.name}>
          {i.name}
        </MenuItem>
      ))}
            </Select>
          </FormControl>

          {this.state.table}
          <br />
        </div>
        <div className="bottom_navi">
          <Grid
            container
            alignItems="flex-end"
            justify="flex-start"
            direction="column"
            spacing={0}
          >
            <Tooltip title="Wróć">
              <IconButton
                color="secondary"
                onClick={() => {
                  this.setRedirection("", "back");
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>

            <IconButton
              color="primary"
              onClick={() => {
                this.submit("accept");
              }}
            >
              <DoneIcon />
            </IconButton>
          </Grid>
        </div>
        <Footer />
      </Fragment>
    );

    return data;
  }
}

export default GroupEdit;
