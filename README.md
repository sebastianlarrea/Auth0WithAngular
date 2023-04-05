# Auth0WithAngular

## Auth0

Auth0 es una plataforma basada en la nube que proporciona soluciones de autenticación y autorización para aplicaciones web, móviles e IoT. Permite a los desarrolladores agregar rápidamente características de autenticación a sus aplicaciones sin tener que escribir y mantener un código de autenticación complejo.

Con Auth0, los usuarios pueden autenticarse utilizando varios proveedores de identidad (como Google, Facebook, LinkedIn), sistemas de identidad empresarial (como Active Directory, LDAP) o bases de datos personalizadas. Soporta varios protocolos, incluyendo OpenID Connect, OAuth 2.0 y SAML.

Auth0 también proporciona características como autenticación multifactor, autenticación sin contraseña y detección de anomalías para mejorar la seguridad. También ofrece características de gestión de usuarios, como gestión de perfiles de usuario, búsqueda de usuarios y restablecimiento de contraseñas.

Los desarrolladores pueden integrar Auth0 en sus aplicaciones utilizando varios SDK y bibliotecas disponibles para diferentes lenguajes de programación y marcos. Auth0 también proporciona documentación detallada, tutoriales y soporte para ayudar a los desarrolladores a integrar Auth0 en sus aplicaciones de manera transparente.

En general, Auth0 es una solución de autenticación y autorización confiable y segura que simplifica el proceso de autenticación para los desarrolladores y les ayuda a centrarse en la construcción de las características principales de su aplicación.

## Implementacion 

Aquí hay un tutorial para implementar Auth0 con el SDK en Angular para SPA:

1. Primero, cree una cuenta en Auth0 y cree una aplicación en el panel de control de Auth0. Asegúrese de haber configurado los detalles de la aplicación, como las URL de redireccionamiento y los proveedores de identidad.

<img width="1037" alt="Untitled" src="https://user-images.githubusercontent.com/74725849/230141960-996dd8d3-a331-4e1c-8d91-05a7c1c7971c.png">

- Asigna un nombre a la aplicación y escoge el tipo de aplicación que vas a crear:

<img width="804" alt="Untitled-2" src="https://user-images.githubusercontent.com/74725849/230142055-6e2e82e9-786e-4c7a-8de4-025762c62535.png">

- Asegúrate de tener rapeada esta información de tu aplicativo:

<img width="1032" alt="Untitled-3" src="https://user-images.githubusercontent.com/74725849/230142106-78d3f02d-a8aa-4bc2-844b-dff4353a8c7f.png">

- Nota: Si estas trabajando con una SPA debes tener esta configuración de forma obligatoria:

<img width="580" alt="Untitled-4" src="https://user-images.githubusercontent.com/74725849/230142136-557595f5-39d6-4066-8824-b000728a9068.png">

Ahora estas listo para irte al código!

2. Descargue e instale el SDK de Auth0 para Angular. Puede hacer esto usando npm. Abra su terminal y ejecute el siguiente comando:import { AuthModule } from '@auth0/auth0-angular'

```
npm install --save @auth0/auth0-angular
```

3. Importe AuthModule en su archivo de aplicación principal (app.module.ts). Aquí hay un ejemplo de cómo hacerlo:

```
import { AuthModule } from '@auth0/auth0-angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule.forRoot({
      domain: '<your-auth0-domain>',
      clientId: '<your-auth0-client-id>'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

4. Use el servicio Auth0 para gestionar la autenticación y la autorización. Aquí hay un ejemplo de cómo hacerlo:

```
import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="login()">Log in</button>
    <button (click)="logout()">Log out</button>
    <div *ngIf="authService.isAuthenticated$ | async">
      <p>Hello {{ authService.user$.given_name }}!</p>
    </div>
  `
})
export class AppComponent {

  constructor(private authService: AuthService) {}

  login() {
    this.authService.loginWithRedirect();
  }

  logout() {
    this.authService.logout();
  }

}

```

5. Para asegurarse de que solo los usuarios autenticados puedan acceder a ciertas rutas de su aplicación, puede usar el guardia de ruta AuthGuard proporcionado por Auth0, pero este tiene las siguientes limitaciones:
- Cuando el usuario no esta autenticado no se realiza una redirección al login sino que simplemente la pantalla se queda en blanco, ya que la configuración de este retorna un true o un false, cuando en realidad debería retornar un URLTree (Redirección) que te mande al login para iniciar sesión.

Por lo que se decidió crear un Guard personalizado llamado PrivateRouteGuard. Aquí hay un ejemplo de cómo hacerlo:

```
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class PrivateRouteGuard implements CanActivate {

  constructor(private authService: AuthService) {}

canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.auth.isAuthenticated$.pipe(
      tap((isAuthenticated) => !isAuthenticated && this.router.navigate(['']))
    );
  }

}
```

6 . Para asegurarse de que los usuarios autenticados no puedan acceder de nuevo al login, puede usar el guardia de ruta PublicRouteGuard. Aquí hay un ejemplo de cómo hacerlo:

```
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class PublicRouteGuard implements CanActivate {

  constructor(private authService: AuthService) {}

canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.auth.isAuthenticated$.pipe(
			map(isAuthenticated => !isAuthenticated),
      tap((isAuthenticated) => !isAuthenticated && this.router.navigate(['']))
    );
  }

}
```

7. Finalmente, agregue el guardia de ruta a las rutas que deben estar protegidas. Aquí hay un ejemplo de cómo hacerlo:

```
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './components/login-component/login-component.component';
import { HomeComponent } from './components/home/home.component';
import { PrivateRouteGuard } from './guards/private-route.guard';
import { PublicRouteGuard } from './guards/public-route.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponentComponent,
    canActivate: [PublicRouteGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [PrivateRouteGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

¡Eso es! Ahora ha implementado correctamente Auth0 con el SDK en Angular para su SPA.
