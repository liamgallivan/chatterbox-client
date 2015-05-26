// YOUR CODE HERE:
var app = {
  server:'https://api.parse.com/1/classes/chatterbox'
};

app.rooms = {};
app.users = {};
app.friends = {};

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
  if (!app.rooms[roomname]) {
    app.rooms[roomname] = true;
    $('#roomSelect').append('<div><a href=\"#\">' + roomname + '</a></div>');
  }
};

app.addFriend = function() {
  var username = this.text;
  if (!app.friends[username]) {
    app.friends[username] = true;
  };
  updateFriendsList();
};


app.handleSubmit = function() {
  var username = $.urlParam('username')
  var message = {
    username: username,
    text:$('.message').val(),
    chatroom: 'lobby'
  };
  app.send(message);
  app.fetch();
};

app.init = function() {
  $('.username').click(app.addFriend);
  $('.submit').click(function(){
    $('.submit').attr('disabled','disabled');
    app.handleSubmit();
  });
  $('.refresh').click(function() {
    $('.refresh').attr('disabled','disabled');
    updateChat();
  });

  setInterval(app.fetch, 50000);
};

var updateChat = function(data){
    // debugger;
  app.clearMessages();
  var messageList = data.results.slice(0,10);
  _.each(messageList, function (message){
    message.username = validator.escape(message.username);
    message.text = validator.escape(message.text);
    message.roomname = validator.escape(message.roomname);

    app.addMessage(message)
    app.addRoom(message.roomname);
  });

}

$.urlParam = function(name){
    var results = new RegExp('[\?&amp;]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}

var updateFriendsList = function(){
  $('.friends').empty();

  $('.friends').append('<ul></ul>');

  for(var i in app.friends) {
    $('.friends ul').append('<li class=\'friend\'>' + i + '</li>');
  }
}
