import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class InterestPaymentService {

  constructor(private commonHttpService:CommonHttpService) { }

  updateInterestPayment(object:any){
    return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  addInterestPayment(object:any){
    return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS+ ERP_TRANSACTION_CONSTANTS.ADD);
  }

  getAllInterestPayment(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
 
  getInterestPayment(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS + ERP_TRANSACTION_CONSTANTS.GET);
  }

  deleteInterestPayment(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.delete( headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getTransactionListBasedOnAccountWithDueInterestPayments(accountNumber:any){
    let headers = new HttpHeaders({ 'accountNumber': accountNumber + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS + ERP_TRANSACTION_CONSTANTS.GET_TRANSACTION_LIST_BASED_ON_ACCOUNT_WITH_DUE_INTEREST_PAYMENTS);
  }
  getInterestPaymentByAccountNumber(accountNumber:any){
    let headers = new HttpHeaders({ 'accountNumber': accountNumber + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS + ERP_TRANSACTION_CONSTANTS.GET_ALL_TRANSACTION_LIST_WITH_INTEREST_PAYMENT_DETAILS);
  }
  getAllTransactionModes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.TRANSACTION_MODES + Configuration.GET_ALL);
  }
  
}
