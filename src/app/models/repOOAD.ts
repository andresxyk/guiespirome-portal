export class respOOAD {
  public mensaje!: string;
  public respuesta!: catOOAD[];
  public estatus!: boolean;
  public code!: number;
}

export class catOOAD {
  public cveOoad!: string;
  public descripcionOoad!: string;
}

export class respUMF {
  public mensaje!: string;
  public respuesta!: catUMF[];
  public estatus!: boolean;
  public code!: number;
}

export class catUMF {
  public cvePresupuestal!: string;
  public descripcionUmf!: string;
  public areaResponsableEquipo!: string;
}
