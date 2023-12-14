export class atributosArchivo {
  id! : string ;
  baseArchivo! : string ;
  file : any ;
  nombre! : string;
  nss! : string;
  fechaPrueba! : Date;
}

  export class responseManual {
    mensaje!: string;
    respuesta!: respuesta;
    estatus!: boolean;
    code!: number;
  }

  export class respuesta {
    ruta!: string;
  }

  export class registroConFechas {
    id! : string ;
    baseArchivo! : string ;
    file! : pdfList [] ;
    nombre! : string;
    nss! : string;
    bandera! : boolean;
  }

  export class pdfList {
    file! : any ;
    name! : string;
    id!: string;
  }

  export class pdfListSave{
    file! : any ;
    nss! : string;
  }