// adding the web socket libary
var webSockectServ = require('ws').Server

var wss = new webSockectServ({
    port:9090
});

wss.on('connection', function(conn){
    console.log("User connected");

   

    // Fire the message event on connection
    // the message passed in the parameter is the users message.
    conn.on('message', function(message){

    })

    conn.on('close', function(){
            console.log('Connection closed')
    })

    conn.send("Hello");

})

// Using helping function to send message to other users.
function sendToOtherUser(connection, message){
    connection.send(JSON.stringify(message))
}