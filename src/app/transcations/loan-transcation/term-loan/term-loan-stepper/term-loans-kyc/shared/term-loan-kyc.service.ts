import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { stepperDataModel } from '../../term-loan-application-details/shared/term-application.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TermLoanKycService {
  private organizationDetailsStepper = new BehaviorSubject<stepperDataModel>(null);
  public currentStep = this.organizationDetailsStepper.asObservable();

  public resetCurrentStep() {
    this.organizationDetailsStepper.next(null); // or initial value
  }
  
  constructor(private commonHttpService: CommonHttpService) { }

  changeData(data: stepperDataModel) {
    this.organizationDetailsStepper.next(data)
  }
  updateTermLoanKYCDetails(object: any) {
    return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_KYC_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  addTermLoanKYCDetails(object: any) {
    return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_KYC_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD);
  }

  getAllTermLoanKYCDetails() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_KYC_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getTermLoanKYCDetails(id: any) {
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_KYC_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }

  deleteTermLoanKYCDetails(id: any) {
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.delete(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_KYC_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }

  getAllKYCTypes() {
    return this.commonHttpService.getAll(Configuration.LOANS + Configuration.DOC_TYPES + Configuration.GET_ALL);
  }

  getKycBytermAccId(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_KYC_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_TERM_LOAN_KYC_DETAILS_BY_APPLICATION_ID);
  }

}
