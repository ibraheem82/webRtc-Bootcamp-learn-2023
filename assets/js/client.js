var connection = new WebSocket('ws://localhost:9090');

connection.onopen = function(){
    // the server is the signalling server
    console.log("Connected to the server")
}

// after getting message from the signalling server
connection.onmessage = function(msg){
    var data = JSON.parse(msg.data)
    switch(data.type){
        case "login":
            // connected to the sendToOtherUser function.
            loginProcess(data.success);
        break;
    }
}

// if there is error in connection or if the connection is not established.
connection.onerror = function(error){
    console.log(error)
}


var local_video = document.querySelector("#local-video");
var call_btn = document.querySelector("#call-btn");
var call_to_username_input = document.querySelector("#username-input");


call_btn.addEventListener("click", function(){
    var call_to_username = call_to_username_input.value;

    // check if the username is valid
    if(call_to_username > 0){
        connected_user = call_to_username;
        myConn.createOffer(function(offer){
            send({
                type:"offer",
                offer:offer
            })
            myConn.setLocalDescription(offer)
            
        }, function(error){
                alert("Offer has not created.")
        })
    }
})

var name;
var connectedUser;
var myConn;
var url_string = window.location.href;
var url = new URL(url_string);
var username = url.searchParams.get('username');
// if the connection is open.
setTimeout(function () {
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
} else{
    console.log("Connection has not established")
}
}, 3000)

function send(message){
    if(connected_user){
        message.name == connected_user;
    }

    connection.send(JSON.stringify(message))
}

function loginProcess(success){
    if(success === false){
        alert("username is not correct");
    } else{
        // * To  access the user's camera and microphone.
navigator.getUserMedia({
    video:true, 
    audio:true},
    // * This function will be called if, if access to the user's media is successful
    function(myStream){
        stream = myStream;
        // * element is set to display the local video feed.
        local_video.srcObject = stream;
        var configuration = {
            "iceServer": [{
                "url":"stun:stun2.1.google.com:1930"
            }]
        }
        myConn = new webkitRTCPeerConnection(configuration, {
            optional: [{
            RtpDataChannels: true;
        }]
    });
    
    myConn.addTrack(stream);
        // ! For error
    }, function(error){
        console.log(error);
    });
    }

}

function offerProcess(offer, name){
    connected_user = name;
    myConn.setRemoteDescription(new RTCSessionDescription(offer))
}