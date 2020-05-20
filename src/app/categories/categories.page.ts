import {Component, OnInit} from '@angular/core';
import {CategoryDTO, CategoryService} from "../services/category.service";
import {Category} from "../models/category.model";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
    selector: 'app-categories',
    templateUrl: './categories.page.html',
    styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

    categories: Category[];

    categoriesSub: Subscription;

    constructor(private categoryService: CategoryService,
                private router: Router) {
    }

    ngOnInit() {
        this.categoriesSub = this.categoryService.categoriesObs.subscribe(categories => {
            this.categories = categories;
        })
    }

    ionViewWillLeave() {
        this.categoriesSub.unsubscribe();
    }

    filterCoursesByCategory(categoryTitle: string) {
        this.router.navigate(['/courses'], {queryParams: {categoryName: categoryTitle}});
    }
}
