import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermLoanGenealogyTree } from './shared/term-loan-genealogy-tree.model';
import { Table } from 'primeng/table';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';
import { TermLoanGenealogyTreeService } from './shared/term-loan-genealogy-tree.service';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { TermApplication } from '../term-loan-application-details/shared/term-application.model';

@Component({
  selector: 'app-term-loan-genealogy-tree',
  templateUrl: './term-loan-genealogy-tree.component.html',
  styleUrls: ['./term-loan-genealogy-tree.component.css']
})
export class TermLoanGenealogyTreeComponent {
  termGenealogyTreeForm: FormGroup;
  termLoanGenealogyTreeList: any[] = [];

  carrats: any[] = [];
  gender: any[] | undefined;
  maritalstatus: any[] | undefined;
  checked: boolean = false;
  responseModel!: Responsemodel;
  productsList: any[] = [];
  operationTypesList: any[] = [];
  schemeTypesList: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  insuranceVendorDetailsList: any[] = [];
  occupationTypesList: any[] = [];
  gendersList: any[] = [];
  relationshipTypesList: any[] = [];
  accountOpeningDateVal: any;
  minBalence: any;
  accountType: any;
  productName: any;
  isMemberCreation: boolean = false;
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanGenealogyTreeModel: TermLoanGenealogyTree = new TermLoanGenealogyTree();
  termLoanApplicationModel: TermApplication = new TermApplication();
  memberTypeName: any;
  loanAccId: any;
  isEdit: boolean = false;
  admissionNumber: any;



  institutionPromoter: any[] = [];
  visible: boolean = false;
  isFormValid: Boolean = false;

  @ViewChild('genealogy', { static: false }) private genealogy!: Table;

  addButton: boolean = false;
  newRow: any;
  EditDeleteDisable: boolean = false;
  promoterColumns: any[] = [];

  collateralType: any;

  tempGeneaolgyTreeDetailsList: any[] = [];
  mainGeneaolgyTreeDetailsList: any[] = [];
  updatedGeneaolgyTreeDetailsList: any[] = [];

  genealogyTreeDetails: any[] = [];
  addButtonService: boolean = false;

  editDeleteDisable: boolean = false;

  constructor(private router: Router, private formBuilder: FormBuilder,
    private translate: TranslateService, private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private commonFunction: CommonFunctionsService,
    private activateRoute: ActivatedRoute,
    private termLoanApplicationsService: TermApplicationService,
    private termLoanGenealogyTreeService: TermLoanGenealogyTreeService,
  ) {

    this.genealogyTreeDetails = [
      { field: 'name', header: 'NAME' },
      { field: 'relationWithApplicant', header: 'RELATION WITH MEMBER' },
      // { field: 'remarks', header: 'REMARKS' },
      // { field: 'Action', header: 'ACTION' },
    ];

    this.termGenealogyTreeForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      relationWithApplicant: new FormControl(''),
      // remarks: new FormControl('')
    })
  }

  ngOnInit() {
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.getAllRelationshipTypes();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.loanAccId = Number(id);
        this.isEdit = true;
        this.getTermLoanGenealogyTreeById(this.loanAccId);
        this.commonComponent.stopSpinner();
      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    });

    this.termGenealogyTreeForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.termGenealogyTreeForm.valid) {
        this.save();
      }
    });
    this.getTermLoanApplicationDetailsById(this.loanAccId);
  }

  save() {
    this.updateData();
  }

  updateData() {
    // this.saveAndNextDisable = !this.serviceForm.valid;
    if (this.editDeleteDisable != null) {
      // this.saveAndNextDisable = this.editDeleteDisable;
    }
    this.termLoanGenealogyTreeModel.termLoanApplicationId = this.loanAccId;
    this.termLoanApplicationsService.changeData({
      formValid: this.termGenealogyTreeForm.valid,
      data: this.termLoanGenealogyTreeModel,
      isDisable: (!this.termGenealogyTreeForm.valid),
      stepperIndex: 9,
    });
  }

  getAllRelationshipTypes() {
    this.termLoanGenealogyTreeService.getAllRelationshipTypes().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.relationshipTypesList = this.responseModel.data;
            this.relationshipTypesList = this.responseModel.data.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
            let relationshiptype = this.relationshipTypesList.find((data: any) => null != data && data.value == this.termLoanGenealogyTreeModel.relationWithApplicant);
            if (relationshiptype != null && undefined != relationshiptype)
              this.termLoanGenealogyTreeModel.relationWithApplicantName = relationshiptype.label;
          } else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }
  getTermLoanApplicationDetailsById(id: any) {
    this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termLoanApplicationModel = this.responseModel.data[0];
        if(this.termLoanApplicationModel.admissionNo != null && this.termLoanApplicationModel.admissionNo != undefined)
          this.admissionNumber = this.termLoanApplicationModel.admissionNo;
      }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    });
  }
  getTermLoanGenealogyTreeById(loanAccId: any) {
    this.termLoanGenealogyTreeService.getTermLoanGenealogyTreeById(loanAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termLoanGenealogyTreeList = this.responseModel.data;
            this.updateData();
          }
        }
      }
    });
  }

  addService() {
    this.termLoanGenealogyTreeModel = new TermLoanGenealogyTree();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    /**
     * for update validation
     */
    this.updateData();
    this.genealogy._first = 0;
    this.genealogy.value.unshift({ relationWithApplicant: '' });
    this.genealogy.initRowEdit(this.genealogy.value[0]);
    this.getAllRelationshipTypes();
  }

  saveService(row: any) {
    
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termLoanGenealogyTreeModel = row;

    const relation = this.relationshipTypesList.find((item: { value: any; }) => item.value === row.relationWithApplicant);
      this.termLoanGenealogyTreeModel.relationWithApplicantName = relation.label;
    this.termLoanGenealogyTreeModel.termLoanApplicationId = this.loanAccId;
    this.termLoanGenealogyTreeModel.status = applicationConstants.ACTIVE;
    if (row.id != null && row.id != undefined) {
      this.termLoanGenealogyTreeService.updateTermLoanGenealogyTree(this.termLoanGenealogyTreeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLoanGenealogyTreeModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermLoanGenealogyTreeById(this.responseModel.data[0].termLoanApplicationId);
              }
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
    else {
      this.termLoanGenealogyTreeService.addTermLoanGenealogyTree(this.termLoanGenealogyTreeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLoanGenealogyTreeModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                this.getTermLoanGenealogyTreeById(this.responseModel.data[0].termLoanApplicationId);
              }
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }

  cancelService() {
    this.termLoanGenealogyTreeList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermLoanGenealogyTreeById(this.loanAccId);
  }

  editService(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    // this.getAllRelationshipTypes();
    this.termLoanGenealogyTreeService.getTermGenealogyTreeDetailsByLoanApplicationId(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termLoanGenealogyTreeModel = this.responseModel.data[0];
          }
        }
        else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  delete(row: any) {
    this.termLoanGenealogyTreeService.deleteTermLoanGenealogyTree(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termLoanGenealogyTreeList = this.responseModel.data;
        this.getTermLoanGenealogyTreeById(this.loanAccId);
      }
    });
  }

  onChangeRelationTypeType(event: any) {
    
    if (event.value != null && event.value != undefined) {
      const relation = this.relationshipTypesList.find((item: { value: any; }) => item.value === event.value);
      this.termLoanGenealogyTreeModel.relationWithApplicantName = relation.label;
      this.updateData();
    }
  }


}
