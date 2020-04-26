import {Component, Input, OnInit} from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {CourseModuleDTO, CoursesService} from "../../../services/courses.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-module-create-modal',
    templateUrl: './module-create-modal.page.html',
    styleUrls: ['./module-create-modal.page.scss'],
})
export class ModuleCreateModalPage implements OnInit {

    @Input() courseId: string;

    moduleCreationForm: FormGroup;
    newModule: CourseModuleDTO = {
        courseId: '',
        title: '',
        moduleNumber: null
    };

    constructor(private modalController: ModalController,
                private coursesService: CoursesService,
                private formBuilder: FormBuilder,
                private alertController: AlertController) {
    }

    ngOnInit() {
        this.newModule.courseId = this.courseId;

        this.moduleCreationForm = this.formBuilder.group({
            title: ['SEO first steps', Validators.compose([Validators.minLength(10), Validators.required])],
            moduleNumber: ['', Validators.compose([Validators.required])]
        })
    }

    cancel() {
        this.modalController.dismiss();
    }

    save() {
        if (this.moduleCreationForm.valid) {

            this.newModule.title = this.moduleCreationForm.value.title;
            this.newModule.moduleNumber = this.moduleCreationForm.value.moduleNumber;

            this.coursesService.addModule(this.newModule).then(() => {
                    this.modalController.dismiss();
                }
            );
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
