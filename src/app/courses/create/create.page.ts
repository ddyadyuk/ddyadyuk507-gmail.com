import {Component, OnDestroy, OnInit} from '@angular/core';
import {CourseDTO, CoursesService} from "../../services/courses.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/auth";
import {LoadingController, ModalController} from "@ionic/angular";
import {ModuleCreateModalPage} from "./module-create-modal/module-create-modal.page";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {filter, map} from "rxjs/operators";
import {ModuleItemCreateModalPage} from "./module-item-create-modal/module-item-create-modal.page";
import {ModuleItemModel} from "../../models/module-item.model";
import {CourseModule} from "../../models/course-module.model";
import {CategoryDTO, CategoryService} from "../../services/category.service";
import {Category} from "../../models/category.model";

@Component({
    selector: 'app-create',
    templateUrl: './create.page.html',
    styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit, OnDestroy {
    isCourseCreated = false;
    automaticClose = false;
    courseId = '';
    courseCreationForm: FormGroup;

    newCategory = '';

    courseObservable: Observable<CourseDTO>;
    availableCategories: CategoryDTO[];

    course: CourseDTO = {
        title: '',
        description: '',
        categories: [''],
        imgUrl: '',
        creator: '',
    };
    courseModules: CourseModule[];

    courseModuleItems: Map<string, ModuleItemModel[]> = new Map<string, ModuleItemModel[]>();
    getCourseSub: Subscription;
    getCourseModulesSub: Subscription;
    courseFormSub: Subscription;
    categoriesSub: Subscription;

    constructor(private coursesService: CoursesService,
                private auth: AngularFireAuth,
                private loadingController: LoadingController,
                private modalController: ModalController,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private router: Router,
                private categoryService: CategoryService) {
    }

    ngOnInit() {
        this.courseId = this.route.snapshot.paramMap.get("courseId");


        this.getCourseSub = this.coursesService.getCourse(this.courseId).subscribe(course => {
            //if editing an already created course
            if (course) {
                this.course = course;

                // console.log("Fetched course:", this.course);

                this.getCourseModulesSub = this.coursesService.getCourseModules(this.courseId)
                    .subscribe(modules => {
                        if (modules.length > 0) {

                            this.courseModules = modules;

                            this.courseModules[0].open = true;

                            for (let courseModule of this.courseModules) {
                                this.coursesService.getModuleItems(courseModule.id).subscribe(items => {
                                    this.courseModuleItems.set(courseModule.id, items);
                                    // console.log("fetched Items:", items, " Updated Items Map ", this.courseModuleItems);
                                });
                            }
                        }
                    });
            }
        });

        this.courseObservable = this.coursesService.getCourse(this.courseId);
        this.courseFormSub = this.courseObservable.pipe(
            map(data => {
                if (data) {
                    //Filter categories
                    this.categoriesSub = this.categoryService.categoriesObs.subscribe(categories => {
                        this.availableCategories = categories.filter(category => !this.course.categories.includes(category.title))
                    });

                    return this.formBuilder.group({
                        title: [data.title != '' ? data.title : 'Some SEO Stuff', Validators.compose([Validators.required])],
                        description: [data.description != '' ? data.description : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n' +
                            'tempor incididunt ut labore et dolore magna aliqua.', Validators.compose([Validators.required])],
                        categories: ['', Validators.compose([Validators.required])],
                        imgUrl: [data.imgUrl != '' ? data.imgUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRFb460eQtaHu30yk9G3jhIldkewc3T9U5X06m8AggfIfKeJmj_&usqp=CAU',
                            Validators.compose([Validators.required])]
                    });
                }
            })).subscribe(form => {
            this.courseCreationForm = form;
        });

    }

    ionViewWillLeave() {
        if (this.course.title == ''
            && this.course.creator == ''
            && this.course.description == '') {
            console.log("Deleting dismissed course")
            this.coursesService.deleteCourse(this.courseId);
        }

        this.isCourseCreated = false;
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

        let categories = this.courseCreationForm.value.categories + '';
        console.log("Selected categories ", this.courseCreationForm.value.categories)

        if (categories != null && categories != '') {
            this.course.categories = this.course.categories
                .concat(categories.replace(/ /g, '').split(","));
        }
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
            cssClass: 'module-creation-modal',
            componentProps: {
                courseId: this.courseId
            }
        });

        moduleCreationModal.present();
    }

    async updateModule(moduleId: string) {
        const moduleCreationModal = await this.modalController.create({
            component: ModuleCreateModalPage,
            cssClass: 'module-creation-modal',
            componentProps: {
                courseId: this.courseId,
                moduleId: moduleId
            }
        });

        moduleCreationModal.present();
    }

    cancelCreation() {

        if (this.course.title == ''
            && this.course.creator == ''
            && this.course.description == ''
            && this.course.categories.length <= 0) {
            console.log("Deleting dismissed course")
            this.coursesService.deleteCourse(this.courseId);
        }
        this.router.navigateByUrl('/courses');
    }

    deleteCourse() {
        this.coursesService.deleteCourse(this.courseId).then(() => {
            console.log("Course deleted");
            this.coursesService.deleteCourseModules(this.courseId);
        });

        this.router.navigateByUrl('/courses');
    }

    deleteCourseCategory(categoryToDelete: string) {

        this.course.categories = this.course.categories.filter(category => category !== categoryToDelete)

        this.coursesService.updateCourse(this.courseId, this.course)
    }

    deleteModule(moduleId) {
        this.coursesService.deleteModule(moduleId);
    }

    ngOnDestroy(): void {
        this.getCourseSub.unsubscribe();
        this.getCourseModulesSub.unsubscribe();
        this.courseFormSub.unsubscribe();
        this.categoriesSub.unsubscribe();

        this.isCourseCreated = false;
        this.courseCreationForm.disable();
    }

    async addModuleItem(id: string) {
        const moduleItemCreationModal = await this.modalController.create({
            component: ModuleItemCreateModalPage,
            cssClass: 'module-item-creation-modal',
            componentProps: {
                moduleId: id
            }
        });

        moduleItemCreationModal.present();
    }

    getModuleItems(id) {
        return this.courseModuleItems.get(id);
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

    toggleModuleItem(moduleId, id, index) {
        this.getModuleItems(moduleId).find(item => item.id == id).open = !this.getModuleItems(moduleId).find(item => item.id == id).open;

        if (this.automaticClose && this.getModuleItems(moduleId).find(item => item.id == id).open) {
            this.getModuleItems(moduleId).filter(module => module.id != id)
                .map(item => {
                    item.open = false;
                });
        }
    }

    async updateItemContent(moduleId: string, itemId: string) {
        const moduleItemCreationModal = await this.modalController.create({
            component: ModuleItemCreateModalPage,
            cssClass: 'module-item-creation-modal',
            componentProps: {
                moduleId: moduleId,
                itemId: itemId
            }
        });

        moduleItemCreationModal.present();
    }

    deleteModuleItem(id: any) {
        this.coursesService.deleteModuleItem(id);
    }

    //ToDo: add some information about the process(popup, alert)
    addCategory() {

        const newCategory: Category = {
            id: this.newCategory,
            title: this.newCategory
        };

        if (this.newCategory != '' && this.categoryService.categoriesObs.pipe(
            filter(courses => !courses.includes(newCategory)))) {
            this.categoryService.addCategory(newCategory)
                .then(() => {
                    this.course.categories.push(this.newCategory);
                })
        } else {
            console.log("This category cannot be added, Category you trying to add: ", newCategory);
        }
    }
}
