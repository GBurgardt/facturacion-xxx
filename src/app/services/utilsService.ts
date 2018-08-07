import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultModal } from '../pages/reusable/modals/default-modal/default-modal.component';
import { AppState } from 'app/app.service';
import { ConfirmationModal } from 'app/pages/reusable/modals/confirmation-modal/confirmation-modal.component';
import { isString } from 'util';
import dynamicClass from 'app/services/dynamicClassService';
import { resourcesREST } from 'constantes/resoursesREST';
import { routing } from '../pages/main/tablas/tablas.routing';
import { DateLikePicker } from 'app/models/dateLikePicker';

@Injectable()
export class UtilsService {

    constructor(
        private modalService: NgbModal,
        private appState: AppState
    ) { }

    /** TODO: Refactorizar este modal y poner bien el titulo y la descrip
     * Método que muestra un modal con el error de logueo
     */
    showModal = (titulo) => (descripcion) => (onClick?) => (datos?) => {
        // Creo el modal
        let activeModal;
        // Me fijo el tipo de modal a mostrar
        if (datos && datos.tipoModal === 'confirmation') {
            // Si o no modal
            activeModal = this.modalService.open(ConfirmationModal, { size: 'sm' });
            activeModal.componentInstance.modalHeader = titulo;
            activeModal.componentInstance.modalContent = descripcion;
        } else {
            // Default
            activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
            activeModal.componentInstance.modalHeader = titulo;
            activeModal.componentInstance.modalContent = descripcion;
        }
        if (onClick) {
            activeModal.result.then(result => {
                // Si hizo click en 'Si', entonces ejecuto la acción.
                if (result) {
                    onClick();
                }
            });
        }
    }

    /**
     * Retorna si un email es valido
     */
    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


    /**
     * Decodifica la respuesta de error y muestra el error
     * @param ex
     */
    decodeErrorResponse = (ex) => {
        console.log(ex);
        let errorBody;

        if (isString(ex['_body'])) {
            errorBody = JSON.parse(ex['_body']);
        } else {
            errorBody = ex['_body'];
        }

        // Mostrar mensaje de error
        this.showModal(errorBody.control.codigo)(errorBody.control.descripcion)()();
    }

    /**
     * Retorna una promise error con el formato de la respuesta del servicio REST
     */
    getPromiseErrorResponse = (titulo) => (descripcion) => {
        return Promise.reject({
            '_body': {
                control: {
                    codigo: titulo,
                    descripcion: descripcion
                }
            }
        });
    }

    /**
     * Dado un objeto de una clase es incompleto, retorna true si algùn campo es null
     * @param objeto El objeto
     * @param ignoreList Lista de keys que no se van a checkear. Formato: ['key1','key2',...,'keyn']
     * @param extraCondition Funcion con condiciones extras particulares de cada formulario
     */
    checkIfIncomplete = (objeto: any) => (ignoreList?: string[])  => (extraCondition?) => {
        // Obtengo la primer key de la clase del objeto recibido
        const idRecurso = Object.keys(objeto)[0];

        // Recorro las keys y checkeo que NO sean null (excepto ignoradas)
        const someKeyIsNull = Object.keys(objeto).some((key) => {
            // Si la key NO está incluida en las ignoradas, la evaluo
            if (
                key !== idRecurso &&
                key !== 'observaciones' &&
                key !== 'empresa'  &&
                (!ignoreList || !ignoreList.includes(key))
            ) {
                // Si es un json..
                if (objeto[key] && typeof objeto[key] === 'object') {
                    const idObjecto = Object.keys(objeto[key])[0];
                    return objeto[key][idObjecto] === null || objeto[key][idObjecto] === '';
                } else {
                    return objeto[key] === '' || objeto[key] === null
                }
            }
        });
        // Evaluo condicion extra
        const resultExtraCondition = extraCondition ? extraCondition(objeto) : false;
        // Si alguna key es null o si se cumple la condicion extra (si esta existe), entonces retorno true (lo uqe significa que deshabilita el button de confirmar)
        return  someKeyIsNull || resultExtraCondition;
    }

    /**
     * A partir de un recurso, retorna la referencia 'rest' (esto es, el endpoitn al que apuntar del services)
     */
    getNameRestOfResource = (recurso) => {
        // Obtengo la clase del objeto recibido
        const ClaseRecurso = dynamicClass(recurso.constructor.name);
        // Obtengo la referencia REST de tal clase
        return resourcesREST[
            Object.keys(resourcesREST).find(key => resourcesREST[key].Clase === ClaseRecurso)
        ].nombre;
    }

    /**
     * A partir de un recurso, retorna el nombre de la key que alberga el id de este recurso
     * Ejemplo: recurso (instnacia de Producto) -> retorna 'idProductos'
     */
    getNameIdKeyOfResource = (recurso) => {
        // Obtengo la primer key de la clase del recurso recibido
        const idRecurso = Object.keys(recurso)[0];
        const id = `${idRecurso[0]}${idRecurso[1]}`;
        const cod = `${idRecurso[0]}${idRecurso[1]}${idRecurso[2]}`;
        // Checkeo si NO es un id o un codigo
        if (id !== 'id' && cod !== 'cod' && !idRecurso.toLowerCase().includes('codigo')) {
            const realIdOrCod = Object.keys(recurso).find(key => {
                // descarto casos particulares
                if (key === 'idFactCabImputada' || key === 'idFactDetalleImputada') {
                    return false;
                }

                const id = `${key[0]}${key[1]}`;
                const tercerCaracter = key[2]
                const cod = `${key[0]}${key[1]}${key[2]}`;
                const cuartoCaracter = key[3]

                return  (id === 'id' && tercerCaracter === tercerCaracter.toUpperCase()) ||
                        (cod === 'cod' && cuartoCaracter === cuartoCaracter.toUpperCase())
            });
            // debugger;
            return realIdOrCod;
        } else {
            // debugger;
            return idRecurso;
        }

    }

    
    /**
     * Se usa en las listas desplegables, te agarra el item definido en el recurso cuando se edita un recurso
     * @param item1
     * @param item2
     */
    dropdownCompareWith(item1: any, item2: any) {
        const idRecurso1 = item1 ? Object.keys(item1)[0] : null;
        const idRecurso2 = item2 ? Object.keys(item2)[0] : null;
        return idRecurso1 && idRecurso2 ? item1[idRecurso1] === item2[idRecurso2] : null;
    }
    // dropdownCompareWith = (keyId?) => (item1: any, item2: any) => {
    //     debugger;
    //     if (item1 && item2) {
    //         if (keyId) {
    //             return item1[keyId] === item2[keyId]
    //         } else {
    //             const idRecurso1 = item1 ? Object.keys(item1)[0] : null;
    //             const idRecurso2 = item2 ? Object.keys(item2)[0] : null;
    //             return idRecurso1 && idRecurso2 ? item1[idRecurso1] === item2[idRecurso2] : null;
    //         }
    //     }
    // }

    /**
     * 
     */
    dateToString = (fechaDate) => {
        return `${fechaDate.year}-${fechaDate.month}-${fechaDate.day}`
    }

    /**
     * Retorna la posicion de un elemento dom dado
     * @param el 
     */
    getOffset( el ) {
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        
        // Le resto el scrolltop de la ventana completa
        _y -= document.documentElement.scrollTop;

        return { top: _y, left: _x };
    }

    /**
     * Retorna el tipo de datos
     */
    getTipoDato = (dato) => (dato && dato.constructor && dato.constructor.name) ? 
        dato.constructor.name : null;
    

    /**
     * Dado un string en formato ddmm retorna dd/mm/aaaa en typeData DateLikePicker, o null en caso de formato incorrecto
     * Si es formato dd/mm/aaaa, tambien retoron un datelikepicker
     */
    stringToDateLikePicker = (valueFecha) => 
        valueFecha.length === 4 ?
            new DateLikePicker(null, {
                day: Number(valueFecha.substring(0, 2)),
                month: Number(valueFecha.substring(2)),
                year: (new Date()).getFullYear()
            }) : 
            new DateLikePicker(null, valueFecha);
    
    /**
     * Decodifica la respuesta del error (scando el _body) y muestra el mensaje
     */
    showErrorWithBody = (err: any) => {

        const theBody = err && err['_body'] ? JSON.parse(err['_body']) : null;

        // debugger;

        this.showModal(theBody.control.codigo)(theBody.control.descripcion)()();
    }

    /**
     * Obtengo una instancia vacia la clase correspondiente a un recurso dado
     */
    getInstanciaVacia = (recursoRest) => recursoRest && recursoRest.Clase ? new recursoRest.Clase() : null;



    formatearFecha = (formato) => (fecha) => {
        // debugger;
        if (fecha && fecha.year) {
            if (formato === 'yyyy-mm-dd') {
                return `${fecha.year}-${fecha.month < 10 ? '0'+fecha.month:fecha.month}-${fecha.day < 10 ? '0'+fecha.day : fecha.day}`;
            } else {
                return `${fecha.day < 10 ? '0'+fecha.day : fecha.day}-${fecha.month < 10 ? '0'+fecha.month:fecha.month}-${fecha.year}`;
            }
        } else {
            return moment(fecha).format(formato)
            // Si es Date
            // if (formato === 'yyyy-mm-dd') {
            //     return `${fecha.year}-${fecha.month}-${fecha.day}`
            // } else {
            //     return `${fecha.day}-${fecha.month}-${fecha.year}`
            // }
        }

    }


    // Flatmap para arrays
    flatMap = (f, arr) => 
        arr.reduce((x, y) => [...x, ...f(y)], [])

    parseDecimal = (key) => Number(key).toFixed(2)

    /**
     * Pasa de datelikepiker a Date
     */
    dateLikePickerToDate = (fecha: DateLikePicker) => {
        let newFecha = new Date();
        if (fecha && fecha.day) {
            // Se le resta 1 porque js cuenta meses desde 0 en adelante
            newFecha.setFullYear(fecha.year, fecha.month - 1, fecha.day);
            return newFecha;
        } else {
            return null;
        }
    }


    checkIfJson = (obj) => (obj && typeof obj === 'object');

}
