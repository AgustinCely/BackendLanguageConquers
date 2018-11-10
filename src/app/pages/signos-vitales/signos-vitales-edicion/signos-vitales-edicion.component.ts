import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from './../../../_service/paciente.service';
import { SignosvitalesService } from './../../../_service/signosvitales.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Signosvitales } from './../../../_model/signosvitales';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-signos-vitales-edicion',
  templateUrl: './signos-vitales-edicion.component.html',
  styleUrls: ['./signos-vitales-edicion.component.css']
})
export class SignosVitalesEdicionComponent implements OnInit {

  id:number;
  pacientes: Paciente[] = [];
  form: FormGroup;
  myControlPaciente: FormControl = new FormControl();
  pacienteSeleccionado: Paciente;
  edicion: boolean =false;
  filteredOptions: Observable<any[]>;
  Signosvitales: Signosvitales;

  constructor(private route:ActivatedRoute,private router: Router,private signosVitalesServices:SignosvitalesService,private pacienteService:PacienteService) { 
    this.form = new FormGroup({
      'id':new FormControl(0),
      'pulso': new FormControl(''),
      'temperatura': new FormControl(''),
      'ritmo_respiratorio': new FormControl(''),
      'paciente': this.myControlPaciente,
      'fecha':new FormControl(new Date())
    });
  }

  ngOnInit() {
    this.listarPacientes();
    this.Signosvitales = new Signosvitales();
    this.route.params.subscribe((params:Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    })
    this.filteredOptions = this.myControlPaciente.valueChanges.pipe(map(val => this.filter(val)));
  }

  initForm(){
    if(this.edicion){
      //cargar la data del servicio en el form
      this.signosVitalesServices.listarSignosvitalesPorId(this.id).subscribe(data => {
        console.log(data.fecha)
        this.form = new FormGroup({
          'id' : new FormControl(data.idsignosvitales),
          'pulso' : new FormControl(data.pulso),
          'temperatura' : new FormControl(data.temperatura),
          'ritmo_respiratorio' : new FormControl(data.ritmo_respiratorio),
          'paciente' : new FormControl(data.paciente),
          'fecha' : new FormControl(data.fecha)
        });
      });
    }
  }

  operar(){
    this.Signosvitales.idsignosvitales = this.form.value['id'];
    this.Signosvitales.pulso = this.form.value['pulso'];
    this.Signosvitales.temperatura = this.form.value['temperatura'];
    this.Signosvitales.ritmo_respiratorio = this.form.value['ritmo_respiratorio'];
    this.Signosvitales.paciente = this.form.value['paciente'];
    this.Signosvitales.fecha = this.form.value['fecha'];
    /*var tzoffset = (this.form.value['fecha']).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    this.Signosvitales.fecha = localISOTime;*/
    //console.log(this.Signosvitales.fecha);
    if(this.edicion){
      //actualizar
      
      this.signosVitalesServices.modificar(this.Signosvitales).subscribe(data => {
        this.signosVitalesServices.listar().subscribe(Signosvitales => {
          this.signosVitalesServices.signosCambio.next(Signosvitales);
          this.signosVitalesServices.mensajeCambio.next('Se modificó');
        });
      });
    }else{
      //registrar
      console.log(this.Signosvitales)
      this.signosVitalesServices.registrar(this.Signosvitales).subscribe(data => {
        this.signosVitalesServices.listar().subscribe(Signosvitales => {
          this.signosVitalesServices.signosCambio.next(Signosvitales);
          this.signosVitalesServices.mensajeCambio.next('Se registró');
        });
      });
    }

    this.router.navigate(['signosvitales']);
  }

  filter(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val));
    }
  }

  seleccionarPaciente(e: any){
    //console.log(e);
    this.pacienteSeleccionado = e.option.value;
  }

  displayFn(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }
}
