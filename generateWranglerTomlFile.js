const fs = require('fs');
require('dotenv').config();

const account_id = process.env.account_id;
const TOKENs = process.env.TOKENs;
const SHORT_URLs = process.env.SHORT_URLs;
const DEV_TOKENs = process.env.DEV_TOKENs;
const DEV_SHORT_URLs = process.env.DEV_SHORT_URLs;

const tomlFileContent = `name = "redirect"
main = "index.js"
workers_dev = true
account_id = "${account_id}"
route = "redirect.rgpvnotes.in/*"
compatibility_date = "2021-09-24"
kv_namespaces = [
    { binding = "TOKENs", id = "${TOKENs}" },
    { binding = "SHORT_URLs", id = "${SHORT_URLs}" },
]
[env.dev]
kv_namespaces = [
  { binding = "TOKENs", id = "${DEV_TOKENs}", preview_id = "${DEV_TOKENs}" },
  { binding = "SHORT_URLs", id = "${DEV_SHORT_URLs}", preview_id = "${DEV_SHORT_URLs}"}
]
`;

// create slug file
fs.writeFile('wrangler.toml', tomlFileContent, function (err) {
    if (err) throw err;
    console.log('File written successfully.');
});
