import React, { Component, Fragment } from 'react';

    let millis;
    let timer;

class MyTimeer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      reset: false,
      time: 0,
      time_out: '',
    };
  }

  componentDidMount() {
timer = window.setInterval(this.getTimer, 1000);
  this.setState({time: this.props.time});
  }

  componentDidUpdate(prevProps, prevState) {
if(this.props.update !== prevProps.update) {

    clearInterval(timer);
    timer = window.setInterval(this.getTimer, 1000);
      this.setState({time: this.props.time});
    }
  }


  minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
  }

  getTimer = () => {
    millis = this.state.time - 1000;

    let s=millis/1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    let hrs = (s - mins) / 60;

        this.setState({time: millis, time_out: this.minTwoDigits(mins)+':'+this.minTwoDigits(secs)});
  };


  render() {
    return(
      <Fragment>
     {this.state.time_out}
      </Fragment>
    );
  }

}

export default MyTimeer
