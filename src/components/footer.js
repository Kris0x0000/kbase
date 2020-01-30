import React, { Component, Fragment } from 'react';
import '../global.css';


class Footer extends Component {
  constructor(props){
    super(props);

    this.state = {

    };
  }

  render() {
    return(
      <Fragment>
      <div className="footer">
      <br/>

        <hr className="hr-text"/>

        Baza Wiedzy by Krzysztof Kosowski, 2020-2021. Wszelkie prawa zastrzeżone.
        </div>
      </Fragment>
    );
  }
}

export default Footer;
