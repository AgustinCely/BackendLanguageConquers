import { Signosvitales } from 'src/app/_model/signosvitales';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MatPaginator, MatSort } from '@angular/material';
import { SignosvitalesService } from './../../_service/signosvitales.service';

@Component({
  selector: 'app-signos-vitales',
  templateUrl: './signos-vitales.component.html',
  styleUrls: ['./signos-vitales.component.css']
})
export class SignosVitalesComponent implements OnInit {

  dataSource: MatTableDataSource<Signosvitales>
  displayedColumns = ['idsignosvitales', 'fecha', 'pulso','ritmo_espiratorio','temperatura','paciente', 'acciones'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number;

  constructor(private signosServices:SignosvitalesService,private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.signosServices.signosCambio.subscribe(data=> {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.signosServices.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.signosServices.mensajeCambio.subscribe(data=>{
      this.snackBar.open(data, 'Aviso', { duration: 2000 });
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  eliminar(idsignosvitales: number){
    this.signosServices.eliminar(idsignosvitales).subscribe(data => {
      this.signosServices.listar().subscribe(data => {
        this.signosServices.signosCambio.next(data);
        this.signosServices.mensajeCambio.next('Se eliminó');
      });      
    });
  }

  mostrarMas(e : any){
    console.log(e);
    this.signosServices.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
    let signos = JSON.parse(JSON.stringify(data)).content;
    this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;

    this.dataSource= new MatTableDataSource(signos);
    this.dataSource.sort = this.sort;
    });
  }
}
