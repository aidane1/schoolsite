//makes connection
let socket = io.connect("http://localhost:3000");
let message = document.getElementById("message");
let btn = document.getElementById("send");
let output = document.getElementById("outPut");

btn.addEventListener("click", function() {
  let info = {message:message.value, id:document.cookie.match(/sessionID=j%3A%22(.+?)%22/)[1]};
  message.value  = "";
  socket.emit("chat", info);
});

socket.on("chat", function(data) {
  output.innerHTML += '<div class = "messageHolder"<p><strong>' + data.username + "</strong>: " + data.message + "</p><div class = 'name'>" + data.firstName + " " + data.lastName + "</div></div>";
})
