import React, { Component, Fragment } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import * as getConf from "../../../src/conf.js";
import "../../global.css";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { CircularProgress } from "@material-ui/core";
import { Chip } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CountUp from "react-countup";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

class ShowIssues extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirection_path: "",
      id: "",
      object: "",
      table: [],
      search_tags: [],
      all_tags: "",
      is_loading_set: false,
      is_authenticated: true,
      show_warning: false,
      warning_body: "f",
      this_path: "",
      stats: {},
      tag_count: "",
      issue_count: "",
      top_tags: [],
      item_to_delete: "",
      is_admin: false,
      warning_title: "",
      last_tags: [],
    };
  }

  componentDidMount(prevProps) {
    let is_admin = localStorage.getItem("is_admin");

    if (is_admin === "true") {
      this.setState({ is_admin: true });
    } else {
      this.setState({ is_admin: false });
    }

    this.setState({
      search_tags: this.props.search_tags,
      this_path: this.props.prev_path,
      is_loading_set: true,
    });
    axios
      .post(
        getConf("api_url_base") + "/api/issue/getAllTags",
        { tag: "" },
        { withCredentials: true }
      )
      .then((res) => {
        this.setState({
          is_loading_set: false,
          is_authenticated: true,
          all_tags: res,
          tags_count: res.data.length,
        });
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            this.setState({ is_authenticated: false });
          }
        }
      });

    axios
      .post(
        getConf("api_url_base") + "/api/issue/getStats",
        {},
        { withCredentials: true }
      )
      .then((res) => {
        this.setState({
          stats: res.data,
          tag_count: res.data.tag_count,
          issue_count: res.data.issue_count,
          top_tags: res.data.top_tags,
        });
        //console.log("stats: ", res.data);
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status === 401) {
          this.setState({ is_authenticated: false });
        }
      });

    axios
      .post(
        getConf("api_url_base") + "/api/user/getLastTags",
        {},
        { withCredentials: true }
      )
      .then((res) => {
        this.setState({ last_tags: res.data });
        //console.log("last tags: ", res.data);
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status === 401) {
          this.setState({ is_authenticated: false });
        }
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.search_tags !== this.props.search_tags) {
      this.fetchData(this.props.search_tags);
      this.setState({
        search_tags: this.props.search_tags,
        this_path: this.props.prev_path,
      });

      axios
        .post(
          getConf("api_url_base") + "/api/user/getLastTags",
          {},
          { withCredentials: true }
        )
        .then((res) => {
          this.setState({ last_tags: res.data });
          //console.log("last tags: ", res.data);
        })
        .catch((e) => {
          console.log(e);
          if (e.response.status === 401) {
            this.setState({ is_authenticated: false });
          }
        });
    }
  }

  deleteItem(item) {
    axios
      .post(
        getConf("api_url_base") + "/api/issue/delete",
        { id: item },
        { withCredentials: true }
      )
      .then((res) => {
        this.fetchData(this.props.search_tags);
        this.setState({ is_authenticated: true });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({ is_authenticated: false });
        }
        if (e.response.status === 405) {
          this.setState({
            warning_title: "User error",
            show_warning: true,
            warning_body:
              "Nie możesz usunąć tego wpisu ponieważ nie jesteś jego właścicielem.",
          });
        }
      });
  }

  redirect() {
    if (this.state.redirection_path === "edit") {
      return (
        <Redirect
          push
          to={{
            pathname: "/issue/edit/" + this.state.id,
            state: {
              prev_path: this.state.this_path,
              search_tags: this.props.search_tags,
            },
          }}
        />
      );
    }

    if (this.state.redirection_path === "display") {
      return (
        <Redirect
          push
          to={{
            pathname: "/issue/display/" + this.state.id,
            state: {
              prev_path: this.state.this_path,
              search_tags: this.state.search_tags,
            },
          }}
        />
      );
    }

    if (this.state.redirection_path === "back") {
      return (
        <Redirect
          push
          to={{
            pathname: "/home/",
            state: { prev_path: this.state.this_path },
          }}
        />
      );
    }

    if (this.state.redirection_path === "add") {
      return (
        <Redirect
          push
          to={{
            pathname: "/issue/create/",
            state: { prev_path: this.state.this_path },
          }}
        />
      );
    }
  }

  setRedirection(id, path) {
    if (path === "back") {
      this.setState({ redirection_path: path });
    }

    if (path === "edit") {
      axios
        .post(
          getConf("api_url_base") + "/api/issue/isOwner",
          { id: id },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            this.setState({ redirection_path: path, id: id });
          }
        })
        .catch((e) => {
          if (e.response.status === 405) {
            this.setState({
              warning_title: "Błąd",
              show_warning: true,
              warning_body:
                "Nie możesz edytować tego wpisu ponieważ nie jesteś jego właścicielem",
              redirection_path: "",
            });
          }
        });
    }

    if (path === "display") {
      this.setState({ redirection_path: path, id: id });
    }
  }

  showLoading() {
    if (this.state.is_loading_set) {
      return <CircularProgress size={64} />;
    }
  }

  limitString(txt) {
    if (txt.length >= 90) {
      return txt.substr(0, 90) + "...";
    } else {
      return txt;
    }
  }

  showEditButtor(itemowner, itemid) {
    let current_username = localStorage.getItem("username");
    if (itemowner === current_username || this.state.is_admin) {
      return (
        <Tooltip title="Edytuj">
          <IconButton
            color="primary"
            onClick={() => this.setRedirection(itemid, "edit")}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title="Edytuj">
          <IconButton
            color="primary"
            disabled={true}
            onClick={() => this.setRedirection(itemid, "edit")}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      );
    }
  }

  showDeleteButton(itemowner, itemid) {
    let current_username = localStorage.getItem("username");

    if (itemowner === current_username || this.state.is_admin) {
      return (
        <Tooltip title="Usuń">
          <IconButton
            color="secondary"
            onClick={() => this.handleDeleteClick(itemid)}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title="Usuń">
          <IconButton
            disabled={true}
            color="secondary"
            onClick={() => this.handleDeleteClick(itemid)}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      );
    }
  }

  renderTableRows(res) {
    this.setState({ is_loading_set: true });
    if (res) {
      if (window.innerHeight < window.innerWidth) {
        let tab = res.data
          .sort(
            (a, b) =>
              parseFloat(b.create_timestamp) - parseFloat(a.create_timestamp)
          )
          .map((item) => (
            <tr key={item._id}>
              <td onClick={() => this.setRedirection(item._id, "display")}>
                {this.limitString(item.title)}
              </td>
              <td onClick={() => this.setRedirection(item._id, "display")}>
                {item.tags.sort().map((element) => (
                  <Fragment>
                    <Chip
                      key={element}
                      variant="outlined"
                      size="small"
                      label={element}
                    />{" "}
                  </Fragment>
                ))}
              </td>
              <td onClick={() => this.setRedirection(item._id, "display")}>
                {item.creator}
              </td>
              <td onClick={() => this.setRedirection(item._id, "display")}>
                {getTime(item.create_timestamp)}
              </td>
              <td>
                <Tooltip title="Pokaż">
                  <IconButton
                    color="primary"
                    onClick={() => this.setRedirection(item._id, "display")}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>

                {this.showEditButtor(item.creator, item._id)}

                {this.showDeleteButton(item.creator, item._id)}
              </td>
            </tr>
          ));
        this.setState((state, props) => {
          return { table: tab };
        });
      } else {
        let tab = res.data
          .sort(
            (a, b) =>
              parseFloat(b.create_timestamp) - parseFloat(a.create_timestamp)
          )
          .map((item) => (
            <tr key={item._id}>
              <td onClick={() => this.setRedirection(item._id, "display")}>
                {this.limitString(item.title)}
              </td>
              <td onClick={() => this.setRedirection(item._id, "display")}>
                {item.tags.map((element) => (
                  <Fragment>
                    <Chip variant="outlined" size="small" label={element} />{" "}
                  </Fragment>
                ))}
              </td>

              <td>
                <Tooltip title="Pokaż">
                  <IconButton
                    color="primary"
                    onClick={() => this.setRedirection(item._id, "display")}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edytuj">
                  <IconButton
                    color="primary"
                    onClick={() => this.setRedirection(item._id, "edit")}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                {this.showDeleteButton(item.creator, item._id)}
              </td>
            </tr>
          ));
        this.setState((state, props) => {
          return { table: tab };
        });
      }
    }

    this.setState({ is_loading_set: false });
  }

  isAuthenticated() {
    if (!this.state.is_authenticated) {
      return <Redirect to={{ pathname: "/login" }} />;
    }
  }

  fetchData(tags) {
    this.setState({ is_loading_set: true });
    axios
      .post(
        getConf("api_url_base") + "/api/issue/getIssueByTag",
        { tags: tags },
        { withCredentials: true }
      )
      .then((res) => {
        this.setState({ object: res.data, is_loading_set: false });
        this.renderTableRows(res);
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status === 401) {
          this.setState({ is_authenticated: false });
        }
      });
  }

  tableHeader() {
    if (window.innerHeight < window.innerWidth) {
      return (
        <table id="issuelist">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "15%" }} />
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
          <tbody>{this.state.table}</tbody>
        </table>
      );
    } else {
      return (
        <table id="issuelist">
          <colgroup>
            <col style={{ width: "40%" }} />
            <col style={{ width: "40%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Tytuł</th>
              <th>Tagi</th>
              <th>Opcje</th>
            </tr>
          </thead>
          <tbody>{this.state.table}</tbody>
        </table>
      );
    }
  }

  chooseComp() {
    if (this.state.search_tags) {
      if (this.state.search_tags.length > 0) {
        return <div>{this.tableHeader()}</div>;
      } else {
        return this.showStats();
      }
    } else {
      return this.showStats();
    }
  }

  handleDeleteClick(item) {
    this.setState({
      show_warning: true,
      item_to_delete: item,
      warning_body: "Dobrze się zastanów, ta operacja jest nieodwracalna.",
      warning_title: "Czy napewno chcesz usunąć ten wpis?",
    });
  }

  handleDeleteWarningClick(acc) {
    console.log("acc", acc);
    if (acc) {
      this.deleteItem(this.state.item_to_delete);
      this.setState({ show_warning: false });
    } else {
      this.setState({ show_warning: false });
    }
  }

  iterateOverElements(arr) {
    let it = arr.map((i) => (
      <Chip
        variant="outlined"
        key={i._id}
        label={i.name + " (" + i.occurrences + ")"}
      />
    ));
    return it;
  }

  iterateOverTags(arr) {
    let it = arr.map((i) => <Chip variant="outlined" key={i} label={i} />);
    return it;
  }

  showStats() {
    return (
      <div className="stats">
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={8}>
            <Card
              style={{ border: "#2196f3" }}
              className="stats_card"
              variant="outlined"
            ></Card>
          </Grid>
          <Grid item xs={6}>
            <Card
              style={{ border: "#2196f3" }}
              className="stats_card"
              variant="outlined"
            >
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  <span>
                    Liczba tagów:{" "}
                    <CountUp
                      redraw={true}
                      duration={4}
                      start={0}
                      end={parseInt(this.state.tag_count, 10)}
                      delay={0}
                    ></CountUp>
                  </span>
                </Typography>
                <Typography variant="h5" component="h2">
                  <span>
                    Liczba wpisów:{" "}
                    <CountUp
                      redraw={true}
                      duration={4}
                      start={0}
                      end={parseInt(this.state.tag_count, 10)}
                      delay={0}
                    ></CountUp>
                  </span>
                </Typography>
                <Typography color="textSecondary" component={"span"}>
                  <br />
                  Najpopularniejsze tagi: <br />
                  {this.iterateOverElements(this.state.top_tags)}
                </Typography>
                <br />

                <span style={{ color: "#2196f3", fontSize: "12px" }}>
                  * Statystyki są aktualizowane co godzinę.
                </span>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }

  render() {
    return (
      <Fragment>
        {this.chooseComp()}
        <div id="loading">{this.showLoading()}</div>
        <div id="container">
          {this.redirect()}

          {this.isAuthenticated()}
        </div>
        <div className="bottom_navi">
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
        </div>

        <Dialog
          open={this.state.show_warning}
          onClose={() => this.handleDeleteWarningClick(false)}
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
              onClick={() => this.handleDeleteWarningClick(false)}
              color="primary"
            >
              Nie
            </Button>
            <Button
              onClick={() => this.handleDeleteWarningClick(true)}
              color="primary"
            >
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
