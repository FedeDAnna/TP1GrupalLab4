import express from "express";
import {getNoticiasFiltradas, getNoticiasOrdenadasPorFecha} from "../controladores/NoticiaController";
import router from "./EmpresaRuta";

router.get("/noticias",getNoticiasOrdenadasPorFecha);
router.get("/noticia/:text", getNoticiasFiltradas);

export default router;




