import { WarningComponent } from 'src/app/components/modals/warning/warning.component';
import { UnidadesComponent } from 'src/app/components/modals/unidades/unidades.component';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CargaXmlService } from 'src/app/services/carga-xml.service';
import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { SwalAlert } from 'src/app/helpers/swal-alert';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Mensajes } from 'src/app/helpers/mensajes';
import { Cabecera } from 'src/app/models/cabecera';
import { Prueba } from 'src/app/models/pruebas';
import { Router } from '@angular/router';
import { CargaPdfService } from 'src/app/services/carga-pdf.service';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';
import { XmlLectura, LecturaResponse, Paciente } from 'src/app/models/carga-xml';
import { atributosArchivo, pdfList, pdfListSave, registroConFechas } from 'src/app/models/carga-pdf';
import { AuthService } from 'src/app/services/auth.service';
import { UserData } from "src/app/models/resOauth";
import { MatTableDataSource } from '@angular/material/table';
import { DataTableDirective } from 'angular-datatables';
import { TooltipPosition } from '@angular/material/tooltip';
import { VerarchivoComponent } from '../../modals/verarchivo/verarchivo.component';

@Component({
  selector: 'app-carga-xml',
  templateUrl: './carga-xml.component.html',
  styleUrls: ['./carga-xml.component.css']
})
export class CargaXmlComponent implements OnInit {
  @Input() parentForm!: FormGroup;

  lstPDFPaciente!: pdfList[];
  blnVerPDF: boolean = false;
  cabecera!: Cabecera;
  lstPruebas: Array<Prueba> = [];
  isAdmin: boolean = true;
  pacientesArray: Array<Paciente> = [];

  numRegistrosValidados: number = 0;
  numRegistrosCorrectos: number = 0;
  sumRegistroCargados: number = 0;
  banXmlCompleto: boolean = false;
  banXmlCarga: boolean = false;
  verArchivo: boolean = false;
  totalRegistros: number = 0;
  user!: UserData | null;

  array: Array<any> = [];
  arrayFaltantes: Array<any> = [];
  xmlSinCarga: boolean = true;
  carga: pdfListSave[] = [];
  lstRegistrosPdfFechas: registroConFechas[] = [];
  lstRegistros: Array<any> = [];
  lstRegistrosPdf: atributosArchivo[] = [];
  banderaAccionar: boolean = false;
  form: any;
  //fileControl = new FormControl();
  //tableControl = new FormControl();
  userData!: UserData | null;
  idEspirometro!: string;
  payload!: XmlLectura;
  menuOpen = false;
  xmlCargo = false;
  limpiamos = false;
  tenemosXml = false;
  lastSelectedFile: File | null = null;
  pacientes = new MatTableDataSource<Paciente>([]);
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  optVacio: DataTables.Settings = {};
  tooltipPosition: TooltipPosition = 'above';


  // Dentro de tu constructor u otro método


  constructor(private xmlService: CargaXmlService,
    private router: Router,
    public _Mensajes: Mensajes,
    public _Swal: SwalAlert,
    public modal: MatDialog,
    private _pdfService: CargaPdfService,
    private formBuilder: FormBuilder,
    private authService: AuthService) {
    //this.buildForm();
    //this.cargaDatadePruba();
  }

  cargaDatadePruba(): void {
    const pacientesData: Paciente[] = [];

    for (let i = 1; i <= 170; i++) {
      const paciente: Paciente = {
        pacienteId: `000${i}`,
        nssPaciente: `NSS${i}`,
        nombrePaciente: `Nombre${i}`,
        apellidoPaciente: `Apellido${i}`,
        matriculaMedico: `Matricula${i}`,
        fechaPrueba: i % 3 === 0 ? '02/02/2021' : '01/02/2019, 08/02/2022, 11/02/2023',
        observaciones: `Observaciones Observaciones${i}`,
        estatusValidacion: i % 2 === 0, // true for even, false for odd
        estatusCargaArch: i % 3 === 0, // true for multiples of 3, false otherwise
        fechasPruebas: [],
        cargarArchivo: false,
        datePrueba: new Date()
      };

      pacientesData.push(paciente);
      this.xmlCargo = true;
    }

    this.pacientes = new MatTableDataSource<Paciente>(pacientesData);
    this.limpiaFechas(this.pacientes);
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      file: ['', [Validators.required]],
      fileControl: ['']
    });
  }

  public configurarCabecera(principal: boolean) {


    this._Swal.msjLoading();
    if (principal) {//carga
      this.cabecera.strTitulo = this._Mensajes.TITULO_CARGA_XML;
      this.cabecera.boolBtn = false;
      this.blnVerPDF = false;
    } else {//ver pdf
      this.cabecera.strTitulo = this._Mensajes.TITULO_VER_REPORTES;
      this.cabecera.boolBtn = true;
      this.cabecera.boolBtnHide = true;
      this.blnVerPDF = true;
    }
    this._Swal.close();
  }

  ngOnInit(): void {
    this.payload = new XmlLectura();
    this.userData = this.authService.sessionUserDataDecoded;
    this.cabecera = new Cabecera();
    this.cabecera.strTitulo = this._Mensajes.TITULO_CARGA_XML;
    this.onUnidad();
    this.buildForm();
    const content = '<?xml version="1.0" encoding="UTF-8"?><root></root>';
    const blob = new Blob([content], { type: 'text/xml' });
    const file = new File([blob], this._Mensajes.MSJ_SELECT_XML);
    this.form.controls.fileControl.patchValue(file);
    this.dtOptions = {
      pagingType: 'simple_numbers',
      paging: true,
      pageLength: 10,
      processing: true,
      lengthChange: false,
      ordering: true,
      info: true,
      searching: false,
      scrollX: true,
      responsive: true,
      columnDefs: [
        { "orderable": false, "targets": [0, 1, 2, 3, 4, 5, 6, 7, 9] },
        { "orderable": true, type: "extract-date", "targets": 8 }
      ],
      order: [[8, 'desc']],
      dom: '<t><"rounded-section margen col-md-12 col-lg-12"<"col-md-3 col-lg-3"i><"col-md-8 col-lg-8 text-right-x"p><"col-md-1 col-lg-1 second-info custom-margin">>',
      language: {
        emptyTable: '',
        zeroRecords: '',
        paginate: {
          first: "First page",
          previous: '<span class="glyphicon glyphicon-menu-left paginacion-icon-navegacion" aria-hidden="true"></span>',
          next: '<span class="glyphicon glyphicon-menu-right paginacion-icon-navegacion" aria-hidden="true"></span>',
          last: "last"
        }
      },
      drawCallback: (settings) => {
        const api = this.dtElement.dtInstance;
        api.then((dtInstance: DataTables.Api) => {
          const pageInfo = dtInstance.page.info();
          const totalRecords = pageInfo.recordsTotal;
          const showPage = pageInfo.page + 1;
          const formattedPage = showPage < 10 ? `0${showPage}` : showPage;

          const totalElement = document.querySelector('.dataTables_info');
          const pageActual = document.querySelector('.second-info');
          if (totalElement) {
            //const formattedTotalRecords = totalRecords < 10 ? `0${totalRecords}` : totalRecords.toString();
            const formattedTotalRecords = totalRecords.toString();
            totalElement.innerHTML = `<p class="textTotResult">Resultados <strong class="totResult">${formattedTotalRecords}</strong></p>`;
          }

          if (pageActual) {
            pageActual.innerHTML = `<div class='pageInfo'>Página<span class='pageInfoBG'>${formattedPage}</span></div>`;
          }
        });
      },
    };

    this.optVacio = {
      paging: false,
      ordering: false,
      info: false,
      searching: false,
      dom: '<t>',
      responsive: true,
      scrollX: true,
      language: {
        emptyTable: '',
        zeroRecords: ''
      },
    };
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.form.controls.fileControl.setValue(file);
  }

  handleFileClick(event: any) {


    if (this.tenemosXml) {
      event.preventDefault();
      this.cargarXML();
      this.tenemosXml = false;
      this.limpiamos = true;
    } else {
      const input = event.target as HTMLInputElement;

      const handleClick = () => {
        if (input.files && input.files.length) {
          const file = input.files[0];
          var extension = file.name.split('.xml').toString().toLowerCase();



          // if (extension == 'xml') {
          if (file.name.toLowerCase().includes('.xml') && file.type === 'text/xml') {
            this.form.controls.fileControl.setValue(file);

            this.payload = new XmlLectura();
            if (this.userData) {
              this.payload.file = file;
              this.limpiamos = true;
              if (this.userData.perfil == 'Administrador') {
                this.payload.perfil = this.userData.perfil;
                this.payload.idEspirometro = this.idEspirometro;
              }
            }

            this.tenemosXml = true;
            if (this.lastSelectedFile && input.files && input.files.length) {
              if (file.name === this.lastSelectedFile.name) {
                //this.limpiaSinXml();
              }
            }
            this.lastSelectedFile = file;

          } else {
            this.tenemosXml = false;
            this.limpiaXML();
            this.onPressWar('Extensión de archivo incorrecta', 'Favor de validar el archivo, solo se admiten archivos XML');
          }
        }
        input.value = '';
      };

      input.addEventListener('change', handleClick);
      const removeEventListener = () => {
        input.removeEventListener('change', handleClick);
        input.removeEventListener('click', removeEventListener);
      };
      input.addEventListener('click', removeEventListener);

      input.click();
    }
  }


  limpiaXML(): void {
    this.limpiamos = false;
    this.xmlCargo = false;
    this.tenemosXml = false;
    this.payload = new XmlLectura();
    this.pacientes = new MatTableDataSource<Paciente>([]);
    const content = '<?xml version="1.0" encoding="UTF-8"?><root></root>';
    const blob = new Blob([content], { type: 'text/xml' });
    const file = new File([blob], this._Mensajes.MSJ_SELECT_XML);
    this.form.controls.fileControl.setValue(file);
    this.form.controls.file.setValue();
    this.cleanInfo();
  }

  limpiaSin(): void {
    this.numRegistrosCorrectos = 0;
    this.sumRegistroCargados = 0;
    this.banXmlCompleto = false;
    this.lstRegistrosPdf = [];
    this.banXmlCarga = false;
    this.xmlSinCarga = true;
    this.totalRegistros = 0;
    this.carga = [];
    this.array = [];
    this.arrayFaltantes = [];
    this.lstRegistrosPdfFechas = [];
    this.tenemosXml = false;
    //this.payload = new XmlLectura();
    this.pacientes = new MatTableDataSource<Paciente>([]);
  }

  limpiaSinXml(): void {
    this.numRegistrosCorrectos = 0;
    this.sumRegistroCargados = 0;
    this.banXmlCompleto = false;
    this.lstRegistrosPdf = [];
    this.banXmlCarga = false;
    this.xmlSinCarga = true;
    this.totalRegistros = 0;
    this.carga = [];
    this.array = [];
    this.arrayFaltantes = [];
    this.lstRegistrosPdfFechas = [];
    this.xmlCargo = false;
    //this.payload = new XmlLectura();
    this.pacientes = new MatTableDataSource<Paciente>([]);
  }

  cargarXML(): void {
    this.limpiaSin();
    this._Swal.msjLoading();
    
    this.xmlService.leerXML(this.payload).subscribe((resp: LecturaResponse) => {
      this._Swal.close();
      if (resp.code == 200) {
        if (resp.mensaje == 'No se encontraron reqistros nuevos') {
          this.msgWarning(this._Mensajes.MSG008);
          this.pacientes = new MatTableDataSource<Paciente>([]);
          this.xmlCargo = true;
        } else {
          this.pacientes = new MatTableDataSource<Paciente>(resp.respuesta);
          this.pacientes.data = this.limpiaFechas(this.pacientes);
          this.xmlCargo = true;
          this.registrosCorrectos(this.pacientes.data);
        }
      } else if (resp.mensaje == 'Error de carga Archivo xml incorrecto, favor de verificar.') {
        this.onPressWar('Error de carga', this._Mensajes.MSG006);
        this.limpiaXML();
      } else {
        this.onPressWar('Error de carga', resp.mensaje);
        this.limpiaXML();
      }
    }, (error: HttpErrorResponse) => {
      this.limpiaXML();
      
      this._Swal.close();
      this._Swal.errorDialog(error);
    });
  }

  limpiaFechas(pacientes: any): any {
    const definitivos: any = { data: [] };

    for (const im of pacientes.data) {
      const fechas = im.fechaPrueba.split(',');

      if (fechas.length > 1) {
        im.fechasPruebas = fechas;
        im.selectedFecha = true;

        for (let i = 0; i < fechas.length; i++) {
          const [day, month, year] = fechas[i].split('/');
          const datePrueba = new Date(+year, +month - 1, +day);

          if (i === 0) {
            im.datePrueba = datePrueba;
            definitivos.data.push(im);
          } else {
            const nuevo = { ...im, datePrueba };
            definitivos.data.push(nuevo);
          }
        }
      } else {
        im.fechasPruebas = [];
        im.selectedFecha = false;

        if (im.fechaPrueba !== "") {
          const [day, month, year] = im.fechaPrueba.split('/');
          im.datePrueba = new Date(+year, +month - 1, +day);
        }
        definitivos.data.push(im);
      }


    }

    return definitivos.data;
  }


  onPressWar(msg1: string, msg2: string): void {
    this.modal.open(WarningComponent, {
      data: {
        icon: 'warning'
        , strMensaje1: msg1
        , strMensaje2: msg2
        , strTituloBoton: 'Aceptar'
      },
      position: { top: '117px' },
    }).disableClose = true;

  }

  onPressError(): void {
    this.modal.open(WarningComponent, {
      data: {
        icon: 'warning'
        , strMensaje1: this._Mensajes.MSG005
        , strMensaje2: this._Mensajes.MSG005_1
        , strTituloBoton: 'Aceptar'
        , strTituloBotonCancel: 'Cancelar'
      },
      position: { top: '117px' },
    }).disableClose = true;

  }


  onPressMsg(): void {
    //this._Swal.invocaError('Alta exitosa','El espirometro se dio de alta correctamente');
    this._Swal.invocaSucces('Alta exitosa', 'El espirometro se dio de alta correctamente');
  }

  onUnidad(): void {
    const dialogConfig = new MatDialogConfig();
    if (this.userData != null) {
      if (this.userData.perfil == 'Administrador') {
        dialogConfig.position = { top: '61px' };
        var ref: MatDialogRef<UnidadesComponent> = this.modal.open(UnidadesComponent, dialogConfig);
        ref.disableClose = true;
        ref.afterClosed().subscribe((unidadSelected) => {
          this.idEspirometro = unidadSelected;
        });
      }
    } else {
      this.router.navigate(['/login'])
    }
  }


  registrosCorrectos(pacientes: Array<Paciente>) {

    this.totalRegistros = pacientes.length;
    this.banXmlCarga = true;

    pacientes.forEach(element => {
      if (element.estatusValidacion) {

        this.numRegistrosCorrectos += 1;
        this.numRegistrosValidados += 1;
        this.xmlSinCarga = false;
      } else {
        this.banXmlCompleto = true;
      }
    });
  }


  fileHandleUpload(event: any, pacienteID: string, fechaPrueba: Date): void {
    if (event.target.files.length > 0) {
      const archivoCapturado = event.target.files[0];
      const nombrePartido = archivoCapturado.name;
      const tamanio = archivoCapturado.size;
      const extension = archivoCapturado.type;
      const nombrePdf = archivoCapturado.name.split('.');


      let fechaIn = fechaPrueba.toLocaleDateString("es-ES");

       if(this.sizeFileMax(tamanio)){

        if (this.validExtension(extension)) {

          this.pacientes.data.map(item => {

            if (item.pacienteId === pacienteID &&
              fechaIn == item.datePrueba.toLocaleDateString("es-ES")) {


              let tamanioFechas = item.fechaPrueba.split(',').length;

              if (tamanioFechas > 1) {
                let fecPdf = nombrePdf[0].split('_');
                let aux = fechaIn.split('/');
                let dia = aux[0];
                let mes = aux[1];
                let anio = aux[2].substring(2, 4);

                if (aux[0].length == 1) {
                  dia = '0' + aux[0]
                }
                if (aux[1].length == 1) {
                  mes = '0' + aux[1]
                }
                let aux2 = dia + mes + anio;

                if (fecPdf[1] == aux2) {


                  let nss = '';
                  nss = item.nssPaciente;

                  const cuerpoArchivo = new FormData;
                  cuerpoArchivo.append('file', archivoCapturado);
                  cuerpoArchivo.append('nss', nss);

                  this._pdfService.validatePdf(cuerpoArchivo).subscribe(success => {


                    if (success.estatus) {
                      if (success.code == 200) {

                        item.estatusCargaArch = true;
                        this.sumRegistroCargados += 1;
                        let addPdf: atributosArchivo = { id: item.pacienteId, baseArchivo: '', file: archivoCapturado, nombre: nombrePartido, nss: nss, fechaPrueba: item.datePrueba }
                        this.lstRegistrosPdf.push(addPdf);



                      }

                    } else {

                      if (success.code == 400) {
                        if (success.mensaje.indexOf("El nombre del archivo es incorrecto") !== -1) {
                          this._Swal.close();

                          this.loadFileErrorMsg(this._Mensajes.MSG001);

                        }
                        if (success.mensaje.indexOf("Extensión incorrecta") !== -1) {

                          this._Swal.close();
                          this.loadFileErrorMsg('Extensión incorrecta, favor de validar');
                        }
                      } else {
                        this._Swal.close();
                        this.msgWarning(success.mensaje);

                      }

                    }
                  }, (error: HttpErrorResponse) => {
                    
                    this._Swal.close();
                    this._Swal.errorDialog(error);

                  });


                } else {


                  this.loadFileErrorMsg(this._Mensajes.MSG001);
                }


              } else {
                let nss = '';
                nss = item.nssPaciente;

                const cuerpoArchivo = new FormData;
                cuerpoArchivo.append('file', archivoCapturado);
                cuerpoArchivo.append('nss', nss);

                this._pdfService.validatePdf(cuerpoArchivo).subscribe(success => {


                  if (success.estatus) {
                    if (success.code == 200) {

                      item.estatusCargaArch = true;
                      this.sumRegistroCargados += 1;
                      let addPdf: atributosArchivo = { id: item.pacienteId, baseArchivo: '', file: archivoCapturado, nombre: nombrePartido, nss: nss, fechaPrueba: item.datePrueba }
                      this.lstRegistrosPdf.push(addPdf);

                      this._Swal.close();

                    }

                  } else {

                    if (success.code == 400) {
                      if (success.mensaje.indexOf("El nombre del archivo es incorrecto") !== -1) {
                        this._Swal.close();

                        this.loadFileErrorMsg(this._Mensajes.MSG001);

                      }
                      if (success.mensaje.indexOf("Extensión incorrecta") !== -1) {

                        this._Swal.close();
                        this.loadFileErrorMsg('Extensión incorrecta, favor de validar');
                      }
                    } else {
                      this._Swal.close();
                      this.msgWarning(success.mensaje);
                    }

                  }
                }, (error: HttpErrorResponse) => {
                  
                  this._Swal.close();
                  this._Swal.errorDialog(error);

                });

              }




            }

          })

        } else {

          this.msgWarning('Extensión de archivo incorrecta, favor de validar');
          this._Swal.close();
        }

      }else{
        this.msgWarning('Tamaño de archivo incorrecto, favor de validar');
      }
    } else {

      this.msgWarning(this._Mensajes.MSG021);
      this._Swal.close();
    }

  }



  private sizeFileMax(size: number): boolean {
    const sizeMax = 5242880;
    let valid = false;
    if (size <= sizeMax) {
      return valid = true;
    } else return valid;

  }

  private validExtension(type: string): boolean {
    let valid = false;
    if (type === 'application/pdf') {
      valid = true;
      return valid;
    } else return valid;
  }

  extraerBase64 = async ($event: any) => new Promise((resolve) => {

    const reader = new FileReader();

    reader.readAsDataURL($event);
    reader.onload = () => {
      resolve({
        base: reader.result
      })
    }
  })

  msgWarning(mensaje: string) {
    this.modal.open(WarningComponent, {
      data: {
        icon: 'warning'
        , strMensaje1: mensaje
        , strTituloBoton: 'Aceptar'
      },
      position: { top: '117px' },
    }).disableClose = true;

  }


  loadFileErrorMsg(msg: string) {
    this._Swal.invocaError('Error de carga', msg);
  }



  enviarInfo(nRegEnviados: string, nRegAlmacenados: string) {

    let cargaExitosa = false;
    let num_registros = "";
    let total_registros = "";
    num_registros = String(this.lstRegistrosPdf.length);
    total_registros = String(this.pacientes.data.length);
    this._Swal.msjLoading();
    let calss = this.lstRegistrosPdf.map((item, i) => {

      const bodyDocument = new FormData;
      bodyDocument.append('file', item.file)
      bodyDocument.append('nss', item.nss)
      return this._pdfService.saveDocument(bodyDocument).pipe(map((result) => {
        if (result.code == 500) {
          cargaExitosa = false;
        }
        if (result.code == 200) {
          cargaExitosa = true;
        }

      }));
    });

    forkJoin(calss).subscribe(response => {
      if (cargaExitosa) {
        this._Swal.close();
        this.loadInfoSucessMsg(String(num_registros), String(total_registros));
        this.limpiaXML();
      } else {
        this._Swal.close();
        this.msgWarning(this._Mensajes.MSG020);
      }



    },
      (error: HttpErrorResponse) => {
        this._Swal.close();
        this._Swal.errorDialog(error);
      }
    );
  }

  loadInfoSucessMsg(total_Almacenado: string, total_Enviado: string): void {


    this._Mensajes.MSG003 = 'R_A de R_E  registros fueron almacenados de forma exitosa';
    this._Mensajes.MSG003 = this._Mensajes.MSG003.replace('R_A', total_Almacenado);
    this._Mensajes.MSG003 = this._Mensajes.MSG003.replace('R_E', total_Enviado);
    this._Swal.invocaSucces('Carga exitosa', this._Mensajes.MSG003);
  }

  verPDF(pacienteId: string, fecha: Date) {
    if (navigator.onLine) {

      let data = {};
      let fechaIn = fecha.toLocaleDateString("es-ES");
      let verError = false;

      this.lstRegistrosPdf.forEach(i => {
        if (i.id == pacienteId && fechaIn == i.fechaPrueba.toLocaleDateString("es-ES")) {
          data = {
            archivoBase: i.baseArchivo,
            blob: i.file,
            nombre: i.nombre
          }
          verError = true;
        }
      })

      const dialogo1 = this.modal.open(VerarchivoComponent, { data,position: { top: '117px' },});
    } else {
      this.msgWarning(this._Mensajes.MSG022);
    }
  }


  btnEnviar(): void {

    if (this.lstRegistrosPdf.length > 0 && !this.xmlSinCarga) {

      let regCorrectos = this.numRegistrosCorrectos.toString();
      let total = this.totalRegistros.toString();
      if (this.numRegistrosCorrectos == this.sumRegistroCargados) {

        if (this.banXmlCompleto) {
          const dialog1 = this.modal.open(WarningComponent, {
            data: {
              icon: 'warning'
              , strMensaje1: this._Mensajes.MSG005
              , strMensaje2: this._Mensajes.MSG005_1
              , strTituloBotonCancel: 'Cancelar'
              , strTituloBoton: 'Aceptar'
            },
            position: { top: '117px' },
          });

          dialog1.afterClosed().subscribe((res: any) => {
            if (res != undefined) {
              this.enviarInfo(total, regCorrectos);
            }
          })

        } else {

          this.enviarInfo(total, regCorrectos);
        }
      } else {
        this._Swal.close();

        this.msgWarning(this._Mensajes.MSG017);
      }
    } else {
      this.msgWarning(this._Mensajes.MSG017);
    }

  }

  cleanInfo() {

    this.numRegistrosCorrectos = 0;
    this.sumRegistroCargados = 0;
    this.banXmlCompleto = false;
    this.lstRegistrosPdf = [];
    this.banXmlCarga = false;
    this.xmlSinCarga = true;
    this.totalRegistros = 0;
    this.carga = [];
    this.array = [];
    this.arrayFaltantes = [];
    this.lstRegistrosPdfFechas = [];
    this.payload = new XmlLectura();
    this.pacientes = new MatTableDataSource<Paciente>([]);
    const content = '<?xml version="1.0" encoding="UTF-8"?><root></root>';
    const blob = new Blob([content], { type: 'text/xml' });
    const file = new File([blob], this._Mensajes.MSJ_SELECT_XML);
    this.form.controls.fileControl.setValue(file);
  }

}
