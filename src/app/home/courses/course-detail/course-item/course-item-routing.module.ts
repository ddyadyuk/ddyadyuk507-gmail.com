import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseItemPage } from './course-item.page';

const routes: Routes = [
  {
    path: '',
    component: CourseItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseItemPageRoutingModule {}
