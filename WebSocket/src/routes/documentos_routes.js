const DocumentosController = require("../controllers/DocumentosController.js");

module.exports = (app) => {
    app.post("/criar-documento", DocumentosController.criarDoc);
    app.get("/listar-documentos", DocumentosController.getAllDocumentos);
    app.get("/getDocumento/:id", DocumentosController.getDocumento);
}