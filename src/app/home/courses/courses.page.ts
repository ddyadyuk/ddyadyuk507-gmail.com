import {Component, OnInit} from '@angular/core';
import {CoursesService} from '../../services/courses.service';
import {Platform} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
    selector: 'app-courses',
    templateUrl: './courses.page.html',
    styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {

    courses: Array<any>;
    allCourses: Array<any>;

    isLoading = false;
    isPhone = false;


    constructor(
        private coursesService: CoursesService,
        private platform: Platform,
        private  router: Router
    ) {
        this.coursesService.fetchCourses().subscribe(courses => {
            console.log('Courses', courses);

            this.allCourses = courses;
            this.courses = courses;
        })
    }

    ngOnInit() {
        this.isLoading = true;
        this.isLoading = false;
    }

    ionViewWillEnter() {
        this.isPhone = this.platform.is("mobile");
        this.isLoading = true;
        this.coursesService
            .fetchCourses()
            .subscribe(courses => {
                this.courses = courses
            });
        this.isLoading = false;
    }

    openCourse(id) {
        this.router.navigateByUrl(`courses/${id}`);
    }
}
