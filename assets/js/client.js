var connection = new WebSocket('ws://localhost:9090');

connection.onopen = function(){
    // the server is the signalling server
    console.log("Connected to the server")
}

// after getting message from the signalling server
connection.onmessage = function(msg){
    var data = JSON.parse(msg.data)
}

// if there is error in connection or if the connection is not established.
connection.onerror = function(error){
    console.log(error)
}


var name;
var connectedUser;
var url_string = window.location.href;
var url = new URL(url_string);
var username = url.searchParams.get('username');
// if the connection is open.
if (connection.readyState === 1){
    if (username != null){
        name = username;
        if (name.length > 0){
            send({
                type:"login",
                name:name
            })

        }
    }
}

var local_video = document.querySelector("#local-video");
// * To  access the user's camera and microphone.
navigator.getUserMedia({
    video:true, 
    audio:true},
    // * This function will be called if, if access to the user's media is successful
    function(myStream){
        stream = myStream;
        // * element is set to display the local video feed.
        local_video.srcObject = stream;
        // ! For error
    }, function(error){
        console.log(error);
    });