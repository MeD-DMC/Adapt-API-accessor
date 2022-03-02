const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
axios.defaults.withCredentials = true;
var fp = require("find-free-port");
var os = require('os');
var networkInterfaces = os.networkInterfaces();
var firstNetworkConnection = Object.keys(networkInterfaces)[0];

var prompt = require('prompt');

const fs = require('fs')

const path = __dirname + '/settings/login.json'


  if (fs.existsSync(path)) {
    deploy();
  } else {
    console.log('This is your first time running the tool! Plese input valid Adapt credentials in order to create the settings file.')
    prompt.message = 'Adapt';
    prompt.start();
    prompt.get(['email', 'password'], function (err, result) {
      var json = {
        email: result.email,
        password: result.password
      }
      fs.writeFileSync(__dirname + '/settings/login.json', JSON.stringify(json));
      deploy();
    });
  }



function deploy(){

  const auth = require('./settings/login.json');

  app.use(express.static('assets'));
  app.use(cors());

  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/assets/index.html");
  });

  app.get("/courses", (req, res) => {
      res.sendFile(__dirname + "/assets/courses/index.html");
  });

  app.get("/courses/list", (req, res) => {
            axios.post('https://esdcadapt.canadacentral.cloudapp.azure.com/api/login', {
              email: auth.email,
              password: auth.password
            })
            .then(function (response) {
              var cookies = response.headers['set-cookie'];
              axios.get('https://esdcadapt.canadacentral.cloudapp.azure.com/api/content/course/query', {
                  headers: {Cookie: cookies}}).then(response => {
                      res.send(response.data);
                  })
            })
            .catch(function (error) {
              //console.log(error);
              var status = error.response.statusText;
              if(status === 'Unauthorized'){
                console.log('The request cannot be authorized, make sure you have valid credentials in module/settings/login.json')
              }
              res.status(401).send(error);
            });
  });

  app.get("/users", (req, res) => {
    res.sendFile(__dirname + "/assets/users/index.html");
  });

  app.get("/users/list", (req, res) => {
    axios.post('https://esdcadapt.canadacentral.cloudapp.azure.com/api/login', {
      email: auth.email,
      password: auth.password
    })
    .then(function (response) {
      var cookies = response.headers['set-cookie'];
      axios.get('https://esdcadapt.canadacentral.cloudapp.azure.com/api/user', {
          headers: {Cookie: cookies}}).then(response => {
              res.send(response.data);
          })
    })
    .catch(function (error) {
      var status = error.response.statusText;
      if(status === 'Unauthorized'){
        console.log('The request cannot be authorized, make sure you have valid credentials in module/settings/login.json')
      }
      res.status(401).send(error);
    });
  });

  fp(8080, 9000, function(err, freePort) {

    var PORT = freePort;

    app.listen(PORT, () => {
      console.log('Server available on http://localhost:' + PORT);
      console.log(networkInterfaces[firstNetworkConnection][1].address + ':' + PORT);
    });

  });
}
 
