const jwtoken = require("jsonwebtoken");
const SECRET_KEY = "secret_teste_json_web_token";

module.exports = {
    createToken: (usuario) => {
        return jwtoken.sign(usuario, SECRET_KEY);
    },

    validateToken: (token) => {
        return jwtoken.verify(token, SECRET_KEY);
    }
}