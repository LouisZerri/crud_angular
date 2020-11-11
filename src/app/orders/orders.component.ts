import { Component, OnInit } from '@angular/core';
import {OrderService} from '../services/order.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orderList;

  constructor(public orderService: OrderService,
              private route: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList(): void
  {
    this.orderService.getOrderList().then(res => this.orderList = res);
  }

  openForEdit(orderID: number): void
  {
    this.route.navigate(['/order/edit/' + orderID]);
  }

  onOrderDelete(id: number): void
  {
    if (confirm('Are you sure to delete this record?'))
    {
      this.orderService.deleteOrder(id).then(res => {
        this.refreshList();
        this.toastr.warning('Deleted Successfully', 'Restaurant Lorem Ipsum');
      });
    }
  }
}
