import {Component, OnInit} from '@angular/core';
import {UserCoursesService} from "../services/user-courses.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {Course} from "../models/course.model";
import {CoursesService} from "../services/courses.service";
import {Subscription} from "rxjs";
import {Platform} from "@ionic/angular";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.page.html',
    styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

    courses: Course[];

    isPhone = false;

    getUserCoursesSub: Subscription;

    constructor(private userCoursesService: UserCoursesService,
                private fireAuth: AngularFireAuth,
                private coursesService: CoursesService,
                private platform: Platform) {
    }

    ngOnInit() {
        this.isPhone = this.platform.is("mobile");

        this.fireAuth.onAuthStateChanged(user => {
            if (user) {
                let userCoursesIds: string[];
                console.log("UID:", user.uid)
                this.getUserCoursesSub = this.userCoursesService.getUserCourses(user.uid).subscribe(usersCourses => {
                    userCoursesIds = usersCourses.courses;

                    this.coursesService.getCourses().subscribe(courses => {
                        this.courses = courses.filter(course => userCoursesIds.includes(course.id))
                    })
                })
            }
        })
        console.log("User's courses", this.courses);
    }

    ionViewOnLeave() {
        this.getUserCoursesSub.unsubscribe();
    }
}
