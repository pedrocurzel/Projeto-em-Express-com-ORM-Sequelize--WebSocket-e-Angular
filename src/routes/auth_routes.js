const AuthController = require("../controllers/AuthController.js");

module.exports = (app) => {
    app.post("/login", AuthController.login);
    app.post("/criar-conta", AuthController.criarUsuario);
    app.get("/validate-token", AuthController.validateToken);
}