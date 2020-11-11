import { Injectable } from '@angular/core';
import {Order} from '../models/order.model';
import {OrderItem} from '../models/order-item.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Subscribable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  formData: Order;
  orderItems: OrderItem[];

  constructor(public httpClient: HttpClient) { }

  saveOrUpdateOrder(): Subscribable<any>
  {
    const body = {
      ...this.formData,
      OrderItem: this.orderItems
    };

    return this.httpClient.post(environment.apiUrl + '/Orders', body);
  }

  getOrderList(): Promise<any>
  {
    return this.httpClient.get(environment.apiUrl + '/Orders').toPromise();
  }

  getOrderById(id: number): Promise<any>
  {
    return this.httpClient.get(environment.apiUrl + '/Orders/' + id).toPromise();
  }

  deleteOrder(id: number): Promise<any>
  {
    return this.httpClient.delete(environment.apiUrl + '/Orders/' + id).toPromise();
  }

}
