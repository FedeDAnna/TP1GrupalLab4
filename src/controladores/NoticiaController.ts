import { Request, Response, NextFunction } from "express";
import connection from "../basedatos/basedatos";
import { Noticia } from "../modelos/Noticia";

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


export const eliminarNoticiasDeEmpresa = async (conn: any, idEmpresa: string): Promise<void> => {
    try {
        await conn.query('UPDATE noticia SET borrado=1 WHERE idEmpresa=?', [idEmpresa]);
        console.log(`Noticias de empresa con id  ${idEmpresa} eliminados lógicamente.`);
    } catch (error) {
        console.error(`Error al eliminar las noticias de la empresa ${idEmpresa}:`, error);
        throw error; 
    }
};