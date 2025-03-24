import express from "express";
import {getNoticiasOrdenadasPorFecha} from "../controladores/NoticiaController";
import router from "./EmpresaRuta";

router.get("/noticias",getNoticiasOrdenadasPorFecha);

export default router;




