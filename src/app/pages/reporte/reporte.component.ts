import { ConsultaService } from './../../_service/consulta.service';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-repote',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  chart: any;
  tipo: string;
  pdfSrc: string = '';

  selectedFiles: FileList;
  currentFileUpload: File;

  labelFile: string;
  imagenData: any;
  imagenEstado: boolean = false; 

  constructor(private consultaService: ConsultaService, private sanitization: DomSanitizer) { }

  ngOnInit() {
    this.tipo = 'line';
    this.dibujar();

    this.consultaService.leerArchivo().subscribe(data => {
      //this.imagenData = data;
      this.convertir(data);
    });
  }

  convertir(data : any){
    let reader = new FileReader();
    reader.readAsDataURL(data);    
    reader.onloadend = () => {
      let x = reader.result;                
      this.setear(x);
    }
  }

  setear(x: any) {
    //console.log(x);
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(x);   
  }

  cambiar(tipo: string) {
    this.tipo = tipo;
    if(this.chart){
      this.chart.destroy();
    }    
    this.dibujar();
  }

  dibujar() {
    this.consultaService.listarResumen().subscribe(data => {
      console.log(data);
      let cantidad = data.map(res => res.cantidad);
      let cantidadN = data.map(res => res.cantidad + 1);
      let cantidadA = data.map(res => res.cantidad + 2);
      let fechas = data.map(res => res.fecha);

      this.chart = new Chart('canvas', {
        type: this.tipo,
        data: {
          labels: fechas,
          datasets: [
            {
              label: 'Cantidad',
              data: cantidad,
              borderColor: "#3cba9f",
              fill: false,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 0, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ]
            },
            {
              label: 'CantidadN',
              data: cantidadN,
              borderColor: "red",
              fill: false,
              backgroundColor: [
                'rgba(0, 99, 132, 0.2)',
                'rgba(54, 162, 0, 0.2)',
                'rgba(255, 0, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 0, 0, 0.2)',
                'rgba(255, 0, 64, 0.2)'
              ],
            },
            {
              label: 'CantidadA',
              data: cantidadA,
              borderColor: "blue",
              fill: false,
              backgroundColor: [
                'rgba(0, 99, 132, 0.2)',
                'rgba(54, 162, 0, 0.2)',
                'rgba(255, 0, 0, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 0, 0, 0.2)',
                'rgba(255, 0, 64, 0.2)'
              ],
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }],
          }
        }
      });
    });
  }

  generarReporte(){
    this.consultaService.generarReporte().subscribe(data => {
      //console.log(data);
      let reader = new FileReader();
      reader.onload = (e: any)=>{
        console.log(e.target.result);
        this.pdfSrc = e.target.result;
      }
      reader.readAsArrayBuffer(data);
    });
  }

  descargarReporte(){
    this.consultaService.generarReporte().subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'archivo.pdf';
      a.click();
      return url;
    });
  }

  selectFile(e: any){
    console.log(e.target.files);
    this.labelFile = e.target.files[0].name;
    this.selectedFiles = e.target.files;
  }

  upload(){
    this.currentFileUpload = this.selectedFiles.item(0);
    console.log(this.currentFileUpload);

    this.consultaService.guardarArchivo(this.currentFileUpload).subscribe(data => {
      console.log(data)
      this.selectedFiles = undefined;
    });
    
  }

  accionImagen(accion: string){
    if(accion === "M"){
      this.imagenEstado = true;
    }else{
      this.imagenEstado = false;
    }    
  }  
}
