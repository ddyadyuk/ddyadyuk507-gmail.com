import {Component, OnDestroy, OnInit} from '@angular/core';
import {CourseDTO, CoursesService} from "../../services/courses.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Platform} from "@ionic/angular";
import {Subscription} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {CourseModule} from "../../models/course-module.model";
import {ModuleItemModel} from "../../models/module-item.model";
import {CategoryDTO, CategoryService} from "../../services/category.service";

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

    courseId: string;

    isAuthenticated = false;
    isPhone = false;

    getCourseSub: Subscription;
    getCourseModulesSub: Subscription;

    constructor(private coursesService: CoursesService,
                private activatedRoute: ActivatedRoute,
                private platform: Platform,
                private router: Router,
                private auth: AngularFireAuth,
                private categoryService: CategoryService) {
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
        this.getCourseModulesSub.unsubscribe()

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
        this.router.navigateByUrl(`/courses/${this.courseId}/learning/${itemId}`)
    }
}
