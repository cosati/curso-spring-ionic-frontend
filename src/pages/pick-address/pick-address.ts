import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  items: EnderecoDTO[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.items = [
      {
        id: "1",
        logradouro: "Rua Souza Dantas",
        numero: "580",
        complemento: null,
        bairro: "Orfãs",
        cep: "84015102",
        cidade: {
          id: "3",
          nome: "Ponta Grossa",
          estado: {
            id: "1",
            nome: "Paraná"
          }
        }
      },
      {
        id: "2",
        logradouro: "Av. União Pan-Americana",
        numero: "1111",
        complemento: "T3 AP04",
        bairro: "Oficinas",
        cep: "84045310",
        cidade: {
          id: "3",
          nome: "Ponta Grossa",
          estado: {
            id: "1",
            nome: "Paraná"
          }
        }
      }
    ];
  }

}
