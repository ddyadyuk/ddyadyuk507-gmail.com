import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {AngularFirestore} from "@angular/fire/firestore";
import {map} from "rxjs/operators";
import {Category} from "../models/category.model";

export interface CategoryDTO {
    title: string
}

@Injectable({
    providedIn: 'root'
})

export class CategoryService {

    categoriesObs: Observable<Category[]>;
    categories: CategoryDTO[];

    constructor(private firestore: AngularFirestore) {
        this.categoriesObs = this.firestore.collection<Category>("categories")
            .snapshotChanges()
            .pipe(
                map(action => action.map(a => {
                        const data = a.payload.doc.data() as CategoryDTO
                        const id = a.payload.doc.id;

                        return {id, ...data}
                    }
                ))
            );

        this.categoriesObs.subscribe(categories => {
            this.categories = categories;
        });
    }

    addCategory(category: Category) {
        console.log("Category " + category.title + " has been added.")
        return this.firestore.collection("categories").doc(category.title).set({
            title: category.title
        });
    }

    deleteCategory(categoryId: string) {
        return this.firestore.doc(`categories/${categoryId}`).delete();
    }


    verifyCategories(categories: string[]) {
        let updatedCategories = 0;
        for (let itemCategory of categories) {

            //If the category is new
            if (this.categories.filter(category => {
                console.log("category" + category.title + " item " + itemCategory)
                return (category.title === itemCategory);
            }).length < 0) {
                console.log("Adding Category ", itemCategory);
                const newCategory = new Category(itemCategory, itemCategory)
                this.addCategory(newCategory);
                updatedCategories = updatedCategories++;
            } else {
                console.log("The category is already present");
            }
        }

        console.log("Updated courses")
        return updatedCategories;
    }

}
