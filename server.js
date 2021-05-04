var express = require('express')
var socket = require('socket.io')
let lastReport = 1


var app = express()
var server = app.listen(3000)

app.use('/', express.static(__dirname + '/public'))
app.use('/tutorial', express.static(__dirname + '/tutorial'))

var io = socket(server)

console.log('Socket server is running!')

io.sockets.on('connection', newConnection)

let usersOnline = {}

function newConnection(socket) {
    io.to(socket.id).emit("userID", {socketID: socket.id})
    socket.on("disconnect", reason => {
      let user
        for (user in usersOnline) {
            if (usersOnline[user] === socket.id) {
                delete usersOnline[user]
            }
        }
      let totUsers = Object.keys(usersOnline).length
        if (totUsers > 50 && totUsers % 10 == 0) {
            console.log(totUsers + " users online")
        } else if (totUsers > 10 && totUsers % 2 == 0) {
            console.log(totUsers + " users online")
        } else if (totUsers < 11) {
            console.log(totUsers + " users online")
        }
    })
    socket.on("phone numbers", u => {
        usersOnline[u.userPhoneNumber] = socket.id
        let totUsers = Object.keys(usersOnline).length
        if (totUsers > 50 && totUsers % 10 == 0) {
            console.log(totUsers + " users online")
        } else if (totUsers > 10 && totUsers % 2 == 0) {
            console.log(totUsers + " users online")
        } else if (totUsers < 11) {
            console.log(totUsers + " users online")
        }
    })
    socket.on("search a user", o => {
      let founded = false
      let user
      let otherID
        for (user in usersOnline) {
            if (user === o.otherUserPhone) {
                founded = true
                otherID = usersOnline[user]
            }
        }
      if (founded) {
        io.to(socket.id).emit("founded", {founded: otherID})
      } else {
        io.to(socket.id).emit("not founded")
      }
    })
    socket.on("send message", data => {
        io.to(data.to).emit("message recived", data)
    })
    socket.on("message sent", mess => {
        io.to(mess.to).emit("message sent", mess)
    })
}