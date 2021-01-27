import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: 'forms',
  loadChildren: () => import('./pages/forms/forms.module').then((module) => module.SandboxFormsModule)
}, {
  path: 'table',
  loadChildren: () => import('./pages/table/table.module').then((module) => module.TablePageModule)
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
