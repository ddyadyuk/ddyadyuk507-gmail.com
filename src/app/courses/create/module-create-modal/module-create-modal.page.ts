import {Component, Input, OnInit} from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {CourseModuleDTO, CoursesService} from "../../../services/courses.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CourseModule} from "../../../models/course-module.model";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
    selector: 'app-module-create-modal',
    templateUrl: './module-create-modal.page.html',
    styleUrls: ['./module-create-modal.page.scss'],
})
export class ModuleCreateModalPage implements OnInit {

    @Input() courseId: string;
    @Input() moduleId: string

    moduleCreationForm: FormGroup;
    newModule: CourseModule = {
        id: '',
        courseId: '',
        title: '',
        moduleNumber: null,
        open: false
    };

    moduleObservable: Observable<CourseModule>

    constructor(private modalController: ModalController,
                private coursesService: CoursesService,
                private formBuilder: FormBuilder,
                private alertController: AlertController) {
    }

    ngOnInit() {
        this.newModule.courseId = this.courseId;
        console.log("CourseID:", this.courseId)
        this.moduleObservable = this.coursesService.getCourseModule(this.moduleId);

        this.moduleObservable.pipe(
            map(module => {

                if (module) {
                    this.newModule = module;
                }

                return this.formBuilder.group({
                    title: [this.newModule.title != ''
                        ? this.newModule.title
                        : 'SEO first steps',
                        Validators.compose([Validators.minLength(10), Validators.required])],
                    moduleNumber: [this.newModule.moduleNumber
                        ? this.newModule.moduleNumber
                        : '',
                        Validators.compose([Validators.required])]
                })
            }))
            .subscribe(form => {
                this.moduleCreationForm = form;
            })

    }

    cancel() {
        this.modalController.dismiss();
    }

    save() {
        if (this.moduleCreationForm.valid) {

            this.newModule.title = this.moduleCreationForm.value.title;
            this.newModule.moduleNumber = this.moduleCreationForm.value.moduleNumber;

            if (this.moduleId) {
                console.log("Updating module")
                this.coursesService.updateModule(this.moduleId, this.newModule).then(() => {
                    this.modalController.dismiss();
                })
            } else {
                console.log("Adding module")
                this.coursesService.addModule(this.newModule).then(() => {
                    this.modalController.dismiss();
                });
            }
        } else {
            this.showBasicAlert("Form data is not valid", "Please fill the form properly.")
        }
    }

    async showBasicAlert(title, text) {
        const alert = await this.alertController.create({
            header: title,
            message: text,
            buttons: ['OK']
        });

        alert.present();
    }
}
