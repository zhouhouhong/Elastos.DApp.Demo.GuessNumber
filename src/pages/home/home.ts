import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { HistoryPage } from '../history/history';

//add code begin
declare let cordova: any;
declare let check_DID: any;
//add code  end

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public curBlock = 'f'
//chinajoylottery-f-EHmMW4UVLBkr6QB61CBexUQiXvFigvDJwi-fe5d57161eb78e0d3ff5d5a24398e9aea8914f71e762f06a49cd515b45d96af2
  public subMitPrefix = 'chinajoylottery' // 提交链接前缀
  //public subMitSubfix = 'EHmMW4UVLBkr6QB61CBexUQiXvFigvDJwi' // DID参数
  public subMitAppSeret = 'fe5d57161eb78e0d3ff5d5a24398e9aea8914f71e762f06a49cd515b45d96af2' // AppSeret

  public submitParams = null
  
  public did = null;
  
  GetQueryKeyString(url, name){
    var reg = new RegExp("(^|&|/?)"+ name +"=([^&]*)(&|$)");
    var r = url.match(reg);
    if(r != null) 
		return  decodeURI(r[2]);
	
	return null;
  }
  
  GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!= null) return  decodeURI(r[2]); 
	return null;
  }
  
  constructor(public navCtrl: NavController, public localStorage: Storage, public alertCtrl: AlertController) {
	let type = this.GetQueryString("type");
	if(type == "did_login") {    
		let didNum = this.GetQueryString("didNum");
		let sign = this.GetQueryString("sign");
		let didPubkey = this.GetQueryString("didPubkey");
		let message = this.GetQueryString("message");
	 	//TEMP	
		//if(check_DID(didPubkey, didNum, message, sign))
		{	
            this.did = didNum;		
		    localStorage.set('appDid', this.did);
		}
	}
    if(this.did == null) {
		localStorage.get('appDid').then((val) => {
		if(val) {
			this.did = val;
		} else {
			 this.showAlert();
		}
		});
	}
	
    this.initData()
  }

 
    // 弹出框提示是否Did登陆
  showAlert() {
    const alert = this.alertCtrl.create({
      title: '用户未登录!',
      subTitle: '获取钱包DID登录!',
      buttons: [{
        text: '确认',
        handler: data => {
          this.require_DID()
        }
      }]
    });
    alert.present();
  }

  goToHistory() {
    this.navCtrl.push(HistoryPage);
  }

  inputNum(val) {
    this.curBlock = val
  }

  submitToElastos() {
    this.submitParams = this.subMitPrefix + '-' + this.curBlock + '-' + this.did + '-' + this.subMitAppSeret;
    this.goONNext()
  }

  // 提交的操作
  goONNext() {  
    this.require_pay();
    this.initData()
  }

  // 初始化数据
  initData() {
    this.curBlock = 'f'
    this.submitParams = null
  }

  
   require_DID(){
	 var me = this; 
	 var success = function (data) {
        console.log("---ElastosJS require_wallet DID" + data);
		let type = me.GetQueryKeyString(data, "type");
	    if(type == "did_login") {
		let didNum = me.GetQueryKeyString(data, "didNum");
		let sign = me.GetQueryKeyString(data, "sign");
		let didPubkey = me.GetQueryKeyString(data, "didPubkey");
		let message = me.GetQueryKeyString(data, "message");
	 	//TEMP	
		//if(check_DID(didPubkey, didNum, message, sign))
		{	
            me.did = didNum;		
		    me.localStorage.set('appDid', didNum);
		}
		
		let alert = me.alertCtrl.create({
        title: 'Tips',
        message: 'Get DID Success',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              console.log("===ElastosJS Get DID Success tips click");
			  alert.dismiss();
            }
          }
        ]
      });
      alert.present();
	} 
		
    };
	
	  cordova.plugins.appmanager.StartApp("wallet/www/index.html" +
	  "?type=did_login&message=this is did login message&backurl=guess/www/index.html", 
	  success, 
	  function (error) {console.log("===ElastosJS Wallet require_DID error" + error);});
  }
  
  require_pay(){
	  var me = this; 
	  var success = function (data) {
        console.log("---ElastosJS  require_wallet DID" + data);
		let type = me.GetQueryKeyString(data, "type");
	    if(type == "payment") {
			let txId = me.GetQueryKeyString(data, "txId");		
			let alert = me.alertCtrl.create({
			title: 'Tips',
			message: 'Wallet Pay Success',
			buttons: [
			  {
				text: 'Ok',
				handler: () => {
				  console.log("===ElastosJS Wallet Pay Success tips click");
				  alert.dismiss();
				}
			  }
			]
			});	  
			alert.present();
		} 
	  }
	
	 cordova.plugins.appmanager.StartApp("wallet/www/index.html" + "?type=payment&amount=10000&address=EeDUy6TmGSFfVxXVzMpVkxLhqwCqujE1WL&memo="+ this.submitParams +"&information=sss&backurl=guess/www/index.html", 
	  success, 
	  function (error) { console.log("===ElastosJS Wallet Pay error tips click" + error); });
    }

  
   
  backHome() {
    appService.launcher();
  }

  closeApp() {
    appService.close();
  }
  
}
