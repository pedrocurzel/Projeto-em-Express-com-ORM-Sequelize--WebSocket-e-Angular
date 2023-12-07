const express = require("express");
const auth_routes = require("./routes/auth_routes.js");
const doc_routes = require("./routes/documentos_routes.js");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");
const database = require("../models");

const app = express();
app.use(cors());
app.use(express.json());
auth_routes(app);
doc_routes(app);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
let usuariosPorSala = {};
io.on("connection", (socket) => {
    console.log(`connect ${socket.id}`);
    socket.on("conectar_sala", async (sala) => {
        socket.join(sala.sala);
        if (!usuariosPorSala[sala.sala]) {
            usuariosPorSala[sala.sala] = [];
            usuariosPorSala[sala.sala].push({user: sala.usuario, socket: socket.id, sala: sala.sala});
        } else {
            usuariosPorSala[sala.sala].push({user: sala.usuario, socket: socket.id, sala: sala.sala});
        }
        let valorBanco = await database.Documentos.findOne({where: {nome: sala.sala}});
        io.to(sala.sala).emit("usuario_conectou", usuariosPorSala[sala.sala]);
        io.to(sala.sala).emit("valores_banco", valorBanco.valor);
    })

    socket.on("documento_criado", async () => {
        io.emit("documento_criado", (await database.Documentos.findAll()));
    })

    socket.on("delete_doc", (docName) => {
        database.Documentos.destroy({where: {nome: docName}});
        socket.broadcast.emit("delete_doc", docName);
    })

    socket.on("valor_textarea", async (valor) => {
        await database.Documentos.update({valor: valor.valor}, {where: {nome: valor.sala}});
        socket.to(valor.sala).emit("valor_textarea", valor.valor);
    })

    socket.on("disconnect", (user) => {
        console.log(`disconnect ${user}`);
        for (const [key, value] of Object.entries(usuariosPorSala)) {
            value.forEach((val, i) => {
                if (val.socket == socket.id) {
                    usuariosPorSala[key].splice(i, 1);
                    io.to(val.sala).emit("usuario_conectou", usuariosPorSala[val.sala]);
                }
            })
        }
  
    })
})


server.listen(3000, () => {
    console.log("server running 3000");
})