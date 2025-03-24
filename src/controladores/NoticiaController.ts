import { ResultSetHeader } from "mysql2";
import { Request, Response, NextFunction } from "express";
import connection from "../basedatos/basedatos";
import { Noticia } from "../modelos/Noticia";
import { stat } from "fs";

export const getNoticiasDeEmpresa = async (empresaId: number, conn:any): Promise<Noticia[]> => {
    try {
        const [results] = await conn.query("SELECT * FROM noticia WHERE idEmpresa = ? AND borrado = 0",[empresaId]);

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
        try {
        await conn.beginTransaction();
    
        const { textInput } = req.params;
        const valorBusqueda = `%${textInput}%`; // Agregamos comodines %
    
        const [results] = await conn.query(
            "SELECT * FROM noticia WHERE borrado = 0 AND (titulo LIKE ? OR resumen LIKE ?) ORDER BY fecha_publicacion DESC",
            [valorBusqueda, valorBusqueda]
        );

        //console.log("Noticias encontradas:", results);

        const noticias: Noticia[] = (results as any[]).map(row => ({
            id: row.id,
            titulo: row.titulo,
            resumen: row.resumen,
            imagen: row.imagen,
            contenido_html: row.contenido_html,
            publicada: row.publicada,
            borrado: row.borrado,
            fecha_publicacion: row.fecha_publicacion
        }));
    
        res.status(200).json(noticias);
        await conn.commit();
        } catch (error) {
        await conn.rollback();
        console.error("Error al obtener las noticias filtradas:", error);
        next(error);
        } finally {
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

 
export const deleteNoticia = async (req: Request, res: Response, next: NextFunction) => {
    const conn = await connection.getConnection();
    try {
        conn.beginTransaction();
        const {id} = req.params;
        
        if (!id) {
            res.status(400).json({ message: "Se requiere un id para eliminar la noticia." });
            return;
        }
        
        const [result] = await conn.query("UPDATE noticia SET borrado = 1 WHERE id = ?",[id]);
        
        await conn.commit();
        
        res.status(200).json({ message: "Noticia eliminada lógicamente con éxito.", id ,result });
    } catch (error) {
        conn.rollback();
        console.error("error al eliminar la noticia",error);
        res.status(500).json({ message: "Error al eliminar la noticia", error });
    } finally{
        conn.release();
    }
}

export const actualizarNoticia = async (req: Request, res: Response, next: NextFunction) => {
    const conn = await connection.getConnection();
    try {
        conn.beginTransaction();
        const noticia = req.body;
        //console.log(noticia);
        const [result] = await conn.query(
            `UPDATE noticia SET titulo = ?, resumen = ?, imagen = ?, contenido_html = ?, publicada=?, fecha_publicacion=? WHERE id = ? AND borrado = 0`,
            [noticia.titulo, noticia.resumen, noticia.imagen, noticia.contenidohtml, noticia.publicada, noticia.fecha_publicacion, noticia.id]
        );
        
        res.status(200).json({ message: "Noticia actualizado con éxito." });

        await conn.commit();
    } catch (error) {
        await conn.rollback();
        next(error);
    } finally {
        conn.release();
    }
}

export const guardarNoticia = async (req: Request, res: Response, next: NextFunction) => {
    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();
        const noticia = req.body;
        //console.log(noticia);

        const [result] = await conn.query<ResultSetHeader>(
            "INSERT INTO noticia (titulo, resumen, imagen, contenido_html, publicada, fecha_publicacion, idEmpresa) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
              noticia.titulo,
              noticia.resumen,
              noticia.imagen,
              noticia.contenido_html,
              noticia.publicada,
              noticia.fecha_publicacion,
              noticia.idEmpresa
            ]
        );

        await conn.commit();
        res.status(201).json({ 
            message: "Noticia creada con éxito", 
            noticia: {
                id: result.insertId,
                ...noticia
            }
        });
    } catch (error) {
        await conn.rollback();
        console.error("Error al guardar la notica:", error);
        res.status(500).json({ message: "Error al guardar la noticia" });
    } finally {
        conn.release();
    }
};

export const getNoticiasXEmpresa = async (req: Request, res: Response, next: NextFunction) => {
    const conn = await connection.getConnection()
    try {
        conn.beginTransaction();
        const empresaId = req.params.idEmpresa;
        
        const [results] = await conn.query("SELECT * FROM noticia WHERE idEmpresa = ?",empresaId);
        console.log(results);
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
        await conn.commit();
        console.log(noticias); //esto está vacio
        res.status(200).json(noticias);
    } catch (error) {
        await conn.rollback();
        console.error("Error al obtener los noticias por Empresas", error);
      throw error;
    } finally{
        conn.release();
    }
};
