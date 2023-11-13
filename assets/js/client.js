var connection = new WebSocket('ws://localhost:9090');


// * This event handler is called when the connection to the server is established successfully. It logs a message indicating that the connection is established.
connection.onopen = function(){
    // the server is the signalling server
    console.log("Connected to the server")
}

// @ after getting message from the signalling server
// * This event handler is called when a message is received from the server. It parses the received JSON data and handles different message types:

// **"login": This message type indicates the outcome of the login attempt. If the login was successful, it calls theloginProcess()` function to proceed with the video call setup.

// **"offer": This message type indicates an offer to initiate a video call from another user. It calls theofferProcess()` function to handle the incoming offer.
connection.onmessage = function(msg){
    var data = JSON.parse(msg.data)
    switch(data.type){
        case "login":
            // connected to the sendToOtherUser function.
            loginProcess(data.success);
        break;

        case "offer":
            // connected to the sendToOtherUser function.
            offerProcess(data.offer, data.name);
        break;
    }
}

// if there is error in connection or if the connection is not established.
// * This event handler is called if an error occurs during the connection or if the connection is lost. It logs the error message.
connection.onerror = function(error){
    console.log(error)
}


// ! Initiating a Video Call
// ! The code defines event handlers for user interactions:

var connected_user;
var local_video = document.querySelector("#local-video");
var call_btn = document.querySelector("#call-btn");
var call_to_username_input = document.querySelector("#username-input");

// * When the "call" button is clicked, it retrieves the username from the input field. If the username is valid, it sets the connected_user variable to the username and calls the myConn.createOffer() method to create an offer to initiate a video call.
call_btn.addEventListener("click", function(){
    var call_to_username = call_to_username_input.value;

    // check if the username is valid
    if(call_to_username > 0){
        connected_user = call_to_username;
        myConn.createOffer(function(offer){
            // @ Sending and Receiving Messages
// * The code defines a send() function to send messages to the server. It takes a JSON object as a parameter and sends the stringified JSON data over the WebSocket connection.
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


// * Processing Login Response
// * The loginProcess() function handles the response to the login request. If the login was successful, it requests access to the user's camera and microphone using the navigator.getUserMedia() API.
function loginProcess(success){
    if(success === false){
        alert("username is not correct");
    } else{
        // * To  access the user's camera and microphone.
        // @ Requesting Access to User Media
// * The navigator.getUserMedia() API request is made within the loginProcess() function. If access is granted, it creates a local MediaStream object and assigns it to the stream variable. It also sets the local_video element's source object to the stream, displaying the local video feed.
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

        // @ Creating Peer Connection
// * A peer connection object is created using the webkitRTCPeerConnection() constructor within the loginProcess() function. It specifies an ICE server configuration to facilitate peer-to-peer communication.
        myConn = new webkitRTCPeerConnection(configuration, {
            optional: [{
            RtpDataChannels: true;
        }]
    });
    
    // @ Adding Media Tracks to Peer Connection
// * The myConn.addTrack() method is called within the loginProcess() function to add the local MediaStream's tracks to the peer connection. This allows the local video and audio to be sent to the remote peer.
    myConn.addTrack(stream);
        // ! For error
    }, function(error){
        console.log(error);
    });
    }

}


// @ Processing Incoming Offer
// * The offerProcess() function handles the incoming offer from another user. It updates the connected_user variable to the caller's username and sets the remote description of the peer connection using the myConn.setRemoteDescription() method.
function offerProcess(offer, name){
    connected_user = name;
//  @   Setting Remote Description
// * The myConn.setRemoteDescription() method is called within the offerProcess() function to set the remote description received from the caller. This provides the necessary information for the peer connection to establish the communication channel.


    myConn.setRemoteDescription(new RTCSessionDescription(offer))
}