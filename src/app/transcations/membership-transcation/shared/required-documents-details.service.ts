import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
@Injectable({
  providedIn: 'root'
})
export class RequiredDocumentDetailsService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateRequiredDocumentsDetails(documentModel: any) {
    return this.commonHttpService.put(documentModel,Headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP+ ERP_TRANSACTION_CONSTANTS.REQUIRED_DOCUMENT_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addRequiredDocumentsDetails(documentModel: any) {
    return this.commonHttpService.post(documentModel,Headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP+ ERP_TRANSACTION_CONSTANTS.REQUIRED_DOCUMENT_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getRequiredDocumentsDetailsById(id: string) {
    let headers = new HttpHeaders({'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.REQUIRED_DOCUMENT_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllRequiredDocumentsDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.REQUIRED_DOCUMENT_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteRequiredDocumentsDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.REQUIRED_DOCUMENT_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getRequiredDocumentsDetailsByMemberIdAndPacsId(id: any, memberType: any) { 
    let headers = new HttpHeaders({'id': id+'', 'memberType': memberType+''})
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.REQUIRED_DOCUMENT_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_REQUIRED_DOCUMENTS_BY_MEMBERID_AND_MEMBER_TYPE);
  }
}
