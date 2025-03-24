import express from "express";
import { deleteNoticia, actualizarNoticia, guardarNoticia, getNoticiasXEmpresa, getNoticiasOrdenadasPorFecha, getNoticiasFiltradas } from "../controladores/NoticiaController";
const router = express.Router();

router.get("/noticias/noticiasXempresaId/:idEmpresa",getNoticiasXEmpresa);
router.delete("/noticias/:id",deleteNoticia);
router.put("/noticias",actualizarNoticia);
router.post("/noticias",guardarNoticia)
router.get("/noticias",getNoticiasOrdenadasPorFecha);
router.get("/noticias/filtradas/:textInput", getNoticiasFiltradas);
export default router;



