import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { RdAccountsService } from '../../../shared/rd-accounts.service';
import { TranslateService } from '@ngx-translate/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from '../../../shared/membership-basic-detail.model';
import { RdAccountsModel, RdJointHolder } from '../../../shared/term-depost-model.model';
import { MembershipServiceService } from 'src/app/transcations/savings-bank-transcation/savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-service.service';
import { RdJointAccountHolderDetailsService } from '../../../shared/rd-joint-account-holder-details.service';

@Component({
  selector: 'app-recurring-deposit-joint-holder-details',
  templateUrl: './recurring-deposit-joint-holder-details.component.html',
  styleUrls: ['./recurring-deposit-joint-holder-details.component.css']
})
export class RecurringDepositJointHolderDetailsComponent implements OnInit {

  jointAccountForm: any;
  isMemberCreation: boolean = false;
  rdAccId: any;
  rdAccountModel: RdAccountsModel = new RdAccountsModel();
  membershipBasicDetail: MembershipBasicDetail = new MembershipBasicDetail();
  rdJointHolderModel: RdJointHolder = new RdJointHolder();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  responseModel!: Responsemodel;
  accountType: any;
  depositAmount: any;
  msgs: any[] = [];
  isEdit: boolean = false;
  admissionNumber: any;
  selectedAdmissionNumberList: any[] = [];
  depositDateVal: any;
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

  constructor(private router: Router, private formBuilder: FormBuilder, private rdJointAccountHolderDetailsService: RdJointAccountHolderDetailsService,
    private rdAccountsService: RdAccountsService, private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService, private datePipe: DatePipe,
    private commonFunctionsService: CommonFunctionsService, private membershipServiceService: MembershipServiceService) {

    this.jointAccountForm = this.formBuilder.group({
      admissionNumber: [''],
      noOfJointHolders: ['']
    });
  }

  ngOnInit(): void {
    this.pacsId = 1;
    this.branchId = 1;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isMemberCreation = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.rdAccId = Number(id);
        this.isEdit = true;
        this.getRdAccounts(this.rdAccId);
        this.commonComponent.stopSpinner();
      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    })
    this.updateData();
    this.jointAccountForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.jointAccountForm.valid) {
        this.save();
      }
    });
  }
  updateData() {
    this.rdJointHolderModel.jointHolderList = this.jointHolderDetailsList;
    this.rdAccountsService.changeData({
      formValid: !this.jointAccountForm.valid ? true : false,
      data: this.rdJointHolderModel,
      isDisable: (!this.jointAccountForm.valid),
      // isDisable:false,
      stepperIndex: 4,
    });
  }

  save() {
    this.updateData();
  }

  onChange() {
    this.isMemberCreation = !this.isMemberCreation;
  }

  getRdAccounts(id: any) {
    this.rdAccountsService.getRdAccounts(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != undefined && this.responseModel.data != null && this.responseModel.data.length > 0) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.rdAccountModel = this.responseModel.data[0];
            if (this.rdAccountModel.rdProductName != null && this.rdAccountModel.rdProductName != undefined) {
              this.productName = this.rdAccountModel.rdProductName;
            }
            if (this.rdAccountModel.accountTypeName != null && this.rdAccountModel.accountTypeName != undefined) {
              this.accountType = this.rdAccountModel.accountTypeName;
            }
            if (this.rdAccountModel.depositAmount != null && this.rdAccountModel.depositAmount != undefined) {
              this.depositAmount = this.rdAccountModel.depositAmount;
            }
            if (this.rdAccountModel.depositDate != null && this.rdAccountModel.depositDate != undefined) {
              this.depositDateVal = this.datePipe.transform(this.rdAccountModel.depositDate, this.orgnizationSetting.datePipe);
            }
            if (this.rdAccountModel.accountNumber != null && this.rdAccountModel.accountNumber != undefined) {
              this.accountNumber = this.rdAccountModel.accountNumber;
            }
            if (this.rdAccountModel.tdJointAccHolderDetailsDTOList != null && this.rdAccountModel.tdJointAccHolderDetailsDTOList != undefined) {
              this.jointHolderDetailsList = this.rdAccountModel.tdJointAccHolderDetailsDTOList;
              if (this.jointHolderDetailsList != null && this.jointHolderDetailsList != undefined && this.jointHolderDetailsList.length > 0) {
                this.numberOfJointHolders = this.jointHolderDetailsList.length;
                this.selectedAdmissionNumberList = this.jointHolderDetailsList.filter((obj: any) => obj != null).map((obj: { id: any; name: any; admissionNumber: any }) => {
                  return {
                    label: obj.admissionNumber
                  };
                });
                this.jointHolderDetailsList.map((joint: any) => {
                  joint.admissionDateVal = this.datePipe.transform(joint.admissionDate, this.orgnizationSetting.datePipe);
                });
                this.updateData();
              }
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

  onSelectionChange(event: any) {
    this.tempJointHolderDetailsList = [];
    this.numberOfJointHolders = 0;
    this.selectedAdmissionNumberList = [];
    if (null != event.value && undefined != event.value && event.value != "") {
      for (let admissionNumber of event.value) {
        let check = this.selectedAdmissionNumberList.push(admissionNumber);
        this.numberOfJointHolders = this.selectedAdmissionNumberList.length;
        this.getMembershipDetails(admissionNumber.label);
      }
    }
    else {
      this.jointHolderDetailsList = [];
    }
  }

  onClear(admissionNumber: any) {
    // const index = this.admissionNumberList.indexOf(admissionNumber);
    // if (index >= 0) {
    //   this.admissionNumberList.splice(index, 1);
    //   this.jointHolderDetailsList.push(this.responseModel.data);
    //   const existingIndex = this.jointHolderDetailsList.findIndex(
    //     promoter => promoter.admissionNumber === admissionNumber);
    //   this.jointHolderDetailsList[existingIndex] = null;
    this.jointHolderDetailsList = [];
    this.updateData();
    // }
  }

  getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
    this.membershipServiceService.getAllTypeOfMemberDetailsListFromMemberModule(this.pacsId, this.branchId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipList = this.responseModel.data;
            this.admissionNumberList = this.membershipList.filter((obj: any) => obj != null && obj.memberTypeId == 1).map((relationType: { id: any; name: any; admissionNumber: any; memberTypeName: any }) => {
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
    this.jointHolderDetailsList = [];
    this.membershipServiceService.getMembershipBasicDetailsByAdmissionNumber(admisionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            // this.rdJointHolderModel = this.responseModel.data[0];
            if (this.rdAccId != null && this.rdAccId != undefined) {
              this.responseModel.data[0].rdAccId = this.rdAccId;
            }
            if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
              this.responseModel.data[0].accountNumber = this.accountNumber;
            }
            this.responseModel.data[0].dateOfBirth = this.responseModel.data[0].dob;
            this.responseModel.data[0].gender = this.responseModel.data[0].genderId;
            this.responseModel.data[0].maritalStatus = this.responseModel.data[0].martialId;
            this.responseModel.data[0].email = this.responseModel.data[0].emailId;
            this.responseModel.data[0].memberClass = this.responseModel.data[0].subProductName;
            this.responseModel.data[0].admissionDateVal = this.datePipe.transform(this.responseModel.data[0].admissionDate, this.orgnizationSetting.datePipe);
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
