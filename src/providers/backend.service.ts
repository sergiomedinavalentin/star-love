import { Injectable, NgZone } from '@angular/core';
import { ToastController} from 'ionic-angular';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import { LocalConfig } from '../local.config';

export interface IResponseObjects {
  success: boolean,
  result: Array<any>,
  size?: number,
  error?: any
}

@Injectable()
export class BackendService {

  defaultHeaders: any = {
    'Content-Type': 'application/json'
  };

  constructor (
    private http: Http,
    private localConfig: LocalConfig,
    private ngZone: NgZone,
    private toastCtrl: ToastController) {}

  /**
   * Performs a GET to the backend
   * @param resourceName
   * @param params
   * @return {Promise<T>|Promise<ErrorObservable>}
   */
  getResources(resourceName: string, params?:Object): Promise<any> {
    let options: RequestOptions = new RequestOptions({
      headers: new Headers(this.defaultHeaders)
    });

    if (params) {
      options.search = this.objectToURLSearchParams(params);
    }

    let request = this.http.get(this.localConfig.serverBaseUrl + resourceName, options)
      .map(this.extractFullBody).share();

    return new Promise((resolve, reject) => {
      request.subscribe(res => {
        resolve(res);
      }, error => {
        console.log('error', error);
      });
    });
  }

  /**
   * Verifies if the result has success: true
   * @param res
   * @return {IResponseObjects}
   */
  private extractFullBody(res: Response) {
    let body: IResponseObjects = res.json();
    return body;
  }

  /**
   * Creates a URLSearchParams object using object properties
   * @param obj
   * @param prefix
   * @return {URLSearchParams}
   */
  private objectToURLSearchParams(obj: any, prefix?: string): URLSearchParams {
    var urlSearchParams = new URLSearchParams();
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + '[' + p + ']' : p,
          v = obj[p];
        urlSearchParams.set(k, v === 'object' ? JSON.stringify(v) : v);
      }
    }
    return urlSearchParams;
  }

}
