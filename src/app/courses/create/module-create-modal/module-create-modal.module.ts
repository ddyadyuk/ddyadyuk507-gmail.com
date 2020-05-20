import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ModuleCreateModalPageRoutingModule} from './module-create-modal-routing.module';

import {ModuleCreateModalPage} from './module-create-modal.page';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonicModule,
        ModuleCreateModalPageRoutingModule
    ],
    declarations: [ModuleCreateModalPage]
})
export class ModuleCreateModalPageModule {
}
