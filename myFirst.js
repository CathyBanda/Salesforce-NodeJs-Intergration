var express = require("express"); // Adding Express
var http = require("http"); // Adding http
var jsforce = require("jsforce"); // Adding JSforce
var application = express();
var app = express();
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3001;
const username = process.env.SF_USERNAME;
const password = process.env.SF_PASSWORD;

app.set("port", process.env.PORT || 3001);

app.get("/", function (req, res) {
  work(req, res);
});

var conn = new jsforce.Connection({
  //   oauth2: {
  //     // you can change loginUrl to connect to sandbox or prerelease env.
  //     loginUrl: process.env.LOGIN_URL,
  //     clientId: process.env.SF_CLIENT_ID,
  //     clientSecret: process.env.SF_CLIENT_SECRET,
  //     redirectUri: process.env.SF_REDIRECT_URI,
  //   },
  //   instanceUrl: process.env.SF_INSTANCE_URL,
  //   accessToken: process.env.SF_ACCESS_TOKEN,
  //   refreshToken: process.env.SF_REFRESH_TOKEN,
});

//var username = "cathy@banco1.com";
//var secretPhrase = "baraka6571#ZbxldFMdBBdItk549SnzgmWn";

conn.login(username, password, (err, userInfo) => {
  // Now you can get the access token and instance URL information.
  // Save them to establish a connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
});

// Perform SOQL Query
var records = [];
conn.query("SELECT Id, Name FROM Account", function (err, result) {
  if (err) {
    return console.error(err);
  }
  console.log("total : " + result.totalSize);
  console.log("fetched : " + result.records.length);
});

// Perform account insertion
var accounts = [
  { Name: "MyAccount 1", Site: "heySalesforce.org" },
  { Name: "MyAccount 2", Site: "heySalesforce.org" },
  { Name: "MyAccount 3", Site: "heySalesforce.org" },
  { Name: "MyAccount 4", Site: "heySalesforce.org" },
];

conn.bulk.load("Account", "insert", accounts, function (err, rets) {
  if (err) {
    return console.error(err);
  }
  for (var i = 0; i < rets.length; i++) {
    if (rets[i].success) {
      console.log("#" + (i + 1) + " loaded successfully, id = " + rets[i].id);
    } else {
      console.log(
        "#" +
          (i + 1) +
          " error occurred, message = " +
          rets[i].errors.join(", ")
      );
    }
  }
});

app.get("/", function (req, res) {
  res.send("heySalesforce: JSForce Connection Successful!");
});

http.createServer(application).listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});
