import { Noticia } from "./Noticia";

export class Empresa {
    id: number;
    denominacion: string;
    telefono: string;
    horario_atencion: string;
    quienes_somos: string;
    latitud: number;
    longitud: number;
    domicilio: string;
    email: string;
    borrado: number;
    noticias: Noticia[];

    constructor(
        id: number,
        denominacion: string,
        telefono: string,
        horario_atencion: string,
        quienes_somos: string,
        latitud: number,
        longitud: number,
        domicilio: string,
        email: string,
        borrado: number = 0
  ) {
    this.id = id;
    this.denominacion = denominacion;
    this.telefono = telefono;
    this.horario_atencion = horario_atencion;
    this.quienes_somos = quienes_somos;
    this.latitud = latitud;
    this.longitud = longitud;
    this.domicilio = domicilio;
    this.email = email;
    this.borrado = borrado;
  }
}
