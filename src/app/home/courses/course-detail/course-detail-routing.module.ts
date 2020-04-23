import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {CourseDetailPage} from './course-detail.page';

const routes: Routes = [
    {
        path: '',
        component: CourseDetailPage,
        children: [{
            path: ':courseItemId',
            loadChildren: () => import('./course-item/course-item.module').then(m => m.CourseItemPageModule)
        }]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CourseDetailPageRoutingModule {
}
