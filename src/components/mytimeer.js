import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';

    let millis;
    let timer;

class MyTimeer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      reset: false,
      time: 0,
      time_out: '',
      countdown: 0,
      isauthenticated: true,
      timer:''
    };
  }

  componentDidMount() {

timer = window.setInterval(this.getTimer, 1000);
  this.setState({time: this.getCurrentTimeInMillis() + this.props.time});
  }

  componentDidUpdate(prevProps, prevState) {

if(this.props.update !== prevProps.update) {

    clearInterval(timer);
    timer = window.setInterval(this.getTimer, 1000);
    this.setState({timer: timer});
    this.setState({time: this.getCurrentTimeInMillis() + this.props.time});
    }
  }


  minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
  }


  getCurrentTimeInMillis() {
    var d = new Date();
    var r = Date.now();
    return r;
  }

  isAuthenticated() {
    if(!this.state.isauthenticated) {
      return (<Redirect to={{ pathname: "/login" }} />);
    }
  }

  getTimer = () => {


    millis = this.state.time - this.getCurrentTimeInMillis();

    if(millis <= 0) {
        clearInterval(timer);
        this.setState({isauthenticated: false});
    }

    let s=millis/1000;
    let secs = Math.round(s) % 60;
    s = (s - secs) / 60;
    let mins = Math.round(s) % 60;
    let hrs = (s - mins) / 60;

        this.setState({time_out: this.minTwoDigits(mins)+':'+this.minTwoDigits(secs)});
  };


  render() {
    return(
      <Fragment>
      {this.isAuthenticated()}
     {this.state.time_out}
      </Fragment>
    );
  }

}

export default MyTimeer
