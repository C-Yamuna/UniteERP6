import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermLoanGuarantor } from './shared/term-loan-guarantor.model';
import { TermApplication, TermLoanProductDefinition } from '../term-loan-application-details/shared/term-application.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { TermLoanGuarantorService } from './shared/term-loan-guarantor.service';
import { TermLoanNewMembershipService } from '../term-loan-new-membership/shared/term-loan-new-membership.service';

@Component({
  selector: 'app-term-loans-loan-guarantor',
  templateUrl: './term-loans-loan-guarantor.component.html',
  styleUrls: ['./term-loans-loan-guarantor.component.css']
})
export class TermLoansLoanGuarantorComponent {
  termLoanGuarantorForm: FormGroup;
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
  termLoanApplicationModel: TermApplication = new TermApplication();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanProductDefinitionModel: TermLoanProductDefinition = new TermLoanProductDefinition();
  termLoanGuarantorModel: TermLoanGuarantor = new TermLoanGuarantor();

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
    private termLoanApplicationsService: TermApplicationService,
    private activateRoute: ActivatedRoute,  private termLoanGuarantorDetailsService: TermLoanGuarantorService,
    private membershipService: TermLoanNewMembershipService,) {

    this.termLoanGuarantorForm = this.formBuilder.group({
      admissionNo: [''],
      // noOfJointHolders: ['']
    })
  
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
        this.loanAccId = Number(id);
        this.isEdit = true;
        this.getTermApplicationByTermAccId(this.loanAccId);
        this.getTermApplicationDetailsByTermAccId(this.loanAccId);
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
    this.termLoanGuarantorModel.termLoanApplicationId = this.loanAccId;
    this.termLoanGuarantorModel.admissionNo = this.admissionNumber;
    this.termLoanGuarantorModel.termLoanGuarantorDetailsDTOList = this.selectedList;
    this.termLoanApplicationsService.changeData({
      // formValid: !this.termLoanGuarantorForm.valid ? true : false,
      data: this.termLoanGuarantorModel,
      // isDisable: (!this.termLoanGuarantorForm.valid),
      stepperIndex: 6,
    });
  }

  save() {
    this.updateData();
  }

  onChange() {
    this.isMemberCreation = !this.isMemberCreation;
  }

  getTermApplicationDetailsByTermAccId(id: any) {
    this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != undefined && this.responseModel.data != null && this.responseModel.data.length > 0) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termLoanApplicationModel = this.responseModel.data[0];
            
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
  
  getTermApplicationByTermAccId(loanId: any){
    this.termLoanGuarantorDetailsService.getTermLoanGuarantorDetailsList(loanId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termLoanApplicationModel = this.responseModel.data;
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
  initializeFormWithadmissionNumber(admissionNumber: any[]) {
    this.selectedMembers =admissionNumber.filter((data: any) => data.status == applicationConstants.ACTIVE).map((collateral: any) => collateral.admissionNo);
  
    this.termLoanGuarantorForm.get('admissionNo')?.setValue(this.selectedMembers);
  }
  getTermLoanGuarantorDetailsByLoanAccId() {
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

  
  // Method triggered on multiSelect change
  OnChangeAdmissionNumber(selectedAdmissionNumbers: any[]) {
    // Clear existing selected details
    this.selectedList = [];
    const newlySelectedIds = selectedAdmissionNumbers;
    this.selectedMembers = newlySelectedIds;
    this.termLoanGuarantorForm.get('admissionNo')?.setValue(this.selectedMembers);
    // Loop through selected admission numbers
    selectedAdmissionNumbers.forEach(admissionNumber => {
      const selectedMember = this.allTypesOfmembershipList.find((item: any) => item.value === admissionNumber);
      if (selectedMember) {
        this.selectedList.push({
          name: selectedMember.data.name,
          mobileNumber: selectedMember.data.mobileNumber,
          aadharNo: selectedMember.data.aadharNumber,
          email: selectedMember.data.emailId,
          termLoanApplicationId:this.loanAccId,
          status:applicationConstants.ACTIVE,
          admissionNo:selectedMember.data.admissionNumber,
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
   
  getAllTypeOfMembershipDetails (pacsId: any, branchId: any) {
    this.membershipService.getAllTypeOfMemberDetailsListFromMemberModule(this.pacsId, this.branchId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data && this.responseModel.data.length > 0) {
            this.allTypesOfmembershipList = this.responseModel.data.filter((data: any) => data.memberTypeName == "Individual").map((relationType: any) => {
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
 
}
