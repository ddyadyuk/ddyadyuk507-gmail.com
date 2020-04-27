import {Component, OnDestroy, OnInit} from '@angular/core';
import {CourseDTO, CourseModuleDTO, CoursesService} from "../../services/courses.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Platform} from "@ionic/angular";
import {Subscription} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";

@Component({
    selector: 'app-course-content',
    templateUrl: './course-content.page.html',
    styleUrls: ['./course-content.page.scss'],
})
export class CourseContentPage implements OnInit, OnDestroy {

    courseModules: CourseModuleDTO[];
    course: CourseDTO = {
        title: '',
        category: '',
        imgUrl: '',
        description: '',
        creator: null
    };

    courseId: string;

    isAuthenticated = false;
    isPhone = false;

    getCourseSub: Subscription;

    constructor(private coursesService: CoursesService,
                private activatedRoute: ActivatedRoute,
                private platform: Platform,
                private router: Router,
                private auth: AngularFireAuth) {
    }

    ngOnInit() {
        this.courseId = this.activatedRoute.snapshot.paramMap.get('courseId');
        this.isPhone = this.platform.is("mobile");

        if (this.courseId) {
            this.coursesService.getCourse(this.courseId).subscribe(course => {
                if (course) {
                    this.course.title = course.title;
                    this.course.category = course.category;
                    this.course.imgUrl = course.imgUrl;
                    this.course.description = course.description;
                    this.course.creator = course.creator;
                }
            });

            this.auth.onAuthStateChanged(user => {
                if (user) {
                    this.isAuthenticated = true;
                } else {
                    this.isAuthenticated = false;
                }
            });

            this.getCourseSub = this.coursesService.getCourseModules(this.courseId).subscribe(modules => {
                this.courseModules = modules;
                console.log("Course Modules:", this.courseModules);
            });

            console.log()
        }
    }


    updateCourse() {
        this.router.navigateByUrl(`courses/modify/${this.courseId}`);
    }

    ngOnDestroy(): void {

        this.getCourseSub.unsubscribe();

        this.course = {
            title: '',
            category: '',
            imgUrl: '',
            description: '',
            creator: null
        };

        this.isPhone = false;
    }
}
