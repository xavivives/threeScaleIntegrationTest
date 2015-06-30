var express = require('express');
var app = express();
var http = require("http");
var Client = require('3scale').Client;
var providerKey = process.env.THREESCALE_PROVIDER_KEY;
var appId =  "455a116e";
//var appKey =  "6ae0f31679ab02db77573829ff43e1ed";

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

client = new Client(providerKey);
var ThreeScale = require('3scale').Client;
var client = new ThreeScale("f42a758238b9927407aeaddd5018b3ff");

var errorImg = "http://33.media.tumblr.com/tumblr_m15vecveRC1rs2heko1_500.gif";
var suggestionTags= ["stupid-dog","sandwitch", "sugar", "apple", "teletubies", "unicorn"];

app.listen(app.get('port'), function() {
  //console.log('Node app is running on port', app.get('port'));
});

app.get('/', function(request, response) {
    var appKey = request.query.appKey;
    var tag = request.query.tag;
    var message = "Yeah!<br>Here you've got your "+tag+"!<br>Click for more awesomeness.";
    if(!tag)
    {
        tag ="galaxy-cat";
        var message = "Good job!<br>Here you've got an outer space cat!<br>If you hate kitties you can try to add this at the end of the url: &tag="+getSuggestionTag()+", or anything else you love..." ;
    }

    if(!appKey)
    {
        response.send(render("Oops!. We need your appKey!</br> Try to add an appKey parameter to the url: ?appKey=1234", errorImg, false));
        return;
    }

    authorize(appKey, function(isAllowed)
    {
        if(!isAllowed)
        {
            response.send(render("Almost! Your appKey doesn't seems to be right!</br> You can try this super secret one: 6ae0f31679ab02db77573829ff43e1ed",errorImg,false));
            return;
        }
        else
        {
            var giphyRequestOptions = {
                host: 'api.giphy.com',
                path: '/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag='+tag
            };

            var req = http.get(giphyRequestOptions, function(res) {
                var bodyChunks = [];
                res.on('data', function(chunk) {
                    bodyChunks.push(chunk);

                }).on('end', function() {
                    var body = Buffer.concat(bodyChunks);
                    imgUrl= getImgUrl(body);
                    response.send(render(message,imgUrl,true));
                })
            });
        } 
    });    
});

var authorize = function(appKey, callback)
{
    client.authrep({ app_id: appId, app_key:appKey }, function(response){
        if(response.is_success())
            callback(true);
        else
            callback(false);
    });
}

var getImgUrl = function(jsonText)
{
    var obj = JSON.parse(jsonText);
    if(obj.meta.status == "200")
        return obj.data.image_original_url;
    else
        return errorImg;
}

var render = function (message, imgUrl, reloadOnClick)
{
    var script = "";
    if(reloadOnClick)
        script = "document.onclick= function(event) {window.location.reload();}"
    return ("<!DOCTYPE html><html style='background: url("+imgUrl+") no-repeat center center fixed;    -webkit-background-size: cover;   -moz-background-size: cover;   -o-background-size: cover;   background-size: cover; color: white; font-size: 25px; font-family: monospace; text-align: center;'> <script> "+script+"</script><head><title>3scale rocks!</title></head><body>"+message+"</body></html>");
}

var getSuggestionTag = function()
{
    return suggestionTags[Math.round(Math.random()*(suggestionTags.length-1))];
}
