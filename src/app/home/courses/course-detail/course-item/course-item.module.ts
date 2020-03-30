import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseItemPageRoutingModule } from './course-item-routing.module';

import { CourseItemPage } from './course-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseItemPageRoutingModule
  ],
  declarations: [CourseItemPage]
})
export class CourseItemPageModule {}
