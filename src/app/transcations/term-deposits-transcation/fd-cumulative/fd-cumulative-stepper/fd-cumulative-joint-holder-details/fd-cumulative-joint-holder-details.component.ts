import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { NewMembershipAdd } from '../new-membership-add/shared/new-membership-add.model';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { NewMembershipAddService } from '../new-membership-add/shared/new-membership-add.service';
import { FdCumulativeApplication } from '../fd-cumulative-application/shared/fd-cumulative-application.model';
import { FdCumulativeApplicationService } from '../fd-cumulative-application/shared/fd-cumulative-application.service';
import { FdCumulativeJointHolder } from './shared/fd-cumulative-joint-holder.model';
import { FdCumulativeJointHolderService } from './shared/fd-cumulative-joint-holder.service';

@Component({
  selector: 'app-fd-cumulative-joint-holder-details',
  templateUrl: './fd-cumulative-joint-holder-details.component.html',
  styleUrls: ['./fd-cumulative-joint-holder-details.component.css']
})
export class FdCumulativeJointHolderDetailsComponent implements OnInit {

  jointAccountForm: any;
  isMemberCreation: boolean = false;
  fdCummulativeAccId: any;
  membershipBasicDetail: NewMembershipAdd = new NewMembershipAdd();
  fdCumulativeApplicationModel: FdCumulativeApplication = new FdCumulativeApplication();
  fdCumulativeJointHolderModel: FdCumulativeJointHolder = new FdCumulativeJointHolder();
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

  constructor(
    private formBuilder: FormBuilder,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private membershipServiceService: NewMembershipAddService,
    private fdCumulativeApplicationService: FdCumulativeApplicationService,
    private commonFunctionsService: CommonFunctionsService,
    private fdCumulativeJointHolderService: FdCumulativeJointHolderService, private datePipe: DatePipe,
  ) {
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
        this.fdCummulativeAccId = Number(id);
        this.isEdit = true;
        this.getFdCummApplicationById(this.fdCummulativeAccId);
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
    this.fdCumulativeJointHolderModel.jointHolderList = this.jointHolderDetailsList;
    this.fdCumulativeApplicationService.changeData({
      formValid: !this.jointAccountForm.valid ? true : false,
      data: this.fdCumulativeJointHolderModel,
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

  getFdCummApplicationById(id: any) {
    this.fdCumulativeApplicationService.getFdCummApplicationById(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != undefined && this.responseModel.data != null && this.responseModel.data.length > 0) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.fdCumulativeApplicationModel = this.responseModel.data[0];
            if (this.fdCumulativeApplicationModel.fdCummulativeProductName != null && this.fdCumulativeApplicationModel.fdCummulativeProductName != undefined) {
              this.productName = this.fdCumulativeApplicationModel.fdCummulativeProductName;
            }
            if (this.fdCumulativeApplicationModel.accountTypeName != null && this.fdCumulativeApplicationModel.accountTypeName != undefined) {
              this.accountType = this.fdCumulativeApplicationModel.accountTypeName;
            }
            if (this.fdCumulativeApplicationModel.depositAmount != null && this.fdCumulativeApplicationModel.depositAmount != undefined) {
              this.depositAmount = this.fdCumulativeApplicationModel.depositAmount;
            }
            if (this.fdCumulativeApplicationModel.depositDate != null && this.fdCumulativeApplicationModel.depositDate != undefined) {
              this.depositDateVal = this.datePipe.transform(this.fdCumulativeApplicationModel.depositDate, this.orgnizationSetting.datePipe);
            }
            if (this.fdCumulativeApplicationModel.accountNumber != null && this.fdCumulativeApplicationModel.accountNumber != undefined) {
              this.accountNumber = this.fdCumulativeApplicationModel.accountNumber;
            }
            if (this.fdCumulativeApplicationModel.fdCummulativeJointAccHolderDetailsDTOList != null && this.fdCumulativeApplicationModel.fdCummulativeJointAccHolderDetailsDTOList != undefined) {
              this.jointHolderDetailsList = this.fdCumulativeApplicationModel.fdCummulativeJointAccHolderDetailsDTOList;
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
            // this.fdCumulativeJointHolderModel = this.responseModel.data[0];
            if (this.fdCummulativeAccId != null && this.fdCummulativeAccId != undefined) {
              this.responseModel.data[0].fdCummulativeAccId = this.fdCummulativeAccId;
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
