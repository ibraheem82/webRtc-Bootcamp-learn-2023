// -> adding the web socket libary
var webSockectServ = require('ws').Server

var wss = new webSockectServ({
    port:9090
});

var users = {};
var otherUser;

// * The connection event is emitted whenever a new client connects to the server. The event handler receives the connection object as an argument. The connection object represents the communication channel between the server and the connected client.
wss.on('connection', function(conn){
    console.log("User connected");

   

    // -> Fire the message event on connection
    // the message passed in the parameter is the users message.
    // *  The message event is emitted whenever the server receives a message from a connected client. The event handler receives the message as an argument. The message is a string of text, but it is typically encoded in JSON format.
    conn.on('message', function(message){
        var data;

        try{
            data = JSON.parse(message)
        } catch(e) {
            console.log("Invalid JSON");
            data = {};
        }

        switch (data.type){
            case "login":
                if(users[data.name]){
                    sendToOtherUser(conn,{
                        type: "login",
                        success: false
                    })
                } else{ 
                    users[data.nme] = conn;
                    conn.name = data.name
                    sendToOtherUser(conn, {
                        type: "login",
                        success: true
                    })
                }
                break;
            case "offer":
            var connect = users[data.name]
            if(connect != null){
                conn.otherUser = data.name;

                sendToOtherUser(connect, {
                    type: "offer",
                    offer: data.offer,
                    name:conn.name
                })
            }
            break;
        }

    })


    // * The close event is emitted whenever a connected client closes the connection.
    conn.on('close', function(){
            console.log('Connection closed')
    })

    // *  The send() method on the connection object is used to send messages to the client.
    conn.send("Hello");

})

// Using helping function to send message to other users.
//  * This function sends the specified message to the other user in a peer-to-peer connection. It takes two arguments: the connection object of the user to send the message to, and the message to send. The message is converted to JSON format before being sent
function sendToOtherUser(connection, message){
    connection.send(JSON.stringify(message))
}