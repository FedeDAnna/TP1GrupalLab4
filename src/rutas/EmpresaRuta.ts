import express from "express";
import { getEmpresa, deleteEmpresa } from "../controladores/EmpresaController";

const router = express.Router();


router.get("/empresas",getEmpresa);
router.delete("/empresas/:id",deleteEmpresa);



export default router;