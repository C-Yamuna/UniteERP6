import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class TermLoanNomineeService {

  constructor(private commonHttpService:CommonHttpService) { }

  
  
  getNomineeFromMemberModuleByAdmissionNumber(admissionNumber: any){
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_NOMINEE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_NOMINEE_BY_ADMISSION_NUMBER);
  }

  getGardianFromMemberModuleByAdmissionNumber(admissionNumber: any){
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBER_GUARDIAN_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_GUARDAIN_BY_ADMISSION_NUMBER);
  }

  updateNomineeDetails(termloanModel:any){
    return this.commonHttpService.put(termloanModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_NOMINEE_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  addNomineeDetails(termloanModel:any){
    return this.commonHttpService.post(termloanModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_NOMINEE_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD);
  }

  addGuardinaDetails(termloanModel : any){
    return this.commonHttpService.post(termloanModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_MEMBER_GUARDIAN_DETAILS+ ERP_TRANSACTION_CONSTANTS.ADD);
  }

  updateGuardainDetails(termloanModel : any){
    return this.commonHttpService.put(termloanModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_MEMBER_GUARDIAN_DETAILS+ ERP_TRANSACTION_CONSTANTS.UPDATE);
  }
  getNomineeDetailsByTermAccId(id : any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_NOMINEE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_TERM_LOAN_NOMINEE_DETAILS_BY_APPLICATION_ID);
  }
  getguardianDetailsByTermAccId(id : any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_MEMBER_GUARDIAN_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_GUARDIAN_DETAILS_BY_TERM_LOAN_APPLICATION_ID);
  }
}
