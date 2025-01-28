import { Component, OnInit } from '@angular/core';
import { InvestmentsTransactionConstant } from '../../investments-transaction-constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shares-withdraw',
  templateUrl: './shares-withdraw.component.html',
  styleUrls: ['./shares-withdraw.component.css']
})
export class SharesWithdrawComponent implements OnInit{

constructor(private router : Router){

}
  ngOnInit(): void {

  }

  navigateBack(){
        this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_TRANSACTION]);
  }

}
