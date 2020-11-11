import { Component, OnInit } from '@angular/core';
import {OrderService} from '../../services/order.service';
import {NgForm} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {OrderItemsComponent} from '../order-items/order-items.component';
import {CustomerService} from '../../services/customer.service';
import {Customer} from '../../models/customer.model';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  customerList: Customer[];
  isValid: boolean = true;

  constructor(public orderService: OrderService,
              private dialog: MatDialog,
              public customerService: CustomerService,
              private toastr: ToastrService,
              private router: Router,
              private currentRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const orderID = this.currentRoute.snapshot.paramMap.get('id');

    if (orderID === null)
    {
      this.resetForm();
    }
    else
    {
      this.orderService.getOrderById(parseInt(orderID, null)).then(res => {
        this.orderService.formData = res.order;
        this.orderService.orderItems = res.orderDetails;
      });
    }

    this.customerService.getCustomerList().then(res => this.customerList = res as Customer[]);
  }

  resetForm(form?: NgForm): void
  {
    if (form === null)
    {
      form.resetForm();
    }

    this.orderService.formData = {
      OrderID: null,
      OrderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      CustomerID: 0,
      PMethod: '',
      GTotal: 0,
      DeletedOrderItemIDs: ''
    };

    this.orderService.orderItems = [];
  }

  addOrEditOrderItem(orderItemIndex, OrderId): void
  {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {orderItemIndex, OrderId};

    this.dialog.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(res => {
      this.updateGrandTotal();
    });
  }

  onDeleteOrderItem(orderItemId: number, i: number): void
  {
    if (orderItemId !== null)
    {
      this.orderService.formData.DeletedOrderItemIDs += orderItemId + ',';
    }

    this.orderService.orderItems.splice(i, 1);
    this.updateGrandTotal();
  }

  updateGrandTotal(): void
  {
    this.orderService.formData.GTotal = this.orderService.orderItems.reduce((previous, current) => {
      return previous + current.Total;
    }, 0);

    this.orderService.formData.GTotal = parseFloat((this.orderService.formData.GTotal.toFixed(2)));

  }

  validateForm(): boolean
  {
    this.isValid = true;
    if (this.orderService.formData.CustomerID === 0)
    {
      this.isValid = false;
    }
    else if (this.orderService.orderItems.length === 0)
    {
      this.isValid = false;
    }

    return this.isValid;
  }

  onSubmit(form: NgForm): void
  {
    if (this.validateForm())
    {
      this.orderService.saveOrUpdateOrder().subscribe(res => {
        this.resetForm();
        this.toastr.success('Submitted Successfully', 'Restaurant Lorem Ipsum');
        this.router.navigate(['/orders']);
      });
    }
  }

}
