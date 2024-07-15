import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  api:String="https://localhost:7054"
  token:String | any = "";

  constructor(private http: HttpClient) { 
    this.token=localStorage.getItem('token');
  }
  post<T>(apiUrl: string, body: any, callBack: (res: T) => void, errorCallBack?: (error: any) => void) {
    this.token = localStorage.getItem('token');
    this.http.post<T>(`${this.api}/${apiUrl}`, body, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    }).subscribe({
      next: (res) => {
          callBack(res);
      },
      error: (error) => {
        if (errorCallBack) {
          errorCallBack(error); 
        }
      }
    });
  }
}
