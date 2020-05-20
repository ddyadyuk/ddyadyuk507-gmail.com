import {Component, OnDestroy, OnInit, Sanitizer, SecurityContext} from '@angular/core';
import {CourseModule} from "../../../models/course-module.model";
import {CourseDTO, CoursesService} from "../../../services/courses.service";
import {ModuleItemModel} from "../../../models/module-item.model";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/auth";
import {Platform} from "@ionic/angular";
import {Subscription} from "rxjs";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
    selector: 'app-learning',
    templateUrl: './learning.page.html',
    styleUrls: ['./learning.page.scss'],
})
export class LearningPage implements OnInit, OnDestroy {

    courseId: string;
    itemId: string;

    course: CourseDTO = {
        title: '',
        categories: [''],
        imgUrl: '',
        description: '',
        creator: null
    };

    courseModules: CourseModule[];
    courseModuleItems: Map<string, ModuleItemModel[]> = new Map<string, ModuleItemModel[]>();
    currentItem: ModuleItemModel = {
        id: '',
        content: '',
        itemNumber: null,
        moduleId: '',
        open: false,
        title: ''
    };

    isPhone = false;
    isAuthenticated = false;

    getCourseSub: Subscription;
    getCourseModulesSub: Subscription;
    currentItemSub: Subscription;

    sanitizedContent: SafeHtml;

    constructor(private activatedRoute: ActivatedRoute,
                private coursesService: CoursesService,
                private auth: AngularFireAuth,
                private platform: Platform,
                private router: Router,
                private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.courseId = this.activatedRoute.snapshot.paramMap.get('courseId');
        this.itemId = this.activatedRoute.snapshot.paramMap.get('itemId');
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

            this.coursesService.getItem(this.itemId).subscribe(item => {
                if (item) {
                    item.id = this.itemId;
                    this.currentItem = item;
                    this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.currentItem.content);
                    console.log("Sanitized content", this.sanitizedContent);
                    console.log("not sanitized content", this.currentItem.content);
                }
            });

        }
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

    toggleModule(id, index) {
        this.courseModules.find(module => module.id == id).open = !this.courseModules.find(module => module.id == id).open;

        if (this.courseModules.find(module => module.id == id).open) {
            this.courseModules.filter(module => module.id != id)
                .map(module => {
                    module.open = false;
                });
        }
    }

    getModuleItems(id) {
        return this.courseModuleItems.get(id);
    }

    transferToLearnPage(itemId: string) {
        this.router.navigateByUrl(`/courses/${this.courseId}/learning/${itemId}`)
    }
}
