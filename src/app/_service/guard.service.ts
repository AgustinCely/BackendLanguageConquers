import { TOKEN_NAME } from './../_shared/var.constant';
import { MenuService } from './menu.service';
import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import * as decode from 'jwt-decode';
import { map } from 'rxjs/operators';
import { Menu } from '../_model/menu';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate{

  constructor(private loginService: LoginService, private menuService: MenuService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const helper = new JwtHelperService();

    let rpta = this.loginService.estaLogeado();

    if (!rpta) {
      sessionStorage.clear();
      this.router.navigate(['login']);
      return false;
    }else{
      let token = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
      //console.log(helper.isTokenExpired(token.access_token));
      if (!helper.isTokenExpired(token.access_token)) {
        const decodedToken = decode(token.access_token);
        let url = state.url; //pagina que quieres acceder /pacientes /consulta

        return this.menuService.listarPorUsuario(decodedToken.user_name).pipe(map((data: Menu[]) => {
          this.menuService.menuCambio.next(data);

          let cont = 0;
          for (let m of data) {
            if (m.url === url) {
              cont++;
              break;
            }
          }

          if (cont > 0) {
            return true;
          } else {
            this.router.navigate(['not-403']);
            return false;
          }
        }));

      }else{
        sessionStorage.clear();
        this.router.navigate(['login']);
        return false;
      }
    }    
  }

}
