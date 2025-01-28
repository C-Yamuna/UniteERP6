import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
export type stepperDataModel = {
  formValid?: boolean,
  stepperIndex?: number;
  data?: any;
  method?:any;
  url?: string;
  isObjChanged?:boolean;
  isDisable?:boolean;

} | null;
@Injectable({
  providedIn: 'root'
})
export class TermApplicationService {

  private organizationDetailsStepper = new BehaviorSubject<stepperDataModel>(null);
  public currentStep = this.organizationDetailsStepper.asObservable();

  constructor(private commonHttpService:CommonHttpService, private commonFunctionService: CommonFunctionsService) { }
  changeData(data: stepperDataModel) {
    this.organizationDetailsStepper.next(data)
  }
  public resetCurrentStep() {
    this.organizationDetailsStepper.next(null); // or initial value
  }

  getTermApplicationById(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_APPLICATIONS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getTermApplicationByTermAccId(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_APPLICATIONS + ERP_TRANSACTION_CONSTANTS.GET_TERM_LOAN_APPLICATION_DETAILS_BY_ID);
  }


  getAllRelationTypes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.RELATIONSHIP_TYPES + Configuration.GET_ALL);
  }

  getAllOccupationTypes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.OCCUPATION_TYPES + Configuration.GET_ALL);
  }

getQualificationTypes(){
  return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.QUALIFICATION + Configuration.GET_ALL);
}

getCastes(){
  return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.CASTE + Configuration.GET_ALL);
}

getAllOperationTypes(){
  return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.OPERATION_TYPES + Configuration.GET_ALL);
}

updateTermApplication(object:any){
  return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_APPLICATIONS + ERP_TRANSACTION_CONSTANTS.UPDATE);
}

addTermApplication(object:any){
  return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_APPLICATIONS+ ERP_TRANSACTION_CONSTANTS.ADD);
}

getAllTermTransactionDetails() {
  return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_APPLICATIONS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
}
getAllProductDefinitionList(){
  return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_PRODUCT_DEFINITIONS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
}
getTermByBranchIdPacsId(branchId: any,pacsId:any) {
  let headers = new HttpHeaders({ 'branchId': branchId + '','pacsId':pacsId +''})
  return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_LOAN_APPLICATIONS + ERP_TRANSACTION_CONSTANTS.GET_TERM_LOAN_APPLICATIONS_BY_PACSID_AND_BRANCHID)
}

getProduct(id: any){
  let headers = new HttpHeaders({ 'pacsId': id + '', })
  return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_PRODUCT_DEFINITIONS + ERP_TRANSACTION_CONSTANTS.GET_ACTIVE_PRODUCTS_BASED_ON_PACSID);
}

getAllProducts() {
  return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_PRODUCT_DEFINITIONS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
}

getActiveProductsBasedOnPacsId(pacsId: string){
  let headers = new HttpHeaders({ 'pacsId': pacsId + '' })
  return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_PRODUCT_DEFINITIONS + ERP_TRANSACTION_CONSTANTS.GET_ACTIVE_PRODUCTS_BASED_ON_PACSID);
}
getProductById(id: any) {
  let headers = new HttpHeaders({ 'id': id + '', })
  return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_INTEREST_POLICY_CONFIGS + ERP_TRANSACTION_CONSTANTS.GET);
}
getMemberByAdmissionNumber(admissionNumber:any){
  let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', })
  return this.commonHttpService.getById(headers , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.INDIVIDUAL_MEMBER_DETAILS+ ERP_TRANSACTION_CONSTANTS.GET_MEMBER_DETAILS_BY_ADMISSION_NUMBER);
}
getGroupByAdmissionNumber(admissionNumber:any){
  let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', })
  return this.commonHttpService.getById(headers , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_GROUP_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_DETAILS_BY_ADMISSION_NUMBER);
}

getInstitutionDetails(admissionNumber:any ){
  let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + ''})
  return this.commonHttpService.getById(headers , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.MEM_INSTITUTIONS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_DETAILS_BY_ADMISSION_NUMBER);
}
getAllRepaymentFrequency() {
  return this.commonHttpService.getAll(Configuration.LOANS + Configuration.REPAYMENT_FREQUENCY + Configuration.GET_ALL);
}
getAllLoanPurpose() {
  return this.commonHttpService.getAll(Configuration.LOANS + Configuration.LOAN_PURPOSE + Configuration.GET_ALL);
}

getAllAccountTypes() {
  return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.ACCOUNTS_TYPES + ERP_TRANSACTION_CONSTANTS.GET_ALL);
}
getAllGenders() {
  return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.COMMON_MASTER + Configuration.GENDER + ERP_TRANSACTION_CONSTANTS.GET_ALL);
}
getAllInsuranceVendors() {
  return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.INSURANCE_VENDOR_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
}
getPreviewDetailsByProductId(id: string) {
  let headers = new HttpHeaders({ 'id': id + '' })
  return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_PRODUCT_DEFINITIONS + ERP_TRANSACTION_CONSTANTS.GET_TERM_PRODUCT_DEFINITION_PREVIEW_BY_PRODUCT_ID);
}
getTermProductDefinitionByProductIdAndApplicationDate(productId: any, applicationDate: any) {
  let headers = new HttpHeaders({ 'productId': productId + '', 'applicationDate': applicationDate + '' })
  return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_PRODUCT_DEFINITIONS + ERP_TRANSACTION_CONSTANTS.GET_PRODUCT_DETAILS_BY_PRODUCT_ID_AND_APPLICATION_DATE);
}
getAllCommunityTypes() {
  return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.COMMUNITY + Configuration.GET_ALL);
}
submitTermApplicationForApproval(loansModel: any){
  return this.commonHttpService.put(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_APPLICATION+ERP_TRANSACTION_CONSTANTS.SUBMIT_FOR_APPROVAL);
}
downloadPDf(id:any){
  let status = this.commonFunctionService.getStorageValue('language');
  let url = ERP_TRANSACTION_CONSTANTS.LOANS+ERP_TRANSACTION_CONSTANTS.TERM_LOAN_APPLICATIONS+ERP_TRANSACTION_CONSTANTS.TERM_LOAN_APPLICATION_PDF_DOWNLOAD+"/"+id + "/"+status;
  const headers = new HttpHeaders({});
   return this.commonHttpService.generateAssetSheet(headers,url);
 }
}
