export class UnidadMedica {
    public id!: number;
    public descripcion!: string;
    public cvePresupuestal!: string;
    public cveDelegacion!: string;
    public cveEntidadFederativa!: string;
    public cveNivelAtencion!: string;
    public nomUnidadMedica!: string;
    public direccion!: string;

    public cveUmf!: string;
    public descripcionUmf!: string;
    
}

export class ResponseLstUM {
    public code!: number;
    public estatus!: boolean;
    public mensaje!: string;
    public respuesta!: UnidadMedica[];
}

export class ClavePresupuestal {
    public checked!: boolean;
    public clavePresupuestal!: string;
    public clavePresupuestalRecortada!: string;
    public descripcion!: string;
    public idClavePresupuestal!: number;
}

export class UnidadMedicaEspirometro {
  public nomUnidadMedica!: string;
  public medicoResponsable!: string;
  public idEspirometro!: string;
  public cveUnidadMedica!: string;
  public areaResponsable!: string;

}

export class ResponseLstUMEspirometro {
    public code!: number;
    public estatus!: boolean;
    public mensaje!: string;
    public respuesta!: UnidadMedicaEspirometro[];
}
