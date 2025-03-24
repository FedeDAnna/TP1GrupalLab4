import express from "express";
import {getNoticiasOrdenadasPorFecha, getNoticiasFiltradas} from "../controladores/NoticiaController";
import router from "./EmpresaRuta";

router.get("/noticias",getNoticiasOrdenadasPorFecha);
router.get("/noticias/filtradas/:textInput", getNoticiasFiltradas);


export default router;




