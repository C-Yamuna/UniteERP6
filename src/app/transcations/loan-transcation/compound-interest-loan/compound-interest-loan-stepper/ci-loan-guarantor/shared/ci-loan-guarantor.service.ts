import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { Loantransactionconstant } from 'src/app/transcations/loan-transcation/loan-transaction-constant';

@Injectable({
  providedIn: 'root'
})
export class CiLoanGuarantorService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateCiLoanGuarantorDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_GUARANTOR_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addCiLoanGuarantorDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_GUARANTOR_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getCiLoanGuarantorDetailsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_GUARANTOR_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllCiLoanGuarantorDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_GUARANTOR_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteCiLoanGuarantorDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_GUARANTOR_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  saveGuarantorList(jointHolderList: any) {
    let headers = new HttpHeaders({})
    return this.commonHttpService.post(jointHolderList, headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_GUARANTOR_DETAILS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_SAVE_GUARANTOR_LIST);
  }
  getCiLoanGuarantorDetailsByLoanApplicationId(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_GUARANTOR_DETAILS + Loantransactionconstant.COMPOUND_INTEREST_GUARENTOR_DETAILS_APPLICATION_ID);
  }
}
