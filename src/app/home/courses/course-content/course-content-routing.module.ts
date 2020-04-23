import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseContentPage } from './course-content.page';

const routes: Routes = [
  {
    path: '',
    component: CourseContentPage
  },
  {
    path: 'course-item',
    loadChildren: () => import('./course-item/course-item.module').then( m => m.CourseItemPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseContentPageRoutingModule {}
