import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private httpClient: HttpClient) { }

  getItemList(): Promise<any>
  {
    return this.httpClient.get(environment.apiUrl + '/Items').toPromise();
  }


}
