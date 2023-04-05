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
