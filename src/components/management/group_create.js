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
import FormControlLabel from '@material-ui/core/FormControlLabel';

class GroupCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table: [],
      users: [],
      redirection_path: "",
      is_authenticated: true,
      logged_uname: "",
      show_warning: false,
      warning_title: "",
      warning_body: "",
      itemid: "",
      name: "",
      is_admin: false,
      selected_users: []
    };
  }



  componentDidMount() {
    if (localStorage.getItem("is_admin") === "true") {
      this.setState({ is_admin: true, usermode: false });
    }
    this.getAvailableUsers();

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
        // res.data.value_name
        //  res.data.username
        //  red.data._id
        this.displayAvailableUserOptions(res.data);
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({ is_authenticated: false });
        }
      });

  };

  handleChange = (event) => {
  this.setState({ selected_users: [...this.state.selected_users, {username: event.target.name, user_id: event.target.value}]});
};

  displayAvailableUserOptions = (array_of_elements) => {
    let tab = array_of_elements.map((item) => (

      <FormControlLabel
      key={item._id}
           control={
      <Checkbox
      name={item.username}
      key={item._id}
      value={item._id}
      onChange={(event) => this.handleChange(event)}
        disabled={false}
        color="primary"
        inputProps={{ "aria-label": "primary checkbox" }}
      />
    }
    label={item.username}
    />

    ));
console.log(tab);
this.setState({table: tab});
  };

  submit(option) {
    setTimeout(() => {
      if (option === "accept") {
        if (this.state.name === "") {
          this.setState({
            show_warning: true,
            warning_body: "Wypełnij prawidłowo wszyskie pola.",
          });
          setTimeout(() => {
            this.setState({ show_warning: false, warning_body: "" });
          }, 3000);
        } else {
          if (this.state.editmode && this.state.is_admin) {
            //console.log('editmode');

            axios
              .post(
                getConf("api_url_base") + "/api/group/edit",
                {
                  name: this.state.name,
                  members: this.state.selected_users
                },
                { withCredentials: true }
              )
              .then((res) => {
                this.setRedirection("/management/main");
              })
              .catch((e) => {
                console.log(e);
                if (e.response.status === 401) {
                  this.setState({ is_authenticated: false });
                }
              });
          } else if (!this.state.is_admin) {
            console.log("clicked");
            this.setRedirection("/home/");
          } else {
            axios
              .post(
                getConf("api_url_base") + "/api/group/create",
                {
                  name: this.state.name,
                  members: this.state.selected_users
                },
                { withCredentials: true }
              )
              .then((res) => {
                this.setRedirection("/management/main/");
              })
              .catch((e) => {
                if (e.response.status === 401) {
                  this.setState({ is_authenticated: false });
                }
              });
          }
        }
      } else {
        this.setRedirection("/management/main");
      } //accept
    }, 500);
  }

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
          <TextField
            value={this.state.name}
            fullWidth={true}
            autoComplete="off"
            error={this.state.error_uname}
            helperText={this.state.uname_helper}
            id="uname"
            label="nazwa użytkownika"
            type="text"
            variant="outlined"
            onChange={(r) => this.handletextfield(r.target.id, r.target.value)}
          />
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
export default GroupCreate;
