// adding the web socket libary
var webSockectServ = require('ws').Server

var wss = new webSockectServ({
    port:9090
});

var users = {};
var otherUser;
wss.on('connection', function(conn){
    console.log("User connected");

   

    // Fire the message event on connection
    // the message passed in the parameter is the users message.
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
                    users[data.name] = conn;
                    conn.name = data.name
                    sendToOtherUser(conn, {
                        type: "login",
                        success: true
                    })
                }
                break;
        }

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