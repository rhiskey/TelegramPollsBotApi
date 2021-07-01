/* eslint-disable no-undef */
/* eslint-disable no-console */
import React, { Component } from 'react'
//import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
//import { sql } from 'mssql';
//import {AllPollsTable} from './components/AllPollsTable';
//import './css/AllPollsTable.css';
import BarChart from './components/BarChart';

import LogRocket from 'logrocket';
LogRocket.init('mzsypm/test1');

const pollsLink = "/pollresults";

// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
// });

//React container
//const MainPage = () => {
class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      done: undefined,
      loading: undefined,
      pollResults: [],
    };

  }

  // state = {
  // }

  componentDidMount() {
    //Грузим данные из бд
    let self = this;
    //let api = apiLink;
    // setTimeout(() => {
    //Адрес исправить 
    //fetch(apiLink + 'pollresults', {

    fetch('/pollresults', {
      method: 'GET'
    }).then(function (response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    }).then(function (data) {
      self.setState({ loading: true });
      self.setState({ pollResults: data.recordsets[0] });

      //console.log(data.recordsets[0]);
      // setTimeout(() => {
      //     self.setState({ done: true });
      // }, 1000);
    }).catch(err => {
      console.log('Error fetching API results!', err);
    })
    // }, 100);

    //AllPolssTable(pollResults);

  }

  componentWillUnmount() {
    this.setState({ loading: true, pollResults: undefined, done: false })
  }

  render() {

    //const classes = useStyles();

    return (
      <div className="content">
        <h1>FlowXO Polls2DB API</h1>
        <center>
          <p className="description">API для обработки результатов опросов.<br></br>
          Оправь на этот адрес POST запрос из FlowXO</p>
          <div className="flow-xo-logo"></div>
          <div className="div-table-poll" >
            <h3>Результаты опросов:</h3>
            <TableContainer component={Paper}>
              <Table className="polls-table" aria-label="polls table">
                <caption>Данные из базы данных. Цифры 1-10 - номера вопросов. 1-правильный ответ, 0 - неправильный.</caption>
                <TableHead>
                  {/* <TableCell>#</TableCell> */}
                  <TableRow>
                    <TableCell align="right">Название события</TableCell>
                    <TableCell align="right">Дата</TableCell>
                    <TableCell align="right">Никнейм</TableCell>
                    <TableCell align="right">1</TableCell>
                    <TableCell align="right">2</TableCell>
                    <TableCell align="right">3</TableCell>
                    <TableCell align="right">4</TableCell>
                    <TableCell align="right">5</TableCell>
                    <TableCell align="right">6</TableCell>
                    <TableCell align="right">7</TableCell>
                    <TableCell align="right">8</TableCell>
                    <TableCell align="right">9</TableCell>
                    <TableCell align="right">10</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.pollResults.map((collumn) => (
                    <TableRow key={collumn.id}>
                      <TableCell align="right">{collumn.eventName}</TableCell>
                      <TableCell align="right">{collumn.time}</TableCell>
                      {/* Время преобразовать в понятный формат */}
                      <TableCell align="right">{collumn.name}</TableCell>
                      <TableCell align="right">{collumn.q1}</TableCell>
                      <TableCell align="right">{collumn.q2}</TableCell>
                      <TableCell align="right">{collumn.q3}</TableCell>
                      <TableCell align="right">{collumn.q4}</TableCell>
                      <TableCell align="right">{collumn.q5}</TableCell>
                      <TableCell align="right">{collumn.q6}</TableCell>
                      <TableCell align="right">{collumn.q7}</TableCell>
                      <TableCell align="right">{collumn.q8}</TableCell>
                      <TableCell align="right">{collumn.q9}</TableCell>
                      <TableCell align="right">{collumn.q10}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          </div>

          <BarChart data={this.state.pollResults} />

          <a href={pollsLink}>Результаты опросов в JSON</a>
          <p className="description">Автор: Киселев В.</p>


        </center>
      </div>
    )
  }

}
//const PieChart2 = ({ data }) => {<h1>{data.eventName}</h1>};

export default MainPage

