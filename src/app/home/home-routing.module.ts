import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/courses',
        pathMatch: 'full'
    },
    {
        path: 'courses',
        loadChildren: () => import('./courses/courses.module').then(m => m.CoursesPageModule)
    },
    {
        path: 'courses/:courseId',
        loadChildren: () => import('./courses/course-content/course-content.module').then(m => m.CourseContentPageModule)
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomePageRoutingModule {
}
