import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/user/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'post-form',
    loadChildren: () => import('./post-form/post-form.module').then( m => m.PostFormPageModule),canActivate:[AuthGuard],
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule),canActivate:[AuthGuard],
  },
  {
    path: 'saved',
    loadChildren: () => import('./saved/saved.module').then( m => m.SavedPageModule),canActivate:[AuthGuard],
  },
  {
    path: 'post/edit/:postid',
    loadChildren:() => import('./post-form/post-form.module').then(m => m.PostFormPageModule),canActivate:[AuthGuard],
  },
  {
    path: 'fav',
    loadChildren: () => import('./fav/fav.module').then( m => m.FavPageModule),canActivate:[AuthGuard],
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
