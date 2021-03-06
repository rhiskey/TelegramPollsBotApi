/* eslint-disable no-console */
/* eslint-disable no-undef */
import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'

import sql from 'mssql'
import bodyParser from 'body-parser'
require('dotenv').config();
const cors = require('cors');
const mysql = require('mysql2');

var db_config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_DATABASENAME
}

// Testing EXTERNAL DB - MySQL
const isTest = process.env.ISTEST; // 1/0
var test_db_config = {
  host: process.env.TEST_DB_HOST,
  user: process.env.TEST_DB_USER,
  database: process.env.TEST_DB_DATABASENAME,
  password: process.env.TEST_DB_PASSWORD
}

// Testing EXTERNAL DB - MySQL

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Variable deployPath is set in web.config and must match
// the path of server.js in virtual directory.
// If server.js is run from command line:
//   "C:\GitRepo\TelegramPollsBotApi\dist> node server.js"
// deployPath is set to empty string.
var deployPath = process.env.deployPath || "";

const app = express(),
  DIST_DIR = __dirname,
  HTML_FILE = path.join(DIST_DIR, 'index.html'),
  compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

//Parser
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(urlencoded({extended:false}), express.json());
app.use(bodyParser.json());
// Parse URL-encoded bodies (as sent by HTML forms)
//app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cors());

////From instagive
//app.use(express.static(path.join(__dirname, 'public')));


app.get(deployPath + '/', (req, res, next) => {
  //app.get('*', (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
    if (err) {
      return next(err)
    }
    res.set('content-type', 'text/html')
    res.send(result)
    //res.sendfile(__dirname + '/index.html');
    //res.render('index', {});
    res.end()
  })

});

// ???????????????? ???????????? ???? POST ?????????????? ???? FlowXO ?? ?????????????????? ???? ?? ???? 
app.post(deployPath + "/", urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);
  var headers = req.headers;
  var data = req.body;
  //?????????????????????? ???? ?????????? ???????? -> ????????     "attributes": {
  //"Meropriyatie": "???????????? ???????? 2020" }
  var eventNameFromJSON; //?????????????????? ?????????????????????? ????

  for (var attributename in data) {
    console.log(attributename + ": " + data[attributename]);
    for (var sub in data[attributename]) {
      //console.log(subattr+": "+data[attributename][subattr])

      for (var subsub in data[attributename][sub]) {
        //console.log(subsub+ ": "+ data[attributename][sub][subsub])
        if (subsub == "Meropriyatie") //?????????? ?????????? ??????????????????
        {
          //console.log(data[attributename][sub][subsub]);
          //??????????????????
          eventNameFromJSON = data[attributename][sub][subsub];
        }
      }
    }
  }
  console.log("???????????????? ?????????????????????? ?????? ????:", eventNameFromJSON);
  //?????????????????????????? =25AB 8458 2020 ?? ?????????????? ?????????????? 
  var eventName = eventNameFromJSON;

  // console.log("?????????? ??????????????????=", eventName);
  var Name = req.get('Name');
  var Time = req.get('Time');

  //Regex Questions
  var re = /[Q|q]\d/;

  //Store Questions and Answers
  var qnaMap = new Map();

  for (var hdr in headers) {
    //console.log(hdr+": " + headers[hdr]);

    //???????? ?????????????????? ?????????????????? - > ???????????????? headers[hdr]
    if (re.test(hdr) == true) {
      qnaMap.set(hdr, headers[hdr]);
    }
  }

  //Format string to DATETIME
  console.log("???????? ???? ??????????????:", Time);
  var timeStamp = Date.parse(Time);
  var dateTime = new Date(timeStamp).toISOString();
  ////Thu Aug 20 2020 13:52:27 GMT+0000 (UTC)
  // ?????????????????????????? ?? 2020-08-29 13:52:27.000
  console.log(dateTime);

  for (const [key, value] of qnaMap.entries()) {
    console.log("QNA:", key, " = ", value);
  }

  //console.log(body);
  console.log("?????? ?????? ????:", Name);
  console.log("???????? ?????? ????:", dateTime);
  //return;
  //?????????????? ???????? ?? ????????
  var insertToDB = function () {
    if (isTest == 0) {
      var conn = new sql.ConnectionPool(db_config);
      conn.connect().then(function (conn) {
        var request = new sql.Request(conn);
        request.input('name', sql.VarChar(50), Name);
        request.input('time', sql.DateTime, dateTime);
        request.input('eventname', sql.NVarChar(200), eventName);

        for (const [key, value] of qnaMap.entries()) {
          //console.log("QNA:", key, " = ", value);
          request.input(key, sql.Int, value);
        }

        //?????????????????? ??????????????????
        request.execute('[dbo].[sp_flowxo_api_poll_results_insert]').then(function (err, recordsets, returnValue, affected) {
          console.dir(recordsets);
          console.dir("Return Value: ", returnValue);
          console.dir("Affected rows: ", affected);
          console.dir(err);
        }).catch(function (err) {
          console.log(err);
        });
      });
    } else { // Test DB MYSQL
      var mysql_connection = mysql.createConnection(test_db_config);

      mysql_connection.connect(function (err) {
        if (err) {
          console.log('Error connecting to Database');
          return;
        } console.log('Connection established');
      });

      var qArray = [];
      for (const [key, value] of qnaMap.entries()) {
        //console.log("QNA:", key, " = ", value);
        //request.input(key, sql.Int, value);
        //qString = qString.concat("",value);
        qArray = qArray.concat(value);
        var key = key;
      }
      var sql = mysql_connection.query('CALL sp_flowxo_api_poll_results_insert(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [Name, dateTime, eventName, qArray], function (err, result) {
          if (err) throw err;
          console.log(result.insertId);
        });

      mysql_connection.end(function (err) {
        // The connection is terminated gracefully
        // Ensures all previously enqueued queries are still
        // before sending a COM_QUIT packet to the MySQL server.
        console.log(err);
      });
    }
  }

  insertToDB();

  res.send(req.headers);
});

//???????????????? ???????????? ???? ?????????????? ?????? ?????????????????????? ?? ???????? ????????????????
app.get(deployPath + '/pollresults', function (req, res) {
  var getFromDB = function () {
    if (isTest == 0) {

      var conn = new sql.ConnectionPool(db_config);
      conn.connect().then(function (conn) {

        var request = new sql.Request(conn);

        request.query("SELECT * FROM tvf_get_poll_results()", function (err, recordsets) {
          console.log("???????????? ???? GET ?????????????? ????: \n", recordsets);
          res.send(JSON.stringify(recordsets));
        });
      });

    } else { // Test DB MYSQL
      let mysql_connection = mysql.createConnection(test_db_config);
      
      mysql_connection.connect(function (err) {
        if (err) {
          console.log('Error connecting to Database');
          return;
        } console.log('Connection established');
      });

      let sql = "CALL sp_flowxo_api_poll_results_get()";

      //mysql_connection.query(sql, true, (error, recordsets, fields) => {
        mysql_connection.query(sql, (error, recordsets) => {
        if (error) {
          return console.error(error.message);
        }
        console.log(recordsets[0]);
        console.log("???????????? ???? GET ?????????????? ????: \n", recordsets);
        res.send(JSON.stringify(recordsets))
      });

      mysql_connection.end();
    }
  }
  getFromDB();

  //res.sendfile(__dirname + '/index.html');
});

let PORT = process.env.PORT || 8080
if (PORT == null || PORT == "") {
  PORT = 8000;
}
app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`);
  console.log('Press Ctrl+C to quit.');
})

//Not need
// app.get('*', function (req, res) {

//   compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
//     if (err) {
//       return next(err)
//     }
//     res.set('content-type', 'text/html')
//     res.send(result)
//     //res.sendfile(__dirname + '/index.html');
//     //res.render('index', {});
//     res.end()
//   })
//     //res.sendFile(process.env.FRONTEND + '/index.html');
// });