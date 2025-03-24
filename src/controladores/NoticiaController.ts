import { Request, Response, NextFunction } from "express";
import connection from "../basedatos/basedatos";
import { Noticia } from "../modelos/Noticia";

export const getNoticiasDeEmpresa = async (empresaId: number, conn:any): Promise<Noticia[]> => {
    try {
        const [results] = await conn.query("SELECT * FROM noticia WHERE idEmpresa = ?",[empresaId]);

        const noticias: Noticia[] = await Promise.all(
            (results as any[]).map(async (row) => ({
                id: row.id,
                titulo: row.titulo,
                resumen: row.resumen,
                imagen: row.imagen,
                contenido_html: row.contenido_html,
                publicada: row.publicada,
                fecha_publicacion: row.fecha_publicacion,
                borrado: row.borrado
            }))
        )
        return noticias;
    } catch (error) {
        console.error("Error al obtener los detalles del pedido:", error);
      throw error;
    }
}

export const getNoticiasOrdenadasPorFecha = async(req: Request, res: Response, next: NextFunction) => {
    const conn = await connection.getConnection();
    try{
        await conn.beginTransaction();
        const [results] = await conn.query("SELECT * FROM noticia ORDER BY borrado = 0  ORDER BY fecha_publicacion DESC");

        const noticias: Noticia[] = await Promise.all((results as any[]).map(async(row) => ({
            id: row.id,
            titulo : row.titulo,
            resumen : row.resumen,
            imagen : row.imagen,
            contenido_html : row.contenido_html,
            publicada : row.publicada,
            borrado : row.borrado,
            fecha_publicacion : row.fecha_publicacion,
            //empresa_id : row.empresa_id
        }))
    );

        res.status(200).json(noticias);

        await conn.commit();
    
    }catch(error){
        await conn.rollback();
        console.error("Error al obtener el pedido por numero de comprobante: ",error);
        next(error);
    }finally{
        conn.release();
    }
}

export const getNoticiasFiltradas = async(req: Request, res: Response, next: NextFunction) => {
    const conn = await connection.getConnection();
    try{
        await conn.beginTransaction();
        const {textInput} = req.params;
        const [results] = await conn.query("SELECT * FROM noticia ORDER BY borrado = 0 WHERE titulo LIKE ? OR resumen LIKE ? ORDER BY fecha_publicacion DESC",[textInput]);

        const noticias: Noticia[] = await Promise.all((results as any[]).map(async(row) => ({
            id: row.id,
            titulo : row.titulo,
            resumen : row.resumen,
            imagen : row.imagen,
            contenido_html : row.contenido_html,
            publicada : row.publicada,
            borrado : row.borrado,
            fecha_publicacion : row.fecha_publicacion,
            
        }))
    );

        res.status(200).json(noticias);

        await conn.commit();
    
    }catch(error){
        await conn.rollback();
        console.error("Error al obtener el pedido por numero de comprobante: ",error);
        next(error);
    }finally{
        conn.release();
    }
}


export const eliminarNoticiasDeEmpresa = async (conn: any, idEmpresa: string): Promise<void> => {
    try {
        await conn.query('UPDATE noticia SET borrado=1 WHERE idEmpresa=?', [idEmpresa]);
        console.log(`Noticias de empresa con id  ${idEmpresa} eliminados lógicamente.`);
    } catch (error) {
        console.error(`Error al eliminar las noticias de la empresa ${idEmpresa}:`, error);
        throw error; 
    }
};