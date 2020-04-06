import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { EstadoDTO as EstadoDTO } from "../../models/estado.dto";

@Injectable()
export class EstadoService {

    constructor(public http : HttpClient) {
    }

    findAll() : Observable<EstadoDTO[]> {
        return this.http.get<EstadoDTO[]>(`${API_CONFIG.baseUrl}/estados`);
    }
}