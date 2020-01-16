import React, { Component, Fragment } from 'react';
import '../global.css';
import logo from '../img/zikom_logo.png';


class Header extends Component {
  constructor(props){
    super(props);

    this.state = {

    };
  }

  render() {
    return(
      <Fragment>
      <div id="header">
        <img src={logo} alt="Logo" width="15%" height="15%" />   &nbsp; Baza wiedzy
        </div>
        <br/><br/>
      </Fragment>
    );
  }
}

export default Header;
