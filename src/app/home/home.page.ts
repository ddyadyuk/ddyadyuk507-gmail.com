import {Component, OnDestroy, OnInit} from '@angular/core';
import {Course} from './models/course.model';
import {CoursesService} from './courses/courses.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
    courses: Course[];
    isLoading = false;
    coursesSub: Subscription;

    constructor(
        private coursesService: CoursesService,
        private router: Router) {
    }

    ngOnInit() {
        this.coursesService.courses.subscribe(courses => {
            this.courses = courses;
        });
    }

    ionViewWillEnter() {
        this.isLoading = true;
        this.coursesSub = this.coursesService.fetchCourses().subscribe(courses => {
            this.courses = courses;
            this.isLoading = false;
        });
    }

    ngOnDestroy(): void {
        this.coursesSub.unsubscribe();
    }

}
