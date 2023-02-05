let socket = io();

$("button").on('click', function() {
  let text = $("#message").val();
  let who = $("#initials").val();
  
  socket.emit('message', who + ": " + text);
  $('#message').val('');
  
  return false;
});

socket.on('message', function(msg) {
  $('<li>').text(msg).appendTo('#history');
});
