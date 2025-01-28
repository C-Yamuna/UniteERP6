import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class CiLoanGenealogyTreeService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateCiLoanGenealogyTrees(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_GENEALOGY_TREES + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addCiLoanGenealogyTrees(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_GENEALOGY_TREES + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getCiLoanGenealogyTreesById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_GENEALOGY_TREES + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllCiLoanGenealogyTrees(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_GENEALOGY_TREES + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteCiLoanGenealogyTrees(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_GENEALOGY_TREES + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getCiGenealogyTreeDetailsByLoanApplicationId(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_GENEALOGY_TREES + ERP_TRANSACTION_CONSTANTS.GET_CI_GENEALOGY_TREE_DETAILS_BY_LOAN_APPLICATION_ID);
  }

  getAllRelationshipTypes() {
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.RELATIONSHIP_TYPES + Configuration.GET_ALL);
  }
}
