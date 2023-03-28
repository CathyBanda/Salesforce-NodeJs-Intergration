var fs = require("fs");
var path = require("path");
const express = require("express"); //Adding Express
const jsforce = require("jsforce"); //Adding JsForce
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3001;
const username = process.env.SF_USERNAME;
const password = process.env.SF_PASSWORD;

run();
async function run() {
  // salesforce code goes here...

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

  let soql = `select id, name,
    (SELECT Id, FirstName, LastName, Title, Phone, Email from Contacts)
    FROM Account`;
  let accounts = await conn.query(soql);
  let young = accounts.records
    .filter((x) => x.Name === "United Oil & Gas Corp.")[0]
    .Contacts.records.filter(
      (y) => y.FirstName === "Andy" && y.LastName === "Young"
    )[0];
  console.log(young);

  app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
  });
}
