import { Persons } from './../Model/azure-face-idservice';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';
import { PersonGroupPersonList } from '../Model/azure-face-idservice';

@Injectable({
  providedIn: 'root'
})



export class FaceIDServiceService {

  personGroupId: string = 'yjffacegroup1';
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  showWebcam = true;
  deviceId: string;


  constructor(
    private httpc: HttpClient
  ) { }


  //搜尋已登入過的人員列表
  GetPersonGroupPersonList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '4d4be5cf642849bc9bfc970697f8269c'
      })
    };
    const myObj = {
      'personGroupId': 'yjffacegroup1'
    };
    const body = JSON.stringify(myObj);

    let promise = new Promise((resolve, reject) => {
      this.httpc.get("https://faceidvocain.cognitiveservices.azure.com/face/v1.0/persongroups/yjffacegroup1/persons",httpOptions
        ).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  //檢視照片裡的人臉辨識結果
  GetFaceID(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': '4d4be5cf642849bc9bfc970697f8269c'
      })
    };
    const body = this.dataURItoBlob(webcamImage.imageAsDataUrl);
    let promise = new Promise((resolve, reject) => {
      this.httpc.post("https://faceidvocain.cognitiveservices.azure.com/face/v1.0/detect?returnFaceAttributes=age,gender,emotion",
        body, httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  AddFace(personId:string,webcamImage: WebcamImage){
    this.webcamImage = webcamImage;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': '4d4be5cf642849bc9bfc970697f8269c'
      })
    };
    const body = this.dataURItoBlob(webcamImage.imageAsDataUrl);
    let promise = new Promise((resolve, reject) => {
      this.httpc.post("https://faceidvocain.cognitiveservices.azure.com/face/v1.0/persongroups/"+this.personGroupId+'/persons/'+
      personId+'/persistedFaces?detectionModel=detection_01',
        body, httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  TranGroup(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '4d4be5cf642849bc9bfc970697f8269c'
      })
    };
    const body = ''
    let promise = new Promise((resolve, reject) => {
      this.httpc.post("https://faceidvocain.cognitiveservices.azure.com/face/v1.0/persongroups/"+this.personGroupId+'/train',
        body, httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  GetTranStatus(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '4d4be5cf642849bc9bfc970697f8269c'
      })
    };
    let promise = new Promise((resolve, reject) => {
      this.httpc.get("https://faceidvocain.cognitiveservices.azure.com/face/v1.0/persongroups/"+this.personGroupId+'/training',
        httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  IdentifyFace(FaceID:string,personId:string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '4d4be5cf642849bc9bfc970697f8269c'
      })
    };
    const myObj = {
      'faceIds': [
        FaceID
      ],
      'personGroupId':this.personGroupId,
      'personId':personId
    };
    const body = JSON.stringify(myObj);
    let promise = new Promise((resolve, reject) => {
      this.httpc.post("https://faceidvocain.cognitiveservices.azure.com/face/v1.0/identify",
        body, httpOptions).toPromise()
        .then(data => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(false);
        });
    });
    return promise;
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

}
