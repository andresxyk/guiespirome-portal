export class Entidad {
    public clave! : string;
    public claveRenapo!: string;
    public idRenapo!: string;
    public nombre!: string;
   

}

export class ResponseLstEntidades {
    public code! : number;
    public estatus!: boolean;
    public mensaje!: string;
    public respuesta!: Entidad[];
   

}