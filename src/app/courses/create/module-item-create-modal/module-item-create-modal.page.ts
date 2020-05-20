import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModuleItemDTO, CoursesService} from "../../../services/courses.service";
import {ModuleItemModel} from "../../../models/module-item.model";
import {map} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";

@Component({
    selector: 'app-module-item-create-modal',
    templateUrl: './module-item-create-modal.page.html',
    styleUrls: ['./module-item-create-modal.page.scss'],
})
export class ModuleItemCreateModalPage implements OnInit, OnDestroy {

    @Input() moduleId: string;
    @Input() itemId: string;

    moduleItemCreationForm: FormGroup;

    //ToDo choose between Model and DTO models.
    newModuleItem: ModuleItemModel = {
        id: '',
        title: '',
        itemNumber: null,
        content: '',
        moduleId: '',
        open: false
    };

    itemObservable: Observable<ModuleItemModel>;

    getItemSub: Subscription;

    constructor(private modalController: ModalController,
                private formBuilder: FormBuilder,
                private courseService: CoursesService,
                private alertController: AlertController) {
    }

    ngOnInit() {
        this.newModuleItem.moduleId = this.moduleId;
        console.log("Module id:", this.moduleId);

        this.itemObservable = this.courseService.getItem(this.itemId);

        this.getItemSub = this.itemObservable
            .pipe(
                map(item => {

                    console.log("Founded item: ", item);

                    if (item) {
                        this.newModuleItem = item;
                    }
                    return this.formBuilder.group({
                        title: [this.newModuleItem.title != ''
                            ? this.newModuleItem.title
                            : 'Reviving something',
                            Validators.compose([Validators.minLength(10), Validators.required])],
                        itemNumber: [this.newModuleItem.itemNumber != null
                            ? this.newModuleItem.itemNumber
                            : '',
                            Validators.compose([Validators.required])],
                        content: [this.newModuleItem.content != ''
                            ? this.newModuleItem.content
                            : '',
                            Validators.compose([Validators.required])],
                    })
                })).subscribe(form => {
                this.moduleItemCreationForm = form;
            });
    }

    cancel() {
        this.modalController.dismiss();
    }

    save() {
        if (this.moduleItemCreationForm.valid) {

            this.newModuleItem.title = this.moduleItemCreationForm.value.title;
            this.newModuleItem.itemNumber = this.moduleItemCreationForm.value.itemNumber;
            this.newModuleItem.content = this.moduleItemCreationForm.value.content;

            if (this.itemId) {
                console.log("Updating module item: ", this.itemId);
                this.courseService.updateModuleItem(this.itemId, this.newModuleItem).then(() => {
                    this.modalController.dismiss();
                });
            } else {
                console.log("Adding module item: ", this.itemId);
                this.courseService.addCourseItem(this.newModuleItem).then(() => {
                        this.modalController.dismiss();
                    }
                );
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

    ngOnDestroy(): void {
        this.getItemSub.unsubscribe();
    }
}
