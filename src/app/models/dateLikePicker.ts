export class DateLikePicker {
    day: number;
    month: number; 
    year: number;

    constructor (fechaDate?: Date, dataLikePicker?: any) {
        if (fechaDate) {
            this.day = fechaDate.getDate();
            this.month = fechaDate.getMonth() + 1; // Esta genialidad de Js trae los meses de 0 en adelante.. por eso sumo 1
            this.year = fechaDate.getFullYear();
        } else if (dataLikePicker) {
            this.day = dataLikePicker.day;
            this.month = dataLikePicker.month;
            this.year = dataLikePicker.year;
        }
    }

    getFechaFormateada = () => `${this.year}-${this.month < 10 ? '0'+this.month:this.month}-${this.day < 10 ? '0'+this.day : this.day}`
}