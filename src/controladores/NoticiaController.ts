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