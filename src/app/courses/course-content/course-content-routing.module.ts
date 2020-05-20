import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseContentPage } from './course-content.page';

const routes: Routes = [
  {
    path: '',
    component: CourseContentPage
  },
  {
    path: 'learning/:itemId',
    loadChildren: () => import('./learning/learning.module').then( m => m.LearningPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseContentPageRoutingModule {}
