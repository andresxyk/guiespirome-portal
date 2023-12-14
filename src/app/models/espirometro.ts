import { OOAD } from "./OOAD";

export class Espirometro {
    public idEquipoEspirometro?: number;
    public numeroSerie!: string;
    public nni!: string;
    public cveEntidadFederativa!: string;
    public nomEntidadFederativa!: string;
  
    public claveOoad!: string;
  //  public claveooad!: string;
    public ooad!: string;
    public unidadMedica!: string;
    public areaResponsable!: string;
    public medicoResponsable!: string;
    public matriculaMedico!: string;
    public telMedico!: number;
    public ext!: string;
    public claveunidadMedica!: string;
   

    public ubicacion!: string;
    public clavePresupuestal!: string;
    public indActivo!: boolean;
}

export class buscarEspirometro {
    public ooad!: string;
    public serie!: string;
    public ubicacion!: string;
}

export class BusquedaRequest {
    public ooad!: Array<string>;
    public umf!: Array<string>;
    public numeroserie!: string;
}


export class responseLstEspirometros {
    public mensaje!: string;
    public respuesta!: Espirometro[];
    public estatus!: boolean;
    public code!: number;
}

export class responseMSEspirometros {
    public mensaje!: string;
    public respuesta!: any;
    public estatus!: boolean;
    public code!: number;
}
