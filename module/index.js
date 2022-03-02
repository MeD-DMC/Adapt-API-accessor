const express = require("express");
const app = express();
const cors = require("cors");
const auth = require('./settings/login.json');
const axios = require("axios");
axios.defaults.withCredentials = true
const port = process.env.PORT || 5000;
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
    console.log(error);
  });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});