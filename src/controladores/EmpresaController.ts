import { Request, Response, NextFunction } from "express";
import connection from "../basedatos/basedatos";
import { Empresa } from "../modelos/Empresa";
import { getNoticiasDeEmpresa , eliminarNoticiasDeEmpresa} from "./NoticiaController";

export const getEmpresaXid = async (req: Request, res: Response, next: NextFunction) => {
    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();

        const { id } = req.params;
        const empresa = await obtenerEmpresaPorId(Number(id), conn);

        res.status(200).json(empresa);

        await conn.commit();
    } catch (error) {
        console.error("Error al obtener la empresa:", error);
        await conn.rollback();
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        conn.release();
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
            noticias: await getNoticiasDeEmpresa(row.id,conn), // Obtener los detalles de las noticias
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

export const actualizarEmpresa = async(req: Request, res: Response, next: NextFunction) => {
    const conn = await connection.getConnection();
    try {
        conn.beginTransaction()
        const empresa = req.body;
        //console.log(empresa);
        const [result] = await conn.query(
            `UPDATE empresa SET denominacion = ?, telefono = ?, horario_atencion = ?, quienes_somos = ?, latitud=?, longitud=?, domicilio=?, email = ? WHERE id = ? AND borrado = 0`,
            [empresa.denominacion, empresa.telefono, empresa.horario_atencion, empresa.quienes_somos, empresa.latitud, empresa.longitud, empresa.domicilio, empresa.email,empresa.id]
        );

        res.status(200).json({ message: "Empresa actualizada con éxito." });

        await conn.commit();

    } catch (error) {
        await conn.rollback();
        next(error);
      } finally {
        conn.release();
      }
}

export const restablecer = async(req: Request, res: Response, next: NextFunction) =>  {
    const conn = await connection.getConnection();
    try {
        conn.beginTransaction()
        console.log("HOLA")
        const [result] = await conn.query(`UPDATE empresa SET borrado = 0 WHERE borrado = 1`);
        const [result2] = await conn.query(`UPDATE noticia SET borrado = 0 WHERE borrado = 1`);
        console.log("Resultado de la actualización de empresa:", result);
        res.status(200).json({ message: "Empresa  restablecida con éxito." });

        await conn.commit();

    } catch (error) {
        await conn.rollback();
        next(error);
      } finally {
        conn.release();
      }
}

export const obtenerEmpresaPorId = async (id: number, conn: any): Promise<Empresa | null> => {
    const [results] = await conn.query("SELECT * FROM empresa WHERE id = ? AND borrado=0", [id]);
    
    if (results.length === 0) return null;

    const row = results[0];

    const empresa: Empresa = {
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
        noticias: await getNoticiasDeEmpresa(row.id, conn),
    };

    return empresa;
};

export const guardarEmpresa = async(req: Request, res: Response, next: NextFunction) => {
    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();
        const empresa = req.body;

        console.log(empresa);
        const [result] = await conn.query(
            "INSERT INTO empresa (denominacion, telefono, horario_atencion, quienes_somos, latitud, longitud, domicilio, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                empresa.denominacion,
                empresa.telefono,
                empresa.horario_atencion,
                empresa.quienes_somos,
                empresa.latitud,
                empresa.longitud,
                empresa.domicilio,
                empresa.email
            ]
        );

        await conn.commit();
        res.status(201).json({message: "Empresa creada con éxito"});
    } catch (error) {
        await conn.rollback();
        console.error("Error al guardar la empresa:", error);
        res.status(500).json({ message: "Error al guardar la empresa" });
    } finally {
        conn.release();
    }
}