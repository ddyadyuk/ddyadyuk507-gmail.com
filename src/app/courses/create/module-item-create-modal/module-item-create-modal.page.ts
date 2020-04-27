import {Component, Input, OnInit} from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CourseItemDTO, CoursesService} from "../../../services/courses.service";

@Component({
  selector: 'app-module-item-create-modal',
  templateUrl: './module-item-create-modal.page.html',
  styleUrls: ['./module-item-create-modal.page.scss'],
})
export class ModuleItemCreateModalPage implements OnInit {

    @Input() moduleId: string;

    moduleItemCreationForm: FormGroup;

    newModuleItem: CourseItemDTO = {
        title: '',
        itemNumber: null,
        content: '',
        moduleId: ''
    };

    constructor(private modalController: ModalController,
                private formBuilder: FormBuilder,
                private courseService: CoursesService,
                private alertController: AlertController) {
    }

  ngOnInit() {
      this.newModuleItem.moduleId = this.moduleId;
      console.log("Module id:", this.moduleId);

      this.moduleItemCreationForm = this.formBuilder.group({
          title: ['Reviving something', Validators.compose([Validators.minLength(10), Validators.required])],
          itemNumber: ['', Validators.compose([Validators.required])],
          content: ['', Validators.compose([Validators.required])],
      })
  }


    cancel() {
        this.modalController.dismiss();
    }

    save() {
        if (this.moduleItemCreationForm.valid) {

            this.newModuleItem.title = this.moduleItemCreationForm.value.title;
            this.newModuleItem.itemNumber = this.moduleItemCreationForm.value.itemNumber;
            this.newModuleItem.content = this.moduleItemCreationForm.value.content;

            this.courseService.addCourseItem(this.newModuleItem).then(() => {
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
