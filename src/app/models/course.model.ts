import {Category} from "./category.model";

export class Course {
    constructor(public id: string,
                public title: string,
                public description: string,
                public category: Category[],
                public imgUrl: string) {
    }
}
