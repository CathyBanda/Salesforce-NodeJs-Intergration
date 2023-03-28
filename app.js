const express = require("express"); //Adding Express
const jsforce = require("jsforce"); //Adding JsForce
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3001;
const username = process.env.SF_USERNAME;
const password = process.env.SF_PASSWORD;

const conn = new jsforce.Connection({
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

conn.login(username, password, (err, userInfo) => {
  // Now you can get the access token and instance URL information.
  // Save them to establish a connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
});

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post("/index.html", function (req, res) {
  var title = req.body.title;
  var fname = req.body.fname;
  var lname = req.body.lname;
  var position = req.body.position;
  var businessAccount = req.body.businessAccount;
  var employees = req.body.employees;
  var streetNr = req.body.streetNr;
  var additionalInformation = req.body.additionalInformation;
  var zipCode = req.body.zipCode;
  var region = req.body.region;
  var country = req.body.country;
  var code = req.body.code;
  var phoneNumber = req.body.phoneNumber;
  var email = req.body.email;

  var data = {
    title: title,
    fname: fname,
    lname: lname,
    position: position,
    businessAccount: businessAccount,
    employess: employees,
    streetNr: streetNr,
    additionalInformation: additionalInformation,
    zipCode: zipCode,
    region: region,
    country: country,
    code: code,
    phoneNumber: phoneNumber,
    email: email,
  };
  conn.load("Account", "insert", data, function (err, rets) {
    if (err) throw err;
    console.log("Record inserted Successfully");
  });

  return res.redirect("signup_success.html");
});

var records = [];
app.get("/getInfo", async function (req, res, next) {
  var records = [];
  conn.query("SELECT Id, Name FROM Account", function (err, result) {
    if (err) {
      return console.error(err);
    }
    console.log("total : " + result.totalSize);
    console.log("fetched : " + result.records.length);
  });
});

app
  .get("/", function (req, res) {
    res.set({
      "Access-control-Allow-Origin": "*",
    });
    return res.redirect("index.html");
  })
  .listen(3000);

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`);
});
