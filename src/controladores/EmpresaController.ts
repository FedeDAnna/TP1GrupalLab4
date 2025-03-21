import { Request, Response, NextFunction } from "express";
import connection from "../basedatos/basedatos";
import { Empresa } from "../modelos/Empresa";
import { getNoticiasDeEmpresa , eliminarNoticiasDeEmpresa} from "./NoticiaController";

export const getEmpresaXid = async (req: Request, res:Response, next:NextFunction) =>{
    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();
        
        const {id} = req.params;
        const [results] = await conn.query("SELECT * FROM empresa WHERE id = ? AND borrado=0", [id]);
        const empresa: Empresa[] = await Promise.all((results as any[]).map(async (row) => ({
            id: row.id,
            denominacion: row.denominacion,
            telefono: row.telefono,
            horario_atencion: row.horario_atencion,
            quienes_somos: row.quienes_somos,
            latitud: row.latitud,
            longitud: row.longitud,
            domicilio: row.domicilio,
            email: row.email,
            borrado: row.borrado,
            noticias: await getNoticiasDeEmpresa(row.id,conn), // Obtener los detalles del pedido
          }))
        );

        res.status(200).json(empresa[0]);

        await conn.commit();
    } catch (error) {
        console.error("Error al obtener el cliente por ID:", error);
        throw error;
    }
};

export const getEmpresa = async (req: Request, res:Response, next:NextFunction) =>{
    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();
        const [results] = await conn.query("SELECT * FROM empresa WHERE borrado=0");
        
        const empresas: Empresa[] = await Promise.all((results as any[]).map(async (row) => ({
            id: row.id,
            denominacion: row.denominacion,
            telefono: row.telefono,
            horario_atencion: row.horario_atencion,
            quienes_somos: row.quienes_somos,
            latitud: row.latitud,
            longitud: row.longitud,
            domicilio: row.domicilio,
            email: row.email,
            borrado: row.borrado,
            noticias: await getNoticiasDeEmpresa(row.id,conn), // Obtener los detalles del pedido
          }))
        );

        res.status(200).json(empresas);

        await conn.commit();
    } catch (error) {
        await conn.rollback();
        console.error("Error al obtener el pedido por número de comprobante:", error);
        next(error);
    } finally {
        conn.release();
    }
}

export const deleteEmpresa = async (req: Request, res:Response, next:NextFunction) => {
    const conn = await connection.getConnection();
    try {
        conn.beginTransaction();
        const {id} = req.params;
        
        if (!id) {
            res.status(400).json({ message: "Se requiere un id para eliminar la empresa." });
            return;
        }
        
        await eliminarNoticiasDeEmpresa(conn, id);


        const [result] = await conn.query("UPDATE empresa SET borrado = 1 WHERE id = ?",[id]);
        await conn.commit();
        
        res.status(200).json({ message: "Empresaaa eliminada lógicamente con éxito.", id ,result });
        
    } catch (error) {
        conn.rollback();
        console.error("error al eliminar la empresa",error);
        res.status(500).json({ message: "Error al eliminar la empresa", error });
    } finally{
        conn.release();
    }
}
