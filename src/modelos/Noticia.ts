import { Empresa } from "./Empresa"; 

export class Noticia{
    id: number;
    titulo: string;
    resumen: string;
    imagen: string;
    contenido_html: string;
    publicada: boolean;
    fecha_publicacion: Date;
    empresa: Empresa;
    borrado: number;

    constructor(id: number, titulo: string, resumen:string, imagen: string, contenido_html: string, publicada: boolean, fecha_publicacion: Date,empresa: Empresa ,borrado: number){
        this.id = id;
        this.titulo = titulo;
        this.resumen = resumen;
        this.imagen = imagen;
        this.contenido_html = contenido_html;
        this.publicada = publicada;
        this.fecha_publicacion = fecha_publicacion;
        this.empresa = empresa;
        this.borrado = borrado;
    }
}