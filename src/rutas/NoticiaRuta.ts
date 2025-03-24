import express from "express";
import { deleteNoticia, actualizarNoticia, guardarNoticia, getNoticiasXEmpresa } from "../controladores/NoticiaController";


const router = express.Router();

router.get("/noticias/noticiasXempresaId/:idEmpresa",getNoticiasXEmpresa);
router.delete("/noticias/:id",deleteNoticia);
router.put("/noticias",actualizarNoticia);
router.post("/noticias",guardarNoticia)



export default router;