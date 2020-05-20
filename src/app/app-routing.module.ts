import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./login/auth.guard";

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
    },
    {
        path: 'login',
        loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
    },
    {
        path: 'courses/modify/:courseId',
        loadChildren: () => import('./courses/create/create.module').then(m => m.CreatePageModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'categories',
        loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesPageModule)
    }
];

@NgModule({

    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
