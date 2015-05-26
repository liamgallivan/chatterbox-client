// YOUR CODE HERE:
var app = {
  server:'https://api.parse.com/1/classes/chatterbox'
};

app.chatRooms = {};
app.currentUser;
app.currentRoom;
app.friends = {};
app.numPost = 20;

app.send = function(message) {
  console.log
  $.ajax({
  // always use this url
  url: app.server,
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    $('.submit').removeAttr('disabled');
    $('.message').val('');
    console.log('chatterbox: Message sent');
    },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    $('.refresh').removeAttr('disabled');
    console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function() {
  $.ajax({
  // always use this url
    url: app.server,
    type: 'GET',
    // data: data,
    contentType: 'application/json',
    success: function (data) {
      updateChat(data);
      updateFriendsList();
      $('.refresh').removeAttr('disabled');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message');
    }
  });
};

app.clearMessages = function(){
  $('#chats').empty();
}

app.addMessage = function(message){
  $('#chats').append('<div><a class=\'username\' href=\"#\"> ' + message.username + "</a> : " + message.text + '</div>');

};

app.addRoom = function(roomname){
  if (!app.chatRooms[roomname]) {
    app.chatRooms[roomname] = true;
    $('#roomSelect').append('<div><a class = \'chatRooms\' href=\"#\">' + roomname + '</a></div>')
    // debugger;
      .click(app.switchChatRoom);

  }
};

app.addFriend = function() {
  console.log("adding friend");
  var username = this.text;
  if (!app.friends[username]) {
    app.friends[username] = true;
  };
  updateFriendsList();
};


app.handleSubmit = function() {
  //var username = $.urlParam('username')
  var message = {
    username: app.currentUser,
    text:$('.message').val(),
    roomname: app.currentRoom
  };
  app.send(message);
  app.fetch();
};

app.init = function() {
  app.currentUser = $.urlParam('username');
  app.currentRoom = "Lobby";
  app.addRoom(app.currentRoom);
  $('.message').bind('keypress',function(event) {
    if (event.keyCode === 13) {
      $('.submit').click();
    }
  });
  $('.submit').click(function(){
    $('.submit').attr('disabled','disabled');
    app.handleSubmit();
  });
  $('.refresh').click(function() {
    $('.refresh').attr('disabled','disabled');
    app.fetch();
  });
  $('.currentRoom').text(app.currentRoom);
  setInterval(app.fetch, 50000);
};

var updateChat = function(data){
  if (data === undefined) {
    console.log('not receiving data');
    return;
  }

  app.clearMessages();
  var messageList = data.results.slice(0, app.numPost);
  _.each(messageList, function (message){

    // Temporary to see all messages
    // if (app.currentRoom === 'Lobby' || message.roomname === app.currentRoom) {
    if (message.roomname === app.currentRoom) {
      message.username = validator.escape(message.username);
      message.text = validator.escape(message.text);
      message.roomname = validator.escape(message.roomname);

      app.addMessage(message)
    }

    app.addRoom(message.roomname);

  });

  $('.username').click(app.addFriend);

};
app.switchChatRoom= function () {
  console.log("Switching room");
  app.currentRoom = this.text;
  $('.currentRoom').text(app.currentRoom);
  $('.refresh').click();
};

$.urlParam = function(name){
    var results = new RegExp('[\?&amp;]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
};

var updateFriendsList = function(){
  $('.friends').empty();
  $('.friends').append('<ul></ul>');

  for(var i in app.friends) {
    $('.friends ul').append('<li class=\'friend\'>' + i + '</li>');
  }

};
