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
            await database.Documentos.create(doc);
            return res.status(201).json({
                error:false,
                message: "Documento criado!"
            });
        } catch(error) {
            return res.status(500).json({
                error:true,
                message: error.message
            });
        }
    }
}