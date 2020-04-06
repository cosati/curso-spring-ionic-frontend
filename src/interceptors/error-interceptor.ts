import { Injectable } from "@angular/core";
import { HttpRequest, HttpEvent, HttpHandler, HTTP_INTERCEPTORS, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs/RX";
import { StorageService } from "../services/storage.service";
import { AlertController } from "ionic-angular";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService, public alertCtrl: AlertController){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
        .catch((error, caught) => {

            let errorObj = error;
            if (errorObj.error) {
                errorObj = errorObj.error;
            }
            if (!errorObj.status) { // para verificar se está no formato JSON
                errorObj = JSON.parse(errorObj); // Se não estiver em JSON faz o parse
            }

            console.log("Erro interceptado pelo interceptor: ");
            console.log(errorObj);

            switch (errorObj.status) {
                case 401: // Unauthorized
                    this.handle401();
                    break;

                case 403: // Forbidden
                    this.handle403();
                    break;

                default:
                    this.handleDefaultError(errorObj);

            }

            return Observable.throw(errorObj);
        }) as any
    }

    // Forbidden
    handle403() {
        this.storage.setLocalUser(null);
    }

    // Unauthorized
    handle401() {
        let alert = this.alertCtrl.create({
            title: 'Erro 401: falha de autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false, // apertar no botão do alert pra sair do mesmo
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handleDefaultError(errorObj) {
        let alert = this.alertCtrl.create({
            title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false, // apertar no botão do alert pra sair do mesmo
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS, 
    useClass: ErrorInterceptor, 
    multi: true,
};