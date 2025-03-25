import express from "express";
import { getEmpresa, deleteEmpresa, getEmpresaXid, actualizarEmpresa, restablecer,guardarEmpresa } from "../controladores/EmpresaController";

const router = express.Router();

router.get("/empresas",getEmpresa);
router.get("/empresas/:id",getEmpresaXid);
router.delete("/empresas/:id",deleteEmpresa);
router.put("/empresas/restablecer",restablecer);
router.put("/empresas/:id",actualizarEmpresa);
router.post("/empresas",guardarEmpresa)


export default router;