import React, { Component, Fragment } from 'react';
import '../global.css';
import Navi from './navi/navi';
import Header from './header';
import Footer from './footer';
import { Grid } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { Redirect } from 'react-router-dom';



class Help extends Component {
  constructor(props){
    super(props);

    this.state = {
      is_redirected: false,
      prev_path: '',
    };
  }

  componentDidMount() {

    if(this.props.location.state) {
      if(this.props.location.state.prev_path) {
        this.setState({prev_path: this.props.location.state.prev_path});
      }
    }
  }


  setRedirection(path) {
    this.setState({prev_path: path, is_redirected: true});
  }

  redirect() {
    if(this.state.is_redirected) {
        return (<Redirect to={{pathname: this.state.prev_path}} />);
    }
  }


  render() {
    return(

      <Fragment>
      <Header/>
      {this.redirect()}
      <Grid container alignItems="flex-start" justify="flex-start" direction="row">
      <Navi />
      </Grid><br/><br /><br />
      <div className="help">
      <h3>1.	Wyszukiwanie.</h3><br/>
W celu rozpoczęcia wyszukiwania wpisów należy kliknąć w ikonę lupy na stronie głównej aplikacji.<br/>
Wyszukiwanie odbywa się za pomocą tagów. W polu „Wybierz tagi…” należy wybrać co najmniej jeden tag. Każdy kolejny tag zawęża zbiór wpisów.
<br/><br/>
<b>Przykład :</b><br/>
Chcemy znaleźć rozwiązanie następującego problemu: „Automatyczne kopie zapasowe w Windows Server 2008 przestały się wykonywać. Bład: 57.”<br/><br/>

W polu wyszukiwania tagów wpisujemy „windows”. Pojawi się lista wszystkich tagów zawierających w sobie słowo windows np. „windows 7”,”microsoft windows 10”,”windows server 2008”. Wybieramy najbardziej pasujący „windows server 2008”. Wyświetli się lista wpisów zawierających ten tag. Jeżeli wpisów jest zbyt dużo wyszukujemy kolejny tag.

<br/><br/><br/>
<h3>2.	Dodawanie wpisów.</h3><br/>
W celu rozpoczęcia wyszukiwania wpisów należy kliknąć w ikonę „plus” na stronie głównej aplikacji.
Ekran dodawania wpisów zawiera 3 pola tekstowe:
<br/><br/>
<b>•	Tytuł:</b> krótki opis problemu np. Eksport firmy w programie płatnik do SQL.
<br/><br/>
<b>•	Opis:</b> Dokładny opis problemu i jego rozwiązanie.
<br/><br/>
<b>•	Tagi:</b> tagi po których będzie można wyszukać problem.
<br/><br/>
Podczas dodawania tagów w pierwszej kolejności należy korzystać z tagów już istniejących. Dopiero gdy upewnimy się że nie ma odpowiedniego tagu dodajemy własny (wpisując nazwę + Enter).
<br/><br/><br/>
<h3>
3.	Zasady tworzenia tagów.</h3><br/>

•	Używamy słów kluczowych, po których łatwo będzie można wyszukać nasz wpis (np. nazwa systemu, numer  błędu, nazwa klienta).
<br/><br/>
•	Używamy rzeczowników.
<br/><br/>
•	Jeżeli tag składa się z kilku wyrazów robimy odstępy przy pomocy spacji.
<br/><br/>
•	Jeżeli jest taka możliwość dodajemy tag z nazwą klienta (lub kilka jeżeli problem występuje u kilku klientów).
<br/><br/><br/>

<h3>4. Automatyczna walidacja tagów.</h3><br/>
Aplikacja automatycznie poprawia niektóre tagi w celu ich unifikacji.<br/><br/>
<b>Przykłady:</b><br/><br/>
- zamina "-" na spację.<br/>
- zamiana "_" na spację.<br/>
- zamiana wszytkich liter na małe.<br/>
        </div>
        <br /><br /><br /><br />
        <div class="bottom_navi">
        <Tooltip title="Wróć">
        <IconButton color="secondary" onClick={()=>{this.setRedirection('/home')}}>
           <ArrowBackIcon/>
        </IconButton>
        </Tooltip>
        </div>
        <Footer/>
      </Fragment>
    );
  }
}

export default Help;
