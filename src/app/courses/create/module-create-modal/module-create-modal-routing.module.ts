import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleCreateModalPage } from './module-create-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ModuleCreateModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleCreateModalPageRoutingModule {}
