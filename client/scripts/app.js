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
  var chat = '<div class=\'chat\' data=\'' + message.username + '\'><a class=\'username\' href=\"#\"> ' + message.username + "</a> : " + message.text + '</div>';
  $('#chats').append(chat);
  $('#chats').children().last().addClass(function() {
      if(app.friends[this.attributes.data.value]) {
        return "friend";
      }
    });

};

app.addRoom = function(roomname){
  if (!app.chatRooms[roomname]) {
    app.chatRooms[roomname] = true;
    $('#roomSelect').append('<div><a class = \'chatRooms\' href=\"#\">' + roomname + '</a></div>');
    // debugger;
  }
};

app.addFriend = function() {
  console.log("adding friend");
  var username = this.text.trim();
  if (!app.friends[username]) {
    app.friends[username] = true;
  };
  // debugger;
  $('.chat').addClass(function(index, oldClass){
    // debugger;
    if(this.attributes.data.value === username.trim()) {
      return "friend";
    }
  });

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

    message.username = validator.escape(message.username);
    message.text = validator.escape(message.text);
    message.roomname = validator.escape(message.roomname);

    // if (app.currentRoom === 'Lobby' || message.roomname === app.currentRoom) {
    if (message.roomname === app.currentRoom) {

      app.addMessage(message)
    }

    app.addRoom(message.roomname);

  });
  $('.chatRooms').off("click");
  $('.username').click(app.addFriend);
  $('.chatRooms').click(app.switchChatRoom);
};
app.switchChatRoom = function () {
  console.log("Switching room: " + this.text);
  // debugger;
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
