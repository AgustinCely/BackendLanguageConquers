import { TOKEN_NAME } from './../../_shared/var.constant';
import { Component, OnInit } from '@angular/core';
import * as decode from 'jwt-decode';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let tk = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
    const decodedToken = decode(tk.access_token);
    document.getElementById('nombre').innerHTML = decodedToken.user_name;
    document.getElementById('rol').innerHTML = decodedToken.authorities;
    //console.log(decodedToken.authorities);
  }
}
