import { Injectable } from "@angular/core";
import { AuthService } from "app/services/authService";
import { LocalStorageService } from "app/services/localStorageService";
import { environment } from "environments/environment";
import { ProductoPendiente } from "app/models/productoPendiente";

@Injectable()
export class RemitosInternosService {
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) { }

    /**
     * Busca un producto
     */
    buscarProducto = (idProducto) => {
        const idMonedaPeso = 1;

        return this.authService.getBuscarProducto(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(idProducto)()(idMonedaPeso)
            .map(
                respProdEnc => respProdEnc && respProdEnc.arraydatos && respProdEnc.arraydatos.length > 0 ?
                    new ProductoPendiente(respProdEnc.arraydatos[0]) : null
            )
            .toPromise()
    }
}