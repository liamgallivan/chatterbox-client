// YOUR CODE HERE:
var app = {
  server:'https://api.parse.com/1/classes/chatterbox'
};


app.send = function(message) {
  $.ajax({
  // always use this url
  url: app.server,
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
    },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function() {
  $.ajax({
  // always use this url
  url: app.server,
  type: 'GET',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
  }
});
};

app.clearMessages = function(){
  $('#chats').empty();
}

app.addMessage = function(message){
  $('#chats').prepend('<div class=\'.username\'> ' + message.username + ":" + message.text + '</div>')

};

app.addRoom = function(roomname){
  $('#roomSelect').append('<div>' + roomname + '</div>');
};

app.addFriend = function(username) {
  console.log("Clicked");
};


app.handleSubmit = function() {
};

app.init = function() {
  $('.username').click(app.addFriend());
  $('#send .submit').click(app.handleSubmit());
};


