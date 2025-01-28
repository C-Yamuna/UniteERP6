import { Component } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { TermLoanJointHolder } from './shared/term-loan-joint-holder.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermApplication } from '../term-loan-application-details/shared/term-application.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TermLoanJointHolderService } from './shared/term-loan-joint-holder.service';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { TermLoanNewMembershipService } from '../term-loan-new-membership/shared/term-loan-new-membership.service';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';

@Component({
  selector: 'app-term-loan-joint-account',
  templateUrl: './term-loan-joint-account.component.html',
  styleUrls: ['./term-loan-joint-account.component.css']
})
export class TermLoanJointAccountComponent {
  jointAccountForm: any;
  jointAccount: any;
  checked: any;
  isMemberCreation: boolean = false;
  termLoanApplicationId: any;

  termLoanApplicationModel: TermApplication = new TermApplication();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanJointHolderModel: TermLoanJointHolder = new TermLoanJointHolder();
  rowEdit: any;
  responseModel!: Responsemodel;
  applicationType: any;
  accountType: any;
  minBalence: any;
  accountOpeningDate: any;
  msgs: any[] = [];
  isEdit: boolean = false;
  admissionNumber: any;
  allFruits: any[] = [];
  selectedFruits: any[] = [];
  selectedAdmissionNumberList: string[] = [];
  previousAdmissionNumber: String[] = [];
  duplicateKhataPassbookFlag: boolean = false;
  gridListData: any[] = [];
  accountOpeningDateVal: any;
  orgnizationSetting: any;
  numberOfJointHolders: any;
  jointHolderDetailsList: any[] = [];
  admissionNumberList: any[] = [];
  productName: any;
  memberTypeName: any;
  membershipList: any;
  pacsId: any;
  branchId: any;
  accountNumber: any;
  tempJointHolderDetailsList: any[] = [];

  constructor(private router: Router, private formBuilder: FormBuilder,
    private termLoanJointHolderService: TermLoanJointHolderService,
    private termLoanApplicationsService: TermApplicationService,  private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService, private datePipe: DatePipe,
    private commonFunctionsService: CommonFunctionsService,  private membershipService: TermLoanNewMembershipService,) {

      this.jointAccountForm = this.formBuilder.group({
        admissionNumber: [''],
        noOfJointHolders: ['']
      });
    }
    ngOnInit(): void {
      this.pacsId = 1;
      this.branchId = 1;
      this.orgnizationSetting = this.commonComponent.orgnizationSettings();
      this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
  
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined) {
          this.commonComponent.startSpinner();
          let id = this.encryptDecryptService.decrypt(params['id']);
          this.termLoanApplicationId = Number(id);
          this.isEdit = true;
          this.getTermApplicationByTermAccId(this.termLoanApplicationId);
          this.commonComponent.stopSpinner();
        } else {
          this.isEdit = false;
          this.commonComponent.stopSpinner();
        }
      })
      this.updateData();
      this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
    }
  
    updateData() {
      this.termLoanJointHolderModel.jointHolderList = this.jointHolderDetailsList;
      this.termLoanApplicationsService.changeData({
        formValid: !this.jointAccountForm.valid ? true : false,
        data: this.termLoanJointHolderModel,
        isDisable: (!this.jointAccountForm.valid),
        stepperIndex: 4,
      });
    }
  
    save() {
      this.updateData();
    }
  
    onChange() {
      this.isMemberCreation = !this.isMemberCreation;
    }
  
    getTermApplicationByTermAccId(id: any) {
      this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != undefined && this.responseModel.data != null && this.responseModel.data.length > 0) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLoanApplicationModel = this.responseModel.data[0];
              if (this.termLoanApplicationModel.termProductName != null && this.termLoanApplicationModel.termProductName != undefined) {
                this.productName = this.termLoanApplicationModel.termProductName;
              }
              if (this.termLoanApplicationModel.accountTypeName != null && this.termLoanApplicationModel.accountTypeName != undefined) {
                this.accountType = this.termLoanApplicationModel.accountTypeName;
              }
              if (this.termLoanApplicationModel.accountTypeName != null && this.termLoanApplicationModel.accountTypeName != undefined) {
                this.applicationType = this.termLoanApplicationModel.accountTypeName;
              }
            
              if (this.termLoanApplicationModel.accountNumber != null && this.termLoanApplicationModel.accountNumber != undefined) {
                this.accountNumber = this.termLoanApplicationModel.accountNumber;
              }
              if (this.termLoanApplicationModel.termLoanCoApplicantDetailsDTOList != null) {
                this.jointHolderDetailsList = this.termLoanApplicationModel.termLoanCoApplicantDetailsDTOList;
                this.jointHolderDetailsList = this.jointHolderDetailsList.map((model) => {
                  if (model.admissionDate != null) {
                    model.admissionDateVal = this.datePipe.transform(model.admissionDate, this.orgnizationSetting.datePipe);
                  }
                  return model;
                });
                this.getJointAccontMemberDetails();
              }
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
      }, error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
    }
  
    getJointAccontMemberDetails() {
      if (this.jointHolderDetailsList != null && this.jointHolderDetailsList != undefined && this.jointHolderDetailsList.length > 0) {
        this.numberOfJointHolders = this.jointHolderDetailsList.length;
        this.selectedAdmissionNumberList = this.numberOfJointHolders.filter((obj: any) => obj != null).map((obj: { id: any; name: any; admissionNumber: any }) => {
          return {
            label: obj.admissionNumber
          };
        });
        this.updateData();
      }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }
  
    onSelectionChange(event: any) {
      this.numberOfJointHolders = 0;
      this.selectedAdmissionNumberList = [];
      if (null != event.value && undefined != event.value && event.value != "") {
        for (let admissionNumber of event.value) {
          let check = this.selectedAdmissionNumberList.push(admissionNumber);
          this.numberOfJointHolders = this.selectedAdmissionNumberList.length;
          this.getMembershipDetails(admissionNumber.label);
        }
      }
    }
  
    onClear(admissionNumber: any) {
      const index = this.admissionNumberList.indexOf(admissionNumber);
      if (index >= 0) {
        this.admissionNumberList.splice(index, 1);
        this.jointHolderDetailsList.push(this.responseModel.data);
        const existingIndex = this.jointHolderDetailsList.findIndex(
          promoter => promoter.admissionNumber === admissionNumber);
        this.jointHolderDetailsList[existingIndex] = null;
        this.updateData();
      }
    }
  
    getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
      this.membershipService.getAllTypeOfMemberDetailsListFromMemberModule(this.pacsId, this.branchId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.membershipList = this.responseModel.data;
              this.admissionNumberList = this.membershipList.filter((obj: any) => obj != null).map((relationType: { id: any; name: any; admissionNumber: any; memberTypeName: any }) => {
                return {
                  label: relationType.admissionNumber
                };
              });
            }
            else {
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
  
    getMembershipDetails(admisionNumber: any) {
      this.tempJointHolderDetailsList = this.jointHolderDetailsList;
      this.jointHolderDetailsList = [];
      this.membershipService.getMembershipBasicDetailsByAdmissionNumber(admisionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              if (this.responseModel.data[0].admissionDate != null && this.responseModel.data[0].admissionDate != undefined) {
                this.responseModel.data[0].admissionDateVal = this.datePipe.transform(this.responseModel.data[0].admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.termLoanApplicationId != null && this.termLoanApplicationId != undefined) {
                this.responseModel.data[0].termLoanApplicationId = this.termLoanApplicationId;
              }
              if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
                this.responseModel.data[0].accountNumber = this.accountNumber;
              }
              this.tempJointHolderDetailsList.push(this.responseModel.data[0]);
              this.jointHolderDetailsList = this.tempJointHolderDetailsList;
              this.updateData();
            }
            else {
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
}
