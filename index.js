var express = require('express');
var app = express();
var cool = require ('cool-ascii-faces');
var Client = require('3scale').Client;
var providerKey = process.env.THREESCALE_PROVIDER_KEY;
var appId =  "455a116e";
var appKey =  "6ae0f31679ab02db77573829ff43e1ed";

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/*app.get('/', function(request, response) {
  response.render('pages/index')
});*/

app.get('/', function(request, response) {
    var result = "";
    var times = process.env.TIMES ||5;
    for(i=0;i<times;i++)
        result+=cool();

  response.send(result);
});

app.listen(app.get('port'), function() {
  //console.log('Node app is running on port', app.get('port'));
});

//3scale

client = new Client(providerKey);

var ThreeScale = require('3scale').Client;
// keep your provider key secret
var client = new ThreeScale("f42a758238b9927407aeaddd5018b3ff");

client.authrep({ app_id: appId, app_key:appKey }, function(response){
    console.log("Authotritzation+Report2");
    console.log(response);
  if(response.is_success()) {
    console.log("success");
  } else {
    throw new Error("not authorized " + response.error_message);
  }
});