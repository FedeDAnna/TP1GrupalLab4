import express from "express";
import { getEmpresa, deleteEmpresa, getEmpresaXid } from "../controladores/EmpresaController";

const router = express.Router();


router.get("/empresas",getEmpresa);
router.get("/empresas/:id",getEmpresaXid);
router.delete("/empresas/:id",deleteEmpresa);



export default router;