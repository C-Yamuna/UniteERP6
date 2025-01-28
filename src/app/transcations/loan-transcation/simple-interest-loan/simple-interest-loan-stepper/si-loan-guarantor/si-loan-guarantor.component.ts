import { SiLoanGuarantorDetailsService } from './../../../shared/si-loans/si-loan-guarantor-details.service';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicRequiredDetails, MemberGroupDetailsModel, MembershipInstitutionDetailsModel } from 'src/app/transcations/savings-bank-transcation/savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-basic-required-details';
import { SiLoanApplicationService } from '../../../shared/si-loans/si-loan-application.service';
import { SiLoanProductDefinition } from '../../../shared/si-loans/si-loan-product-definition.model';
import { SiLoanGuarantor } from '../../../shared/si-loans/si-loan-guarantor.model';
import { SiLoanApplication } from '../../../shared/si-loans/si-loan-application.model';
import { MembershipBasicDetailsService } from '../../../sao/sao-stepper/membership-basic-details/shared/membership-basic-details.service';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-si-loan-guarantor',
  templateUrl: './si-loan-guarantor.component.html',
  styleUrls: ['./si-loan-guarantor.component.css']
})
export class SiLoanGuarantorComponent {
  siLoanGuarantorForm: FormGroup;
  chargesDetailsForm: FormGroup;
  insurenceDetailsForm: FormGroup;
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
  admissionNumbersList: any[] = [];
  isMemberCreation: boolean = false;

  membershipBasicRequiredDetails: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
  siLoanProductDefinitionModel: SiLoanProductDefinition = new SiLoanProductDefinition();
  siLoanGuarantorModel: SiLoanGuarantor = new SiLoanGuarantor();

  memberTypeName: any;
  loanAccId: any;
  isEdit: boolean = false;
  admissionNumber: any;
  promoterDetails: any[] = [];
  institutionPromoter: any[] = [];
  visible: boolean = false;
  selectedList: any[] = [];
  selectedMembers: any[] = [];
  allTypesOfmembershipList: any;
  pacsId: any;
  branchId: any;
  guarantorDetailsList: any[] = [];
  selectedAdmissionNumberList: string[] = [];
  numberOfJointHolders: any;
  previousAdmissionNumber: String[] = [];
  duplicateKhataPassbookFlag: boolean = false;
  gridListData: any[] = [];
  accountOpeningDateVal: any;
  admissionNumberList: any[] = [];
  productName: any;
  membershipList: any;
  accountNumber: any;
  minBalence: any;
  accountType: any;
  tempGuarantorDetailsList: any[] = [];

  constructor(private formBuilder: FormBuilder,
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private siLoanApplicationService: SiLoanApplicationService,
    private activateRoute: ActivatedRoute, private siLoanGuarantorDetailsService: SiLoanGuarantorDetailsService,
    private membershipBasicDetailsService: MembershipBasicDetailsService,) {

    this.siLoanGuarantorForm = this.formBuilder.group({
      admissionNumber: [''],
      noOfJointHolders: ['']
    })
    this.chargesDetailsForm = this.formBuilder.group({

    })
    this.insurenceDetailsForm = this.formBuilder.group({

    })
  }

  ngOnInit(): void {
    this.pacsId = 1;
    this.branchId = 1;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.loanAccId = Number(id);
        this.isEdit = true;
        this.getSILoanGuarantorDetailsByApplicationId(this.loanAccId);
        this.commonComponent.stopSpinner();
      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    })
    this.updateData();
  }

  updateData() {
    this.siLoanGuarantorModel.siLoanApplicationId = this.loanAccId;
    this.siLoanGuarantorModel.siLoanGuarantorDetailsDTOList = this.selectedList;
    this.siLoanApplicationService.changeData({
      formValid: !this.siLoanGuarantorForm.valid ? true : false,
      data: this.siLoanGuarantorModel,
      isDisable: (!this.siLoanGuarantorForm.valid),
      stepperIndex: 6,
    });
  }
 

  onChange() {
    this.isMemberCreation = !this.isMemberCreation;
  }

  getJointHolderDetailsBySILoanId(id: any) {
    this.siLoanGuarantorDetailsService.getSILoanGuarantorDetailsByLoanAccId(id).subscribe((response: any) => {
      this.responseModel = response;
    });
  }

  getSILoanApplicationDetailsById(id: any) {
    this.siLoanApplicationService.getSILoanApplicationById(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != undefined && this.responseModel.data != null && this.responseModel.data.length > 0) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.siLoanApplicationModel = this.responseModel.data[0];
            if (this.siLoanApplicationModel.siLoanGuarantorDetailsDTOList != null) {
              this.guarantorDetailsList = this.siLoanApplicationModel.siLoanGuarantorDetailsDTOList;
              this.guarantorDetailsList = this.guarantorDetailsList.map((model) => {
                if (model.admissionDate != null) {
                  model.admissionDateVal = this.datePipe.transform(model.admissionDate, this.orgnizationSetting.datePipe);
                }
                return model;
              });
              this.getSILoanGuarantorDetailsByLoanAccId();
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

  getSILoanGuarantorDetailsByLoanAccId() {
    if (this.guarantorDetailsList != null && this.guarantorDetailsList != undefined && this.guarantorDetailsList.length > 0) {
      this.numberOfJointHolders = this.guarantorDetailsList.length;
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

  getMembershipDetails(admisionNumber: any) {
    this.tempGuarantorDetailsList = this.guarantorDetailsList;
    this.guarantorDetailsList = [];
    this.membershipBasicDetailsService.getMembershipBasicDetailsByAdmissionNumber(admisionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.loanAccId != null && this.loanAccId != undefined) {
              this.responseModel.data[0].siLoanApplicationId = this.loanAccId;
            }
            if (this.responseModel.data[0].admissionDate != null && this.responseModel.data[0].admissionDate != undefined) {
              this.responseModel.data[0].admissionDateVal = this.datePipe.transform(this.responseModel.data[0].admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
              this.responseModel.data[0].admissionNumber = this.responseModel.data[0].admissionNumber;
            }
            if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
              this.responseModel.data[0].accountNumber = this.responseModel.data[0].accountNumber;
            }
            this.tempGuarantorDetailsList.push(this.responseModel.data[0]);
            this.guarantorDetailsList = this.tempGuarantorDetailsList;
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
        this.updateData();
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


  // Method triggered on multiSelect change
  OnChangeAdmissionNumber(selectedAdmissionNumbers: any[]) {
    // Clear existing selected details
    this.selectedList = [];
    const newlySelectedIds = selectedAdmissionNumbers;
    this.selectedMembers = newlySelectedIds;
    this.siLoanGuarantorForm.get('admissionNumber')?.setValue(this.selectedMembers);
    // Loop through selected admission numbers
    selectedAdmissionNumbers.forEach(admissionNumber => {
      const selectedMember = this.allTypesOfmembershipList.find((item: any) => item.value === admissionNumber);
      if (selectedMember) {
        this.selectedList.push({
          admissionNumber: selectedMember.data.admissionNumber,
          name: selectedMember.data.name,
          memberTypeName: selectedMember.data.memberTypeName,
          admissionDate: selectedMember.data.admissionDate,
          aadharNumber: selectedMember.data.aadharNumber,
          panNumber: selectedMember.data.panNumber,
          siLoanApplicationId : this.loanAccId,
          status:applicationConstants.ACTIVE,
          mobileNumber: selectedMember.data.mobileNumber,
          emailId: selectedMember.data.emailId,
          // Add more fields as needed
        });
        this.updateData();
      }
      // console.log('Selected members:', selectedMember);
    });
  }

  onClear(admissionNumber: any) {
    const index = this.allTypesOfmembershipList.indexOf(admissionNumber);
    if (index >= 0) {
      this.allTypesOfmembershipList.splice(index, 1);
      this.selectedList.push(this.responseModel.data);
      const existingIndex = this.selectedList.findIndex(
        promoter => promoter.admissionNumber === admissionNumber);
      this.selectedList[existingIndex] = null;
      this.updateData();
    }
  }

  initializeFormWithadmissionNumber(admissionNumber: any[]) {
    this.selectedMembers = admissionNumber.filter((data: any) => data.status == applicationConstants.ACTIVE).map((collateral: any) => collateral.admissionNumber);
    this.siLoanGuarantorForm.get('admissionNumber')?.setValue(this.selectedMembers);
  }

  getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
    this.membershipBasicDetailsService.getAllTypeOfMemberDetailsListFromMemberModule(this.pacsId, this.branchId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data && this.responseModel.data.length > 0) {
            this.allTypesOfmembershipList = this.responseModel.data.filter((data: any) => data.memberTypeName == MemberShipTypesData.INDIVIDUAL).map((relationType: any) => {
              if (relationType.admissionDate != null && relationType.admissionDate != undefined) {
                relationType.admissionDateVal = this.datePipe.transform(relationType.admissionDate, this.orgnizationSetting.datePipe);
              }
              return {
                label: `${relationType.name} - ${relationType.admissionNumber} - ${relationType.memberTypeName}`,
                value: relationType.admissionNumber,
                data: relationType // Optional: Include entire data object for further details
              };
            });
          }
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

  getSILoanGuarantorDetailsByApplicationId(loanId: any) {
    this.siLoanGuarantorDetailsService.getSILoanGuarantorDetailsById(loanId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.selectedList = this.responseModel.data;
        this.initializeFormWithadmissionNumber(this.selectedList);
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

}