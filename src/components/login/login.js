import React, { Component, Fragment } from "react";
import { TextField } from "@material-ui/core";
import axios from "axios";
import { Redirect } from "react-router-dom";
import * as getConf from "../../../src/conf.js";
import "../../global.css";
import { Grid } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import Header from "../header";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
      isredirected: false,
      prev_path: "",
      error: false,
      helper_text: "",
    };
  }

  componentDidMount() {
    localStorage.clear();

    if (this.props.location.state) {
      if (this.props.location.state.prev_path) {
        this.setState({ prev_path: this.props.location.state.prev_path });
      }
    }
  }

  handleLogin(data) {
    this.setState((state, props) => {
      return { login: data };
    });
  }

  handlePassword(data) {
    this.setState((state, props) => {
      return { password: data };
    });
  }

  redirect() {
    if (this.state.isredirected) {
      if (this.state.prev_path !== "") {
        return <Redirect push to={{ pathname: this.state.prev_path }} />;
      } else {
        return <Redirect push to={{ pathname: `/home` }} />;
      }
    }
  }

  asyncSetItem = async (name, value) => {
    await localStorage.setItem(name, value);
  };

  suubmit = () => {
    axios
      .post(
        getConf("api_url_base") + "/login",
        { username: this.state.login, password: this.state.password },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("username", this.state.login);

          axios
            .post(
              getConf("api_url_base") + "/api/user/isadmin",
              {},
              { withCredentials: true }
            )
            .then((res) => {
              //this.asyncSetItem('is_admin','true');
              localStorage.setItem("is_admin", "true");
              this.sa();
            })
            .catch((e) => {
              localStorage.setItem("is_admin", "false");
              this.sa();
            });
        }
      })
      .catch((e) => {
        console.log(e);
        this.setState({ helper_text: "Błędny login lub hasło", error: true });
      });
  };

  sa = () => {
    setTimeout(() => {
      this.setState((state, props) => {
        return { isredirected: true };
      });
    }, 50);
  };

  handleKeyPress = (target) => {
    if (target.charCode === 13) {
      this.suubmit();
    }
  };

  render() {
    //  const { classes } = this.props;

    return (
      <Fragment>
        <Header />
        <div id="loginform">
          {this.redirect()}

          <TextField
            error={this.state.error}
            helperText={this.state.helper_text}
            color="primary"
            id="Login"
            label="Login"
            type="text"
            variant="outlined"
            onChange={(r) => this.handleLogin(r.target.value)}
          />

          <br />
          <br />
          <TextField
            error={this.state.error}
            helperText={this.state.helper_text}
            id="Password"
            color="primary"
            label="Hasło"
            type="password"
            variant="outlined"
            onKeyPress={this.handleKeyPress}
            onChange={(r) => this.handlePassword(r.target.value)}
          />
          <br />
          <br />

          <Grid container alignItems="center" justify="center" direction="row">
            <IconButton
              color="primary"
              onClick={() => {
                this.suubmit();
              }}
            >
              <DoneIcon />
            </IconButton>
          </Grid>
        </div>
      </Fragment>
    );
  }
}

export default Login;
