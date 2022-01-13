var socket = io();
  
let messageForm = $('#send-message');
let messageBox = $('#message');
let chat = $('#chat');
let nickForm = $('#setNick');
let nickError = $('#nickError');
let nickBox = $('#nickname');
let users = $('#users');

nickForm.submit(function(event){
    event.preventDefault();

    socket.emit('new user', nickBox.val(), function(isValidUsername){
        if(isValidUsername){
            $('#nickWrap').hide();
            $('#contentWrap').show();
        }else{
            nickError.html('This username is taken, try something else.');
        }
    });
    nickBox.val('');
});

socket.on('usernames', function(data){
    let html = "Online Users <br/>";
    data.forEach(function(dataItem){
        html += dataItem + "<br/>";
    });
    users.html(html);
});

messageForm.submit(function(event){
  event.preventDefault();

  socket.emit('send message', messageBox.val());
  messageBox.val('');
});

socket.on('new message', function(messageData){
    chat.append("<li>"+ messageData.name + " :  " + messageData.message +"</li>");
});