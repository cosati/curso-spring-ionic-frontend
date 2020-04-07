import { Injectable } from "@angular/core";
import { HttpRequest, HttpEvent, HttpHandler, HTTP_INTERCEPTORS, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs/RX";
import { StorageService } from "../services/storage.service";
import { AlertController } from "ionic-angular";
import { FieldMessage } from '../models/fieldmessage';

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

                case 422: // Unprocessed Entity
                    this.handle422(errorObj);
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

    handle422(errorObj) {
        let alert = this.alertCtrl.create({
            title: 'Erro 422: Validação',
            message: this.listErrors(errorObj.errors),
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

    private listErrors(messages : FieldMessage[]) : string {
        let s : string = '';
        for (var i=0; i<messages.length; i++) {
            s = s + '<p><strong>' + messages[i].fieldName + '</strong>: '  + messages[i].message + '</p>';
        }
        return s;
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS, 
    useClass: ErrorInterceptor, 
    multi: true,
};