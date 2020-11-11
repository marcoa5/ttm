import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import "firebase/analytics";
import 'firebase/auth';
import 'firebase/database';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { exit } from 'process';
import { Router } from '@angular/router';

const firebaseConfig = {
  apiKey: "AIzaSyByNcKM84Xlba7MyGke7jP9B_GuCSGltV4",
  authDomain: "ttm-epi.firebaseapp.com",
  databaseURL: "https://ttm-epi.firebaseio.com",
  projectId: "ttm-epi",
  storageBucket: "ttm-epi.appspot.com",
  messagingSenderId: "361191690210",
  appId: "1:361191690210:web:1e3fd22f531f4ff2eeb3bb",
  measurementId: "G-02WRRW4YBW"
};

@Component({
  selector: 'ttm-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  login:boolean=true;
  Uemail:string='0';
  UId:string;
  form;
  ch:boolean = true;
  errore;
  ver;
  constructor(fb : FormBuilder, private router: Router) {
    this.form = fb.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    firebase.default.initializeApp(firebaseConfig);
   }

  ngOnInit() {
    window.onresize = (a)=>{console.log(this.getOrientation())}
    this.cont_rec()
  }

  logina(){
    let provider = new firebase.default.auth.OAuthProvider('microsoft.com');
    provider.setCustomParameters({
      prompt: 'consent',
      tenant: '896ecbea-bd27-4a3c-a131-34aa0b46a086'
    });
    firebase.default.auth().signInWithRedirect(provider);
  }

  logout(){
    firebase.default.auth().signOut();
    this.Uemail = '0'
  }

  home(){
    this.ver=0;
    this.cont_rec()
  }
  
  rile(){
    this.ver=3;
  }
  
  getOrientation(){
    var orientation = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
    return orientation;
  }

  cont_rec(){
    firebase.default.auth().onAuthStateChanged(user=>{
      if(user!=null){
        this.Uemail = user.displayName;
        this.UId = user.uid;
        var ref = firebase.default.database().ref('presenze/ch/' + moment(new Date()).format('YYYYMMDD') + '/');
        ref.once('value', (a)=>{
          a.forEach(b=>{
            if(b.key==this.Uemail){this.ver=1;}
          })
        }).finally(()=>{if(this.ver!=1){this.ver=2}}
        )
      }
    })
  }

  cambiaVer(e){
    this.ver=4;
  }
}
 