import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CoursesPage} from './courses.page';

const routes: Routes = [
    {
        path: '',
        component: CoursesPage
    },
    {
        path: 'course-content',
        loadChildren: () => import('./course-content/course-content.module').then(m => m.CourseContentPageModule)
    },
    {
        path: 'create',
        loadChildren: () => import('./create/create.module').then(m => m.CreatePageModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CoursesPageRoutingModule {
}
