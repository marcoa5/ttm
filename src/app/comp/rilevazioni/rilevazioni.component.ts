import { Component, Input, OnInit } from '@angular/core';
import firebase from 'firebase';
import 'firebase/database';
import * as moment from 'moment';

export interface eleP{
  Data: string;
  Nome: string;
  Ris: string;
}

@Component({
  selector: 'ttm-rilevazioni',
  templateUrl: './rilevazioni.component.html',
  styleUrls: ['./rilevazioni.component.scss']
})
export class RilevazioniComponent implements OnInit {
elenco=[];
day:string;
visual:boolean;
_inizio; _fine;
@Input() email:string; 
@Input() 
get inizio(){
  return this._inizio;
}
set inizio(inizio:number){
  this._inizio = parseInt(moment(inizio).locale('IT').format('YYYYMMDD'));
};
@Input() 
get fine(){
  return this._fine;
}
set fine(fine:number){
  this._fine = parseInt(moment(fine).locale('IT').format('YYYYMMDD'));
  this.leggi();
}
  constructor() { }

  ngOnInit(): void {
    this.visual=false;
  }

  leggi(){
    this.visual=false;
    this.elenco=[];
    if(this.inizio && this.fine){
      var ref = firebase.database().ref('presenze/rec/' + this.email)
      ref.orderByChild('data').startAt(this.inizio).endAt(this.fine).once('value').then((a)=>{
        
      a.forEach(b=>{
        var item1: eleP={
          Data: moment(b.key.substring(0,10)).locale('IT').format('LL'),
          Nome: a.key,
          Ris: b.val().ris
        }
        this.elenco.push(item1);
      })
    })
    setTimeout(()=>{
      this.visual=true;
      this.elenco.reverse();
    },1200)
    }
  }
}
