import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class CiCommunicationService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateCiLoanCommunicationDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addCiLoanCommunicationDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getCiLoanCommunicationDetailsById(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllCiLoanCommunicationDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteCiLoanCommunicationDetails(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getCommunicationsByLoanApplicationId(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.GET_COMMUNICATIONS_BY_LOAN_APPLICATION_ID);
  }
}
