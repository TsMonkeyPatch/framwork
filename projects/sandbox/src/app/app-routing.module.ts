import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: 'datalist',
  loadChildren: () => import('./pages/datalist/datalist.module').then((module) => module.DatalistModule)
}, {
  path: 'forms',
  loadChildren: () => import('./pages/forms/forms.module').then((module) => module.SandboxFormsModule)
}, {
  path: 'table',
  loadChildren: () => import('./pages/table/table.module').then((module) => module.TablePageModule)
}, {
  path: 'project',
  loadChildren: () => import('./pages/project/project.module').then((module) => module.ProjectModule)
}, {
  path: 'pagination',
  loadChildren: () => import('./pages/pagination/pagination.module').then((module) => module.PaginationPageModule)
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
