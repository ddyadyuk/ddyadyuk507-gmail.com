import {Component, OnDestroy, OnInit} from '@angular/core';
import {CourseDTO, CourseModuleDTO, CoursesService} from "../../services/courses.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/auth";
import {LoadingController, ModalController} from "@ionic/angular";
import {ModuleCreateModalPage} from "./module-create-modal/module-create-modal.page";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";

@Component({
    selector: 'app-create',
    templateUrl: './create.page.html',
    styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit, OnDestroy {
    isCourseCreated = false;
    courseId = '';
    courseCreationForm: FormGroup;


    courseObservable: Observable<CourseDTO>;
    course: CourseDTO = {
        title: '',
        description: '',
        category: '',
        imgUrl: '',
        creator: ''
    };

    courseModules: CourseModuleDTO[];

    getCourseSub: Subscription;
    getCourseModulesSub: Subscription;
    courseFormSub: Subscription;

    constructor(private coursesService: CoursesService,
                private auth: AngularFireAuth,
                private loadingController: LoadingController,
                private modalController: ModalController,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private router: Router) {
    }

    ngOnInit() {
        this.courseId = this.route.snapshot.paramMap.get("courseId");

        this.getCourseSub = this.coursesService.getCourse(this.courseId).subscribe(course => {
            if (course) {
                this.course = course;
                console.log("Fetched course:", this.course);

                this.getCourseModulesSub = this.coursesService.getCourseModules(this.courseId).subscribe(modules => {
                    if (modules.length > 0) {
                        this.courseModules = modules;
                    }
                })
            }
        });

        this.courseObservable = this.coursesService.getCourse(this.courseId);

        this.courseFormSub = this.courseObservable.pipe(
            map(data => {
                if (data) {
                    return this.formBuilder.group({
                        title: [data.title != '' ? data.title : '', Validators.compose([Validators.required])],
                        description: [data.description != '' ? data.description : '', Validators.compose([Validators.required])],
                        category: [data.category != '' ? data.category : '', Validators.compose([Validators.required])],
                        imgUrl: [data.imgUrl != '' ? data.imgUrl : '',
                            Validators.compose([Validators.required])]
                    });
                }
            })).subscribe(form => {
            this.courseCreationForm = form;
        });
    }

    async createCourse() {

        let creatorId = 'unset';
        const loading = await this.loadingController.create({
            message: 'Creating Course...'
        });

        loading.present();

        await this.auth.currentUser.then(user => {
            console.log("User id: ", user.uid);
            creatorId = user.uid;
        });

        this.course.title = this.courseCreationForm.value.title;
        this.course.description = this.courseCreationForm.value.description;
        this.course.category = this.courseCreationForm.value.category;
        this.course.imgUrl = this.courseCreationForm.value.imgUrl;
        this.course.creator = creatorId;


        console.log("Created course", this.course);

        this.coursesService.updateCourse(this.courseId, this.course).then(() => {
            loading.dismiss();
            console.log("Course Created. New course Id" + this.courseId);
        }, error => {
            console.log("Failed to create course", error.message);
        });

        this.isCourseCreated = true;
    }

    async createCourseModule() {
        const moduleCreationModal = await this.modalController.create({
            component: ModuleCreateModalPage,
            componentProps: {
                courseId: this.courseId
            }
        });

        moduleCreationModal.present();

        this.getCourseModulesSub = this.coursesService.getCourseModules(this.courseId).subscribe(courses => {
            this.courseModules = courses;
        });
    }

    cancelCreation() {
        this.router.navigateByUrl('/courses');
    }

    deleteCourse() {
        this.coursesService.deleteCourse(this.courseId).then(() => {
            console.log("Course deleted");

            this.coursesService.deleteCourseModules(this.courseId);
        });

        this.router.navigateByUrl('/courses');

    }

    deleteModule(moduleId) {
        this.coursesService.deleteModule(moduleId);
    }

    ngOnDestroy(): void {
        this.getCourseSub.unsubscribe();
        this.getCourseModulesSub.unsubscribe();
        this.courseFormSub.unsubscribe();

        this.isCourseCreated = false;
    }
}
