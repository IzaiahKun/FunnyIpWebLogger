const geoip = require('geoip-lite'); // IP location lookup
const express = require('express'); // "Web Server"
const path = require('path'); // Local file stuff
const fs = require('fs'); // file system

const app = express(); // create webserver object
const port = 80; // port that you want "Web Server" to run on

console.log("Starting Program...");
app.get('/', async (req, res) => {
  // get connected IPAddress
  const rawipAddress = req.socket.remoteAddress;
  const ipAddress = rawipAddress.replace('::ffff:', '');
  console.log(ipAddress);

  // gets date of connection
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var sec = today.getSeconds();
  var min = today.getMinutes();
  var hour = today.getHours();
  var today = hour + ":" + min + ":" + sec + " - " + mm + '/' + dd + '/' + yyyy;

  // get location of ip address (not exact)
  var geo;
  if (geoip.lookup(ipAddress) == null) {
    geo = "invalid";
  } else {
    geo = geoip.lookup(ipAddress);
  }

  // Content for ips.txt valid and invalid check
  if (geo.city != null) {
    // contents ment to be put into the ips.txt if local is valid
    var content = "\n" + today + "    |    " + ipAddress + "    |    " + geo.city + ", " + geo.region + ", " + geo.country;
  } else {
    // contents ment to be put into the ips.txt if local is invalid
    var content = "\n" + today + "    |    " + ipAddress + "    |    " + "UNABLE TO GET DATA - Reserved/Protected IP Address";
  }

  // write ipadders to files
  fs.appendFile('ips.txt', content, function(err) {
    if (err) throw err;
    console.log('Connection saved!');
  });

  // Sends index.html to client
  res.sendFile(path.join(__dirname, '/index.html'));
})

// acutally starts the "Web Server"
app.listen(port, () => {
  console.log(`\nVRC Sniffer V1 is now running on port: ${port}`)
})