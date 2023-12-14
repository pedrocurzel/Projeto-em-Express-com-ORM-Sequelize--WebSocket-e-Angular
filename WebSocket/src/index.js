const express = require("express");
const auth_routes = require("./routes/auth_routes.js");
const doc_routes = require("./routes/documentos_routes.js");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");
const database = require("../models");
const chats_routes = require("./routes/chats_routes.js");

const app = express();
app.use(cors());
app.use(express.json());
auth_routes(app);
doc_routes(app);
chats_routes(app);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
let usuariosPorSala = {};
let usuariosConectadosApp = [];
io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("usuario_conectou_app", (usuario) => {
        
        usuariosConectadosApp.push({
            socket: socket.id,
            usuario
        });
        console.log(usuariosConectadosApp);
        io.emit("usuario_conectou_app", usuariosConectadosApp);
    })

    socket.on("conectar_sala", (value) => {
        socket.join(value.sala);
        if (!usuariosPorSala[value.sala]) {
            usuariosPorSala[value.sala] = [];   
        }
        usuariosPorSala[value.sala].push({
            socket: socket.id,
            user: value.usuario
        })

        io.to(value.sala).emit("usuarios_conectados", usuariosPorSala[value.sala]);
    })

    socket.on("textarea_value", async (value) => {
        await database.Documentos.update({valor: value.value}, {where: {nome: value.sala}});
        socket.to(value.sala).emit("textarea_value", value.value);
    })

    socket.on("desconectar_sala", (sala) => {
        socket.leave(sala);
        usuariosPorSala[sala].splice(usuariosPorSala[sala].findIndex(usuario => usuario.socket == socket.id), 1);
        socket.to(sala).emit("usuarios_conectados", usuariosPorSala[sala]);
    })

    socket.on("documento_criado", (novoDoc) => {
        socket.broadcast.emit("documento_criado", novoDoc);
    })

    socket.on("delete_doc", async (docName) => {
        await database.Documentos.destroy({where: {nome: docName}});
        socket.to(docName).emit("documento_deletado", docName);
        io.emit("deletar_documento_home", docName);
    })

    socket.on("disconnecting", (msg) => {
        console.log("asdasdasdadsasd");
        usuariosConectadosApp.splice(usuariosConectadosApp.findIndex(usuario => usuario.socket == socket.id), 1);
        io.emit("usuario_conectou_app", usuariosConectadosApp);
        for (let item of socket.rooms.keys()) {
            if (usuariosPorSala[item]) {
                usuariosPorSala[item].splice(usuariosPorSala[item].findIndex(user => user.socket == socket.id),1);
                socket.to(item).emit("usuarios_conectados", usuariosPorSala[item]);
            }
        }
    })
})


server.listen(3000, () => {
    console.log("server running 3000");
})