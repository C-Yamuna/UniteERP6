import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class TermLoanCommunicationService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateTermLoanCommunication(object: any) {
    return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  addTermLoanCommunication(object: any) {
    return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.ADD);
  }

  getAllTermLoanCommunication() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getTermLoanCommunication(id: any) {
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.GET);
  }

  deleteTermLoanCommunication(id: any) {
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.delete(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.DELETE);
  }

  getTermLoanCommunicationDetailsByLoanAccId(id: any) {
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.GET_COMMUNICATION_DETAILS_BY_LOAN_APPLICATION_ID);
  }

  getAllStates() {
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.STATE + Configuration.GET_ALL);
  }

  getAllDisttricts() {
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.DISTRICT + Configuration.GET_ALL);
  }

  getAllMandals() {
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.SUB_DISTRICT + Configuration.GET_ALL);
  }

  getAllVillages() {
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.VILLAGES + Configuration.GET_ALL);
  }
  getstatesList(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.STATE + Configuration.GET_ALL);
  }
  
  getDistrictsByStateId(stateId: any) {
    let headers = new HttpHeaders({ 'stateId': stateId + '', })
    return this.commonHttpService.getById(headers, Configuration.COMMON_MASTER + Configuration.DISTRICT + Configuration.GET_DISTRICT_BY_STATE_ID);
  }

  getMandalsByDistrictId(districtId: any) {
    let headers = new HttpHeaders({ 'districtId': districtId + '', })
    return this.commonHttpService.getById(headers, Configuration.COMMON_MASTER + Configuration.SUB_DISTRICT + Configuration.GET_SUB_DISTRICTS_BY_DISTRICT_ID);
  }

  getvillagesByMandalId(subDistrictId: any) {
    let headers = new HttpHeaders({ 'subDistrictId': subDistrictId + '', })
    return this.commonHttpService.getById(headers, Configuration.COMMON_MASTER + Configuration.VILLAGES + Configuration.GET_VILLAGES_BY_SUB_DISTRICT_ID);
  }

  getCommunicationDetailsByMemberTypeAndAdmissionNumberAndMemberType(id: any, memberTypeId: any, admissionNumber: any) {
    let headers = new HttpHeaders({ 'id': id + '', 'memberTypeId': memberTypeId + '', 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.GET_BY_LOAN_ID_MEMBER_TYPE);
  }

  getCommunicationDetailsByAdmissionNumberAndMemberType(memberTypeId: any, admissionNumber: any) {
    let headers = new HttpHeaders({ 'memberTypeId': memberTypeId + '', 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.GET_COMMUNICATION_BY_APPLICATION_ID_AND_MEMBER_TYPE_AND_MEMBER_ID);
  }

  getCommunicationDetailsByAdmissionNumber(admissionNumber: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.GET_BY_LOAN_ID_MEMBER_TYPE_AND_ADMISSION_NUMMBER);
  }

  getDistrictsList(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.DISTRICT + Configuration.GET_ALL);
  }
  getMandalsList(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.SUB_DISTRICT + Configuration.GET_ALL);
  }
  getVillageList(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.VILLAGES + Configuration.GET_ALL);
  }
}
