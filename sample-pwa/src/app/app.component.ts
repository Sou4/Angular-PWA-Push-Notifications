import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {SwPush} from "@angular/service-worker";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  titile = "";
  desc = "";

  constructor(private http: HttpClient,private swPush: SwPush,) { }

  readonly VAPID_PUBLIC_KEY = "BE3KRLDGZjcW1U1F5b-GhOYPz5_Lt2QgHbPrOXgTIDOUpguTqIWL6FUSWkSTy9mhAjirIbfJUgMWBfRVF9rfNq0";

  subscribeToNotifications(){
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => {
      console.log("Notification Subscription: ", sub);
      this.addPushSubscriber(sub);
    })
    .catch(err => console.error("Could not subscribe to notifications", err));
  }

  // addPushSubscriber(subObj){
  //     this.http.post("http://localhost:7070/api/addPushSubscriber",subObj)
  //     .subscribe(res => {
  //       console.log(res)
  //     });
  // }

  // sendNotifiactions(){
  //    this.http.post("http://localhost:7070/api/sendNotifications",null)
  //     .subscribe(res => {
  //       console.log(res)
  //     });
  // }

  addPushSubscriber(subObj){
      this.http.post("http://192.168.43.145:7070/api/addPushSubscriber",subObj)
      .subscribe(res => {
        console.log(res)
      });
  }

  sendNotifiactions(){

    var Obj = {
      titile : this.titile,
      desc : this.desc
    }

    this.http.post("http://192.168.43.145:7070/api/sendNotifications",Obj)
      .subscribe(res => {
        console.log(res)
      });
  }
}
