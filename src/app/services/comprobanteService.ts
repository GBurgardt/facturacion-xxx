import { Injectable } from '@angular/core';
import { SisModulo } from 'app/models/sisModulo';
import { Producto } from '../models/producto';

@Injectable()
export class ComprobanteService { 

    constructor() { };
    
    /**
     * Retorna una instancia de sismodulo vacia que se usa en todos
     */
    getEmptySisModulo = () => new SisModulo();

    getEmptyProducto = () => new Producto();

}