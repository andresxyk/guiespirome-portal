import { catUMF } from './repOOAD';

export class reqPrueba {
  public ooad!: string[];
  public umf!: catUMF[];
  public nss!: string;
  public fechaInicio!: string;
  public fechaFin!: string;

}

export class respPrueba {
  public mensaje!: string;
  public respuesta!: Prueba[];
  public estatus!: boolean;
  public code!: number;
}

export class Prueba {
  public id!: number;
  public nss!: string;
  public nombrePaciente!: string;
  public matriculaMedico!: string;
  public fechaCarga!: string;
  public fechaPrueba!: string;
  public datePrueba!: Date;

}


export class respReportes {
  public mensaje!: string;
  public respuesta!: Reportes[];
  public estatus!: boolean;
  public code!: number;
}

export class Reportes {
  public idArchivo!: number;
  public nomOriginalArchivo!: string;
  public rutaArchivo!: string;
  public pesoArchivo!: string;
  public nss!: string;

}
