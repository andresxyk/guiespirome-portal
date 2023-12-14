import { registroConFechas } from "./carga-pdf";

export class XmlLectura {
   file!: any;
   perfil!: string;
   idEspirometro!: string;
}

export class LecturaResponse {
   mensaje!: string;
   respuesta!: [Paciente];
   estatus! :boolean;
   code! :number;
}


export class Paciente {
   pacienteId!: string;
   nssPaciente!: string;
   nombrePaciente!: string;
   apellidoPaciente!: string;
   matriculaMedico!: string;
   fechaPrueba!: string;
   fechasPruebas!: string[];
   selectedFecha?:boolean;
   observaciones!: string;
   estatusValidacion!: boolean;
   estatusCargaArch!:boolean;
   cargarArchivo?: boolean;
  // lstRegistrosPdf!: registroConFechas[];
  datePrueba!: Date;
}
