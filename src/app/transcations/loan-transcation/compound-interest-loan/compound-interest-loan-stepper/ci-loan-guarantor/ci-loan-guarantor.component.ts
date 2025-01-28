import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../ci-membership-details/shared/membership-details.model';
import { CiLoanApplication } from '../ci-product-details/shared/ci-loan-application.model';
import { CiLoanGuarantor } from './shared/ci-loan-guarantor.model';
import { MembershipDetailsService } from '../ci-membership-details/shared/membership-details.service';
import { CiLoanApplicationService } from '../ci-product-details/shared/ci-loan-application.service';
import { CiLoanCoApplicantDetailsService } from '../ci-loan-co-applicant-details/shared/ci-loan-co-applicant-details.service';
import { CiLoanGuarantorService } from './shared/ci-loan-guarantor.service';

@Component({
  selector: 'app-ci-loan-guarantor',
  templateUrl: './ci-loan-guarantor.component.html',
  styleUrls: ['./ci-loan-guarantor.component.css']
})
export class CiLoanGuarantorComponent {
  guarantorForm: any;
  isMemberCreation: boolean = false;
  ciLoanApplicationId: any;

  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication;
  ciLoanGuarantorModel: CiLoanGuarantor = new CiLoanGuarantor();

  responseModel!: Responsemodel;
  applicationType: any;
  accountType: any;
  msgs: any[] = [];
  isEdit: boolean = false;
  admissionNumber: any;
  selectedAdmissionNumberList: any[] = [];
  accountOpeningDateVal: any;
  orgnizationSetting: any;
  numberOfJointHolders: any;
  ciGuarantorDetailsList: any[] = [];
  admissionNumberList: any[] = [];
  productName: any;
  memberTypeName: any;
  membershipList: any;
  pacsId: any;
  branchId: any;
  accountNumber: any;
  tempGuarantorDetailsList: any[] = [];

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private datePipe: DatePipe,
    private commonFunctionsService: CommonFunctionsService,
    private membershipDetailsService: MembershipDetailsService,
    private ciLoanApplicationService: CiLoanApplicationService,
    private ciLoanCoApplicantDetailsService: CiLoanCoApplicantDetailsService , private ciLoanGuarantorService : CiLoanGuarantorService) {

    this.guarantorForm = this.formBuilder.group({
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
        this.ciLoanApplicationId = Number(id);
        this.isEdit = true;
        this.getCiLoanApplicationsById(this.ciLoanApplicationId);
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
    this.ciLoanGuarantorModel.guarantorDetailsList = this.ciGuarantorDetailsList;
    this.ciLoanApplicationService.changeData({
      formValid: !this.guarantorForm.valid ? true : false,
      data: this.ciLoanGuarantorModel,
      isDisable: this.ciGuarantorDetailsList.length == 0 || (!this.guarantorForm.valid),
      stepperIndex: 6,
    });
  }

  save() {
    this.updateData();
  }

  onChange() {
    this.isMemberCreation = !this.isMemberCreation;
  }

  getCiLoanApplicationsById(id: any) {
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != undefined && this.responseModel.data != null && this.responseModel.data.length > 0) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciLoanApplicationModel = this.responseModel.data[0];
            if (this.ciLoanApplicationModel.ciProductName != null && this.ciLoanApplicationModel.ciProductName != undefined) {
              this.productName = this.ciLoanApplicationModel.ciProductName;
            }
            if (this.ciLoanApplicationModel.operationTypeName != null && this.ciLoanApplicationModel.operationTypeName != undefined) {
              this.accountType = this.ciLoanApplicationModel.operationTypeName;
            }
            if (this.ciLoanApplicationModel.accountNumber != null && this.ciLoanApplicationModel.accountNumber != undefined) {
              this.accountNumber = this.ciLoanApplicationModel.accountNumber;
            }
            if (this.ciLoanApplicationModel.ciLoanGuarantorDetailsDTOList != null) {
              this.ciGuarantorDetailsList = this.ciLoanApplicationModel.ciLoanGuarantorDetailsDTOList;
              this.ciGuarantorDetailsList = this.ciGuarantorDetailsList.map((model) => {
                if (model.admissionDate != null) {
                  model.admissionDateVal = this.datePipe.transform(model.admissionDate, this.orgnizationSetting.datePipe);
                }
                return model;
              });
              this.getGuarantorAccontMemberDetails(this.ciLoanApplicationModel.id);
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

  getGuarantorAccontMemberDetails(id: any) {
    this.ciLoanGuarantorService.getCiLoanGuarantorDetailsByLoanApplicationId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined && this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.ciGuarantorDetailsList = this.responseModel.data;
          if (this.ciGuarantorDetailsList != null && this.ciGuarantorDetailsList != undefined && this.ciGuarantorDetailsList.length > 0) {
            this.numberOfJointHolders = this.ciGuarantorDetailsList.length;
            this.admissionNumberList 
            this.selectedAdmissionNumberList = this.ciGuarantorDetailsList.filter((obj: any) => obj != null).map((obj: { id: any; name: any; admissionNumber: any }) => {
              return {
                label: obj.admissionNumber
              };
            });
            this.updateData();
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
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
    // if (this.ciGuarantorDetailsList != null && this.ciGuarantorDetailsList != undefined && this.ciGuarantorDetailsList.length > 0) {
    //   this.numberOfJointHolders = this.ciGuarantorDetailsList.length;
    //   this.selectedAdmissionNumberList = this.ciGuarantorDetailsList.filter((obj: any) => obj != null).map((obj: { id: any; name: any; admissionNumber: any }) => {
    //     return {
    //       label: obj.admissionNumber
    //     };
    //   });
    //   this.updateData();
    // }
    // else {
    //   this.msgs = [];
    //   this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
    //   setTimeout(() => {
    //     this.msgs = [];
    //   }, 2000);
    // }
  }

  onSelectionChange(event: any) {
    this.tempGuarantorDetailsList = [];
    this.numberOfJointHolders = 0;
    this.ciGuarantorDetailsList = [];
    this.selectedAdmissionNumberList = [];
    if (null != event.value && undefined != event.value && event.value != "") {
      for (let admissionNumber of event.value) {
        let check = this.selectedAdmissionNumberList.push(admissionNumber);
        this.numberOfJointHolders = this.selectedAdmissionNumberList.length;
        this.getMembershipDetails(admissionNumber.label);
      }
    }
    else{
      this.ciGuarantorDetailsList = [];
    }
  }

  onClear(admissionNumber: any) {
    // const index = this.admissionNumberList.indexOf(admissionNumber);
    // if (index >= 0) {
    //   this.admissionNumberList.splice(index, 1);
    //   this.ciGuarantorDetailsList.push(this.responseModel.data);
    //   const existingIndex = this.ciGuarantorDetailsList.findIndex(
    //     promoter => promoter.admissionNumber === admissionNumber);
    //   this.ciGuarantorDetailsList[existingIndex] = null;
    this.ciGuarantorDetailsList = [];
    this.updateData();
    // }
  }

  getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
    this.membershipDetailsService.getAllTypeOfMemberDetailsListFromMemberModule(pacsId, branchId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipList = this.responseModel.data;
            this.admissionNumberList = this.membershipList.filter((obj: any) => obj != null && obj.memberTypeId == applicationConstants.ACTIVE).map((relationType: { id: any; name: any; admissionNumber: any; memberTypeName: any }) => {
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

  getMembershipDetails(admissionNumber: any) {
    this.tempGuarantorDetailsList = this.ciGuarantorDetailsList;
    this.ciGuarantorDetailsList = [];
    this.membershipDetailsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.data[0].admissionDate != null && this.responseModel.data[0].admissionDate != undefined) {
              this.responseModel.data[0].admissionDateVal = this.datePipe.transform(this.responseModel.data[0].admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.ciLoanApplicationId != null && this.ciLoanApplicationId != undefined) {
              this.responseModel.data[0].ciLoanApplicationId = this.ciLoanApplicationId;
            }
            if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
              this.responseModel.data[0].accountNumber = this.accountNumber;
            }
            this.tempGuarantorDetailsList.push(this.responseModel.data[0]);
            this.ciGuarantorDetailsList = this.tempGuarantorDetailsList;
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
