const ChatsController = require("../controllers/ChatsController.js");

module.exports = (app) => {
    app.get("/get-users/:id", ChatsController.getUsuario);
    app.get("/verifica-chat/:userId1/:userId2", ChatsController.verificaChat)
}