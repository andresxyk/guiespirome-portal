export class OOAD {
    public ciz! : number;
    public clave!: string;
    public descripcion!: string;
    public id!: number;


    public cveOoad!: string;
    
    public descripcionOoad!: string;


    public cveAnterior!: string;
    public cveCiz!: string;
    public cveDelegacion!: string;
    public cveEntidadFederativa!: string;
    public cveRegion!: string;
    public descDelegacion!: string;
    public descDelegacionRep!: string;
    public emailDelegado!: string;
    public expiraVigencia!: string;
    public fechaEfectiva!: string;
    public nombreDelegado!: string;
    public vigencia!: string;

}


export class ResponseLstOOAD {
    public code! : number;
    public estatus!: boolean;
    public mensaje!: string;
    public respuesta!: OOAD[];
   

}



export class ResponseLstOOADMultiselect {
    public code! : number;
    public estatus!: boolean;
   
    public mensaje!: string;
    public respuesta!: OOAD[];
   

}