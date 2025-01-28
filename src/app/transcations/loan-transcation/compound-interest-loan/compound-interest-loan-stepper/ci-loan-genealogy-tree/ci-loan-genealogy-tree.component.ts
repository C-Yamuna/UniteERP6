import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../ci-membership-details/shared/membership-details.model';
import { CiLoanGenealogyTree } from './shared/ci-loan-genealogy-tree.model';
import { CiLoanApplicationService } from '../ci-product-details/shared/ci-loan-application.service';
import { CiLoanGenealogyTreeService } from './shared/ci-loan-genealogy-tree.service';
import { CiLoanApplication } from '../ci-product-details/shared/ci-loan-application.model';

@Component({
  selector: 'app-ci-loan-genealogy-tree',
  templateUrl: './ci-loan-genealogy-tree.component.html',
  styleUrls: ['./ci-loan-genealogy-tree.component.css']
})
export class CiLoanGenealogyTreeComponent {
  @ViewChild('genealogy', { static: false }) private genealogy!: Table;

  ciGenealogyTreeForm: FormGroup;
  ciLoanGenealogyTreeList: any[] = [];
  checked: boolean = false;
  responseModel!: Responsemodel;
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  relationshipTypesList: any[] = [];
  isMemberCreation: boolean = false;
  ciLoanApplicationId: any;
  isEdit: boolean = false;
  visible: boolean = false;
  isFormValid: Boolean = false;
  addButton: boolean = false;
  newRow: any;
  EditDeleteDisable: boolean = false;
  promoterColumns: any[] = [];
  genealogyTreeDetails: any[] = [];
  addButtonService: boolean = false;
  editDeleteDisable: boolean = false;

  productName:any;
  accountType:any;
  minBalence:any;
  accountOpeningDateVal:any;
  
  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication();
  ciLoanGenealogyTreeModel: CiLoanGenealogyTree = new CiLoanGenealogyTree();
  admissionNumber: any;

  constructor(private router: Router, 
    private formBuilder: FormBuilder,
    private translate: TranslateService, 
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, 
    private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private commonFunction: CommonFunctionsService,
    private activateRoute: ActivatedRoute,
    private ciLoanApplicationService: CiLoanApplicationService,
    private ciLoanGenealogyTreeService: CiLoanGenealogyTreeService
  ) {

    this.genealogyTreeDetails = [
      { field: 'name', header: 'NAME' },
      { field: 'relationWithApplicantName', header: 'RELATION WITH MEMBER' },
      // { field: 'remarks', header: 'REMARKS' },
      // { field: 'Action', header: 'ACTION' },
    ];

    this.ciGenealogyTreeForm = this.formBuilder.group({
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
        this.ciLoanApplicationId = Number(id);
        this.isEdit = true;
        this.getCiLoanGenealogyTreesById(this.ciLoanApplicationId);
        this.getCiLoanApplicationsById(this.ciLoanApplicationId);
        this.commonComponent.stopSpinner();
      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    });
    this.ciGenealogyTreeForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.ciGenealogyTreeForm.valid) {
        this.save();
      }
    });
  }

  save() {
    this.updateData();
  }

  updateData() {
    if (this.editDeleteDisable != null) {
      // this.saveAndNextDisable = this.editDeleteDisable;
    }
    this.ciLoanGenealogyTreeModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciLoanApplicationService.changeData({
      formValid: this.ciGenealogyTreeForm.valid  ,
      data: this.ciLoanGenealogyTreeModel,
      isDisable: (this.ciLoanGenealogyTreeList.length == 0 ),
      stepperIndex: 9,
    });
  }

  getAllRelationshipTypes() {
    this.ciLoanGenealogyTreeService.getAllRelationshipTypes().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.relationshipTypesList = this.responseModel.data;
            this.relationshipTypesList = this.responseModel.data.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
            // let relationshiptype = this.relationshipTypesList.find((data: any) => null != data && data.value == this.ciLoanGenealogyTreeModel.relationWithApplicant);
            // if (relationshiptype != null && undefined != relationshiptype)
            //   this.ciLoanGenealogyTreeModel.relationWithApplicantName = relationshiptype.label;
            for(let tree of this.ciLoanGenealogyTreeList){
              this.relationshipTypesList.filter((obj:any) =>(obj.value == tree.relationWithApplicant)).map((obj) => {
               if (obj.label != null) {
                 tree.relationWithApplicantName = obj.label;
               }
               return obj;
             });
           }
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

  getCiLoanGenealogyTreesById(ciLoanApplicationId: any) {
    this.commonFunctionsService
    this.ciLoanGenealogyTreeService.getCiGenealogyTreeDetailsByLoanApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciLoanGenealogyTreeList = this.responseModel.data;
            // if (this.ciLoanApplicationModel.ciLoanGenealogyTreeDTOList != null && this.ciLoanApplicationModel.ciLoanGenealogyTreeDTOList != undefined)
              // this.ciLoanGenealogyTreeList = this.ciLoanApplicationModel.ciLoanGenealogyTreeDTOList;
            for(let tree of this.ciLoanGenealogyTreeList){
               this.relationshipTypesList.filter((obj:any) =>(obj.value == tree.relationWithApplicant)).map((obj) => {
                if (obj.label != null) {
                  tree.relationWithApplicantName = obj.label;
                }
                return obj;
              });
            }
          }
        }
      }
      this.updateData();
    });
  }
  getCiLoanApplicationsById(ciLoanApplicationId: any) {
    this.commonFunctionsService
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.ciLoanApplicationModel = this.responseModel.data[0];
                this.admissionNumber = this.responseModel.data[0].admissionNo;
              }
            }
          }
        }
      }
    });
  }

  addService() {
    this.ciLoanGenealogyTreeModel = new CiLoanGenealogyTree();
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
    this.ciLoanGenealogyTreeModel = row;

    const relation = this.relationshipTypesList.find((item: { value: any; }) => item.value === row.relationWithApplicant);
      this.ciLoanGenealogyTreeModel.relationWithApplicantName = relation.label;

    this.ciLoanGenealogyTreeModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciLoanGenealogyTreeModel.status = applicationConstants.ACTIVE;
    if (row.id != null && row.id != undefined) {
      this.ciLoanGenealogyTreeService.updateCiLoanGenealogyTrees(this.ciLoanGenealogyTreeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciLoanGenealogyTreeModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                this.getCiLoanGenealogyTreesById(this.responseModel.data[0].siLoanApplicationId);
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
      this.ciLoanGenealogyTreeService.addCiLoanGenealogyTrees(this.ciLoanGenealogyTreeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciLoanGenealogyTreeModel = this.responseModel.data;
              this.addButtonService = false;
              if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
                this.getCiLoanGenealogyTreesById(this.responseModel.data[0].siLoanApplicationId);
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
    this.ciLoanGenealogyTreeList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCiLoanGenealogyTreesById(this.ciLoanApplicationId);
  }

  editService(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    // this.getAllRelationshipTypes();
    this.ciLoanGenealogyTreeService.getCiLoanGenealogyTreesById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciLoanGenealogyTreeModel = this.responseModel.data[0];
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
    this.ciLoanGenealogyTreeService.deleteCiLoanGenealogyTrees(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        // this.ciLoanGenealogyTreeList = this.responseModel.data;
        this.getCiLoanGenealogyTreesById(this.ciLoanApplicationId);
      }
    });
  }

  onChangeRelationTypeType(event: any) {
    
    if (event.value != null && event.value != undefined) {
      const relation = this.relationshipTypesList.find((item: { value: any; }) => item.value === event.value);
      this.ciLoanGenealogyTreeModel.relationWithApplicantName = relation.label;
      this.updateData();
    }
  }

}
