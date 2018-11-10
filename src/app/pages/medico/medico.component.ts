import { DialogoComponent } from './dialogo/dialogo.component';
import { MedicoService } from './../../_service/medico.service';
import { Medico } from './../../_model/medico';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  displayedColumns = ['idmedico', 'nombres', 'apellidos', 'cmp', 'acciones'];
  dataSource: MatTableDataSource<Medico>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private medicoService: MedicoService, private dialog: MatDialog, private snackBar : MatSnackBar) { }

  ngOnInit() {
    this.medicoService.medicosCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.medicoService.mensaje.subscribe(data => {      
      this.snackBar.open(data, 'Aviso', { duration: 2000 });
    });

    this.medicoService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(medico?: Medico){
    let med = medico != null ? medico : new Medico();
    this.dialog.open(DialogoComponent, {
      width: '250px',
      disableClose: true,
      data: med
    })
  }

  eliminar(medico: Medico){
    this.medicoService.eliminar(medico.idMedico).subscribe( data => {
      this.medicoService.listar().subscribe(medicos => {
        this.medicoService.medicosCambio.next(medicos);
        this.medicoService.mensaje.next("Se elimino");
      });
    });
  }

}
