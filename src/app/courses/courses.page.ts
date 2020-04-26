import {Component, OnInit} from '@angular/core';
import {CourseDTO, CoursesService} from '../services/courses.service';
import {Platform} from "@ionic/angular";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Component({
    selector: 'app-courses',
    templateUrl: './courses.page.html',
    styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {

    courses: Observable<CourseDTO[]>;
    allCourses: Array<any>;

    isLoading = false;
    isPhone = false;


    constructor(
        private coursesService: CoursesService,
        private platform: Platform,
        private  router: Router
    ) {
        this.courses = this.coursesService.getCourses();
    }

    ngOnInit() {
        this.isLoading = true;
        this.isLoading = false;
    }

    ionViewWillEnter() {
        this.isPhone = this.platform.is("mobile");
        this.isLoading = true;
        this.courses = this.coursesService.getCourses();
        this.isLoading = false;
    }

    openCourse(id) {
        this.router.navigateByUrl(`courses/${id}`);
    }
}
