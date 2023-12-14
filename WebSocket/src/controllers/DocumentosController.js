const database = require("../../models");

module.exports = class DocumentosController {
    static async getAllDocumentos(req, res) {
        try {
            var docs = await database.Documentos.findAll();
            return res.status(200).json({
                error: false,
                message: "Documentos recuperados com sucesso!",
                docs
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: error.message
            });
        }
    }

    static async criarDoc(req, res) {
        let doc = req.body;
        try {
            var docCriado = await database.Documentos.create(doc);
            return res.status(201).json({
                error:false,
                message: "Documento criado!",
                docCriado
            });
        } catch(error) {
            return res.status(500).json({
                error:true,
                message: error.message
            });
        }
    }

    static async getDocumento(req, res) {
        const {id} = req.params;
        try {
            var doc = await database.Documentos.findOne({where: {id}})
            return res.status(200).json({
                error: false,
                message: "Sucesso!",
                doc
            })
        } catch(err) {
            return res.status(500).json({
                error: true,
                message: err.message
            })
        }
    }
}