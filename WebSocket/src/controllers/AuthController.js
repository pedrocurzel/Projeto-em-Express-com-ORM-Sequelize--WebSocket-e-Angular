const database = require("../../models");
const jwtokenService = require("../services/JWToken-service.js");

module.exports = class AuthController {

    static async login(req, res) {
        const user = req.body;
        try {
            var userDb = await database.Usuario.findOne({where: {email: user.email, password: user.password}});
            if (userDb) {
                let token = jwtokenService.createToken(JSON.stringify(userDb));
                return res.status(200).json({
                    error: false,
                    message: "Usuario logado com sucesso!",
                    token,
                    user: {
                        nome: userDb.nome,
                        email: userDb.email
                    }
                })
            }
            throw new Error("Email ou senha incorretos");
        } catch(error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: "erro ao criar usuario",
                teste: error.message
            });
        }
    }

    static async criarUsuario(req, res) {
        const newUser = req.body;
        try {
            var created = await database.Usuario.create(newUser);
            return res.status(200).json({
                error: false,
                message: "usuario criado",
                usuarioId: created.id
            });
        } catch(error) {
            return res.status(500).json({
                error: true,
                message: "erro ao criar usuario",
                teste: error.message
            });
        }
    }

    static async validateToken(req, res) {
        let {token} = req.query;
        try {
            let isValid = jwtokenService.validateToken(token);
            //console.log(isValid);
            return res.status(200).json({error:false, isValid:true});
        } catch(error) {
            console.log(error);
            return res.status(500).json({
                error:true,
                message: error.message,
                isValid:false
            })
        }
    }
}