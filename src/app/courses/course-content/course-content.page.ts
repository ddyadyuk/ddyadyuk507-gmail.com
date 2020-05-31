import {Component, OnDestroy, OnInit} from '@angular/core';
import {CourseDTO, CoursesService} from "../../services/courses.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Platform} from "@ionic/angular";
import {Subscription} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {CourseModule} from "../../models/course-module.model";
import {ModuleItemModel} from "../../models/module-item.model";
import {User} from "../../models/user.model";
import {FirebaseService} from "../../services/firebase.service";
import {UserCoursesService} from "../../services/user-courses.service";
import {UserCourses} from "../../models/user-courses.model";

@Component({
    selector: 'app-course-content',
    templateUrl: './course-content.page.html',
    styleUrls: ['./course-content.page.scss'],
})
export class CourseContentPage implements OnInit, OnDestroy {

    courseModules: CourseModule[];
    courseModuleItems: Map<string, ModuleItemModel[]> = new Map<string, ModuleItemModel[]>();


    course: CourseDTO = {
        title: '',
        categories: [''],
        imgUrl: '',
        description: '',
        creator: null
    };

    userCourses: UserCourses;

    courseId: string;
    userId: string;

    isAuthenticated = false;
    gotWritePermission = false;
    isPhone = false;


    getCourseSub: Subscription;
    getCourseModulesSub: Subscription;
    userCoursesSub: Subscription;

    constructor(private coursesService: CoursesService,
                private activatedRoute: ActivatedRoute,
                private platform: Platform,
                private router: Router,
                private auth: AngularFireAuth,
                private firebaseService: FirebaseService,
                private userCoursesService: UserCoursesService) {
    }

    ngOnInit() {
        this.courseId = this.activatedRoute.snapshot.paramMap.get('courseId');
        this.isPhone = this.platform.is("mobile");

        if (this.courseId) {
            this.getCourseSub = this.coursesService.getCourse(this.courseId).subscribe(course => {
                if (course) {
                    this.course = course;
                    console.log("Fetched course:", this.course);

                    this.getCourseModulesSub = this.coursesService.getCourseModules(this.courseId)
                        .subscribe(modules => {
                            if (modules.length > 0) {

                                this.courseModules = modules;

                                this.courseModules[0].open = true;

                                for (let courseModule of this.courseModules) {
                                    this.coursesService.getModuleItems(courseModule.id).subscribe(items => {
                                        this.courseModuleItems.set(courseModule.id, items);
                                        console.log("fetched Items:", items, " Updated Items Map ", this.courseModuleItems);
                                    });
                                }
                            }
                        })
                }
            });

            this.auth.currentUser.then(user => {
                if (user) {
                    let userInformation: User;
                    this.userId = user.uid;

                    console.log("UserId:", this.userId);
                    this.firebaseService.getUserInformation(this.userId).subscribe(user => {
                        userInformation = user
                        console.log("Current user:", user)
                        this.gotWritePermission = userInformation.status === "teacher" ? true : false;
                    });

                    //Getting user Courses
                    this.userCoursesSub = this.userCoursesService.getUserCourses(this.userId).subscribe(userCourses => {
                        this.userCourses = userCourses;
                        console.log("Fetched Courses:", this.userCourses);
                    })

                    console.log("We've got a user");
                    this.isAuthenticated = true;
                } else {
                    this.isAuthenticated = false;
                }
            });
        }
    }


    updateCourse() {
        this.router.navigateByUrl(`courses/modify/${this.courseId}`);
    }

    toggleModule(id, index) {
        this.courseModules.find(module => module.id == id).open = !this.courseModules.find(module => module.id == id).open;

        if (this.courseModules.find(module => module.id == id).open) {
            this.courseModules.filter(module => module.id != id)
                .map(module => {
                    module.open = false;
                });
        }
    }

    updateItemContent(id: any) {
    }

    deleteModuleItem(id: any) {

    }

    getModuleItems(id) {
        return this.courseModuleItems.get(id);
    }

    ngOnDestroy(): void {

        this.getCourseSub.unsubscribe();
        this.getCourseModulesSub.unsubscribe();
        this.userCoursesSub.unsubscribe();
        this.course = {
            title: '',
            categories: [''],
            imgUrl: '',
            description: '',
            creator: null
        };

        this.isPhone = false;
    }

    transferToLearnPage(itemId: string) {
        if (this.userCourses) {
            console.log("Before adding userCourses:", this.userCourses.courses);

            //filter current user courses and if there is no current CourseId add it to the list.
            if (this.userCourses && !this.userCourses.courses.includes(this.courseId)) {

                this.userCourses.courses.push(this.courseId);
                this.userCoursesService.addCourseToUserList(this.userCourses);
                console.log("Adding userCourses:", this.userCourses.courses);

            } else {
                //ToDo present alert.
            }

            this.router.navigateByUrl(`/courses/${this.courseId}/learning/${itemId}`)
        }
    }
}
