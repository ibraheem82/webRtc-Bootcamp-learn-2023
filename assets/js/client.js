var url_string = window.location.href;
var url = new URL(url_string);
var username = url.searchParams.get('username');


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