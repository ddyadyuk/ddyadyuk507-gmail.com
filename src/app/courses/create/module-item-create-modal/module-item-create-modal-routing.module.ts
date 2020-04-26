import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleItemCreateModalPage } from './module-item-create-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ModuleItemCreateModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleItemCreateModalPageRoutingModule {}
