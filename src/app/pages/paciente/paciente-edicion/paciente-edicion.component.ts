import { Paciente } from './../../../_model/paciente';
import { PacienteService } from './../../../_service/paciente.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-paciente-edicion',
  templateUrl: './paciente-edicion.component.html',
  styleUrls: ['./paciente-edicion.component.css']
})
export class PacienteEdicionComponent implements OnInit {

  id: number;
  form: FormGroup;
  edicion: boolean = false;
  paciente: Paciente;

  constructor(private route: ActivatedRoute, private router: Router, private pacienteService: PacienteService) { 
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombres' : new FormControl(''),
      'apellidos' : new FormControl(''),
      'dni' : new FormControl(''),
      'direccion' : new FormControl(''),
      'telefono' : new FormControl('')
    });
  }

  ngOnInit() {
    this.paciente = new Paciente();
    this.route.params.subscribe( (params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  initForm(){
    if(this.edicion){
      //cargar la data del servicio en el form
      this.pacienteService.listarPacientePorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id' : new FormControl(data.idPaciente),
          'nombres' : new FormControl(data.nombres),
          'apellidos' : new FormControl(data.apellidos),
          'dni' : new FormControl(data.dni),
          'direccion' : new FormControl(data.direccion),
          'telefono' : new FormControl(data.telefono)
        });
      });
    }
  }

  operar(){
    this.paciente.idPaciente = this.form.value['id'];
    this.paciente.nombres = this.form.value['nombres'];
    this.paciente.apellidos = this.form.value['apellidos'];
    this.paciente.dni = this.form.value['dni'];
    this.paciente.direccion = this.form.value['direccion'];
    this.paciente.telefono = this.form.value['telefono'];

    if(this.edicion){
      //actualizar
      this.pacienteService.modificar(this.paciente).subscribe(data => {
        this.pacienteService.listar().subscribe(pacientes => {
          this.pacienteService.pacienteCambio.next(pacientes);
          this.pacienteService.mensajeCambio.next('Se modificó');
        });
      });
    }else{
      //registrar
      this.pacienteService.registrar(this.paciente).subscribe(data => {
        this.pacienteService.listar().subscribe(pacientes => {
          this.pacienteService.pacienteCambio.next(pacientes);
          this.pacienteService.mensajeCambio.next('Se registró');
        });
      });
    }

    this.router.navigate(['paciente']);
  }

}
