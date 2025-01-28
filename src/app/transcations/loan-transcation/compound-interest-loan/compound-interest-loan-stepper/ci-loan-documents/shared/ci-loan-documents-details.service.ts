import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class CiLoanDocumentsDetailsService {
  
  constructor(private commonHttpService: CommonHttpService) { }

  updateCiLoanDocumentsDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_DOCUMENTS_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addCiLoanDocumentsDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_DOCUMENTS_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getCiLoanDocumentsDetailsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_DOCUMENTS_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllCiLoanDocumentsDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_DOCUMENTS_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteCiLoanDocumentsDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_DOCUMENTS_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }

  getAllDocuments() {
    return this.commonHttpService.getAll(Configuration.LOANS + Configuration.DOC_TYPES + Configuration.GET_ALL);
  }

  getCiLoanDocumentsDetailsByApplicationId(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_DOCUMENTS_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_CI_LOAN_DOCUMENTS_BY_APPLICATION_ID);
  }

}
