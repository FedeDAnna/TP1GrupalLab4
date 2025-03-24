import express from "express";
import { getEmpresa, deleteEmpresa, getEmpresaXid, actualizarEmpresa, restablecer } from "../controladores/EmpresaController";

const router = express.Router();






router.get("/empresas",getEmpresa);
router.get("/empresas/:id",getEmpresaXid);
router.delete("/empresas/:id",deleteEmpresa);
router.put("/empresas/restablecer",restablecer);
router.put("/empresas/:id",actualizarEmpresa);


export default router;