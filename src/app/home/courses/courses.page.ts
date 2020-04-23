import {Component, OnDestroy, OnInit} from '@angular/core';
import {Course} from '../models/course.model';
import {CoursesService} from './courses.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.page.html',
    styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit, OnDestroy {
    courses: Course[];
    isLoading = false;
    coursesSubs: Subscription;

    constructor(
        private coursesService: CoursesService
    ) {
    }

    ngOnInit() {
        this.isLoading = true;

        this.coursesSubs = this.coursesService.fetchCourses().subscribe(courses => {
            this.courses = courses;
            console.log(courses);
            this.isLoading = false;
        });
    }

    ngOnDestroy(): void {
        this.coursesSubs.unsubscribe();
    }

}
