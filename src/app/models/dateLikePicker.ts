export class DateLikePicker {
    day: number;
    month: number; 
    year: number;

    constructor (fechaDate: Date) {
        this.day = fechaDate.getDay();
        this.month = fechaDate.getMonth();
        this.year = fechaDate.getFullYear();
    }
}