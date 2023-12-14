const database = require("../../models");
const { Op } = require("sequelize");

module.exports = class ChatsController {
    static async getUsuario(req, res) {
        const {id} = req.params;
        try {
            var usuarios = await database.Usuario.findAll({attributes: ['nome', 'id'], where: {id: {[Op.not]: id}}});
            console.log(usuarios);
            return res.status(200).json({
                error: false,
                usuarios
            });
        } catch(err) {
            return res.status(500).json({
                error: true,
                message: err.message
            });
        }
    }

    static async verificaChat(req, res) {
        const usuarioLogadoId = req.params.userId1;
        const usuarioChatId = req.params.userId2;
        try {
            console.log("asdasdasdasd");
            let response = await database.Chat.findOne({
                where: {
                    userId1: {
                        [Op.or]: [usuarioLogadoId, usuarioChatId]
                    },
                    userId2: {
                        [Op.or]: [usuarioLogadoId, usuarioChatId]
                    }
                }
            })
            if (!response) {
                let chatCreated = await database.Chat.create({
                    userId1: usuarioLogadoId,
                    userId2: usuarioChatId
                });
                return res.status(200).json({
                    error: false,
                    chatCreated
                })
            }
            return res.status(200).json({
                error: false,
                chatCreated: response
            })
            
        } catch(error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: error.message
            })
        }
    }
}