import { Component } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { TermApplication, TermLoanInsuranceDetails, TermLoanInterestPolicy, TermLoanProductDefinition } from './shared/term-application.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { TermApplicationService } from './shared/term-application.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';

@Component({
  selector: 'app-term-loan-application-details',
  templateUrl: './term-loan-application-details.component.html',
  styleUrls: ['./term-loan-application-details.component.css']
})
export class TermLoanApplicationDetailsComponent {
  termLoanapplicationForm: FormGroup;
  chargesDetailsForm: FormGroup;
  insurenceDetailsForm: FormGroup;
  gender: any[] | undefined;
  maritalstatus: any[] | undefined;
  checked: boolean = false;
  responseModel!: Responsemodel;
  productsList: any[] = [];
  repaymentFrequencyList: any[] = [];
  loanPurposeList: any[] = [];
  operationTypesList: any[] = [];
  schemeTypesList: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  insuranceVendorDetailsList: any[] = [];
  occupationTypesList: any[] = [];
  gendersList: any[] = [];
  relationshipTypesList: any[] = [];
  isMemberCreation: boolean = false;
  termLoanApplicationModel: TermApplication = new TermApplication();
  termLoanProductDefinitionModel: TermLoanProductDefinition = new TermLoanProductDefinition();
  termLoanInterestPolicyModel: TermLoanInterestPolicy = new TermLoanInterestPolicy();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanInsuranceDetailsModel: TermLoanInsuranceDetails = new TermLoanInsuranceDetails();
  memberTypeName: any;
  loanAccId: any;
  isEdit: boolean = false;
  admissionNumber: any;
  promoterDetails: any[] = [];
  institutionPromoter: any[] = [];
  visible: boolean = false;
  applicationType: boolean = false;
  isIndividual: Boolean = false;
  isGroup: Boolean = false;
  productInfoFalg: boolean = false;
  isProductDisable: boolean = false;
  productDefinitionFlag: boolean = false;
  displayDialog: boolean = false;
  pacsId: any;

  constructor(private router: Router, private formBuilder: FormBuilder,
    private translate: TranslateService, private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
   private datePipe: DatePipe,
    private commonFunction: CommonFunctionsService,  private termLoanApplicationsService: TermApplicationService,
    private activateRoute: ActivatedRoute,  private fileUploadService: FileUploadService) {

      this.termLoanapplicationForm = this.formBuilder.group({
        termProductId: ['', [Validators.required]],
        accountNumber: [{ value: '', disabled: true }],
        roi: [{ value: '', disabled: true }],
        applicationDate: ['', [Validators.required]],
        penalRoi: [{ value: '', disabled: true }],
        iod: [{ value: '', disabled: true }],
        repaymentFrequency: ['', [Validators.required]],
        monthlyIncome: ['', [Validators.required]],
        purposeId: ['', [Validators.required]],
        requestedAmount: ['', [Validators.required]],
        sanctionAmount: ['', [Validators.required]],
        sanctionDate: ['', [Validators.required]],
        plannedDisbursements: ['', [Validators.required]],
        loanPeriod: ['', [Validators.required]],
        loanDueDate: ['', [Validators.required]],
        operationTypeId: ['', [Validators.required]],
      })
      this.chargesDetailsForm = this.formBuilder.group({
  
      })
      this.insurenceDetailsForm = this.formBuilder.group({
        vendorId: ['', [Validators.required]],
        policyName: ['', [Validators.required]],
        policyNumber: ['', [Validators.required]],
        sumInsured: ['', [Validators.required]],
        premium: ['', [Validators.required]],
        // insuranceType: ['', [Validators.required]],
      })
    }
    ngOnInit() {
      this.orgnizationSetting = this.commonComponent.orgnizationSettings();
      this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
      this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
      this.gender = [
        { status: 'Select', code: '0' },
        { status: 'Male', code: '1' },
        { status: 'Female', code: '2' },
      ];
      this.maritalstatus = [
        { status: 'Select', code: '0' },
        { status: 'Married', code: '1' },
        { status: 'UnMarried', code: '2' }
      ];
      this.getAllProducts();
      this.getAllRepaymentFrequency();
      this.getAllLoanPurpose();
      this.getAllAccountTypes();
      this.getAllInsuranceVendors();
      // this.getAllOccupationTypes();
      // this.getAllGenders();
      // this.getAllSchemeTypes();
  
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined) {
          this.commonComponent.startSpinner();
          let id = this.encryptDecryptService.decrypt(params['id']);
          this.loanAccId = Number(id);
          this.isEdit = true;
          this.getTermApplicationByTermAccId(this.loanAccId);
          this.commonComponent.stopSpinner();
        } else {
          this.isEdit = false;
          this.commonComponent.stopSpinner();
        }
      })
  
      this.termLoanapplicationForm.valueChanges.subscribe((data: any) => {
        this.updateData();
        // if (this.termLoanapplicationForm.valid) {
        //   this.save();
        // }
      });
      // this.termLoanApplicationModel.applicationDateVal = this.commonFunctionsService.currentDate();
    }
  
    save() {
      this.updateData();
    }
  
    updateData() {
      this.termLoanApplicationModel.termLoanInsuranceDetailsDTO = this.termLoanInsuranceDetailsModel;
      this.termLoanApplicationsService.changeData({
        formValid: !this.termLoanapplicationForm.valid ? true : false,
        data: this.termLoanApplicationModel,
        isDisable: (!this.termLoanapplicationForm.valid),
        stepperIndex: 3,
      });
    }
  
    getAllProducts() {
      this.commonComponent.startSpinner();
      this, this.termLoanApplicationsService.getActiveProductsBasedOnPacsId(this.pacsId).subscribe(response => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.productsList = this.responseModel.data;
          this.productsList = this.productsList.filter((product: { status: number; }) => product.status == 3).map((product: any) => {
            return { label: product.name, value: product.id };
          });
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })
    }
    getAllRepaymentFrequency() {
      this.commonComponent.startSpinner();
      this, this.termLoanApplicationsService.getAllRepaymentFrequency().subscribe(response => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.repaymentFrequencyList = this.responseModel.data.filter((repaymentFrequency: { status: number; }) => repaymentFrequency.status == 1).map((repaymentFrequency: any) => {
            return { label: repaymentFrequency.name, value: repaymentFrequency.id };
          });
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })
    }
  
    getAllLoanPurpose() {
      this.commonComponent.startSpinner();
      this, this.termLoanApplicationsService.getAllLoanPurpose().subscribe(response => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.loanPurposeList = this.responseModel.data.filter((loanPurpose: { status: number; }) => loanPurpose.status == 1).map((loanPurpose: any) => {
            return { label: loanPurpose.name, value: loanPurpose.id };
          });
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })
    }
  
    getAllAccountTypes() {
      this.termLoanApplicationsService.getAllAccountTypes().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.operationTypesList = this.responseModel.data;
              this.operationTypesList = this.operationTypesList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
                return { label: relationType.name, value: relationType.id };
  
              });
              this.operationTypesList.unshift({ label: 'select', value: 0 });
            }
          }
          if (this.termLoanApplicationModel.operationTypeId != undefined) {
            const filteredItem = this.operationTypesList.find((item: { value: any; }) => item.value === this.termLoanApplicationModel.operationTypeId);
            this.termLoanApplicationModel.operationTypeName = filteredItem.label;
          }
        }
      }, error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
    }
  
  
    getAllInsuranceVendors() {
      this.commonComponent.startSpinner();
      this, this.termLoanApplicationsService.getAllInsuranceVendors().subscribe(response => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.insuranceVendorDetailsList = this.responseModel.data.filter((insuranceVendor: { status: number; }) => insuranceVendor.status == 1).map((insuranceVendor: any) => {
            let newObj = { label: insuranceVendor.name, value: insuranceVendor.id };
            return newObj;
          });
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })
    }
  
    getAllOccupationTypes() {
      this.commonComponent.startSpinner();
      this, this.termLoanApplicationsService.getAllOccupationTypes().subscribe(response => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.occupationTypesList = this.responseModel.data.filter((occupationType: { status: number; }) => occupationType.status == 1).map((occupationType: any) => {
            let newObj = { status: occupationType.name, code: occupationType.id };
            return newObj;
          });
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })
    }
  
    getAllGenders() {
      this.commonComponent.startSpinner();
      this, this.termLoanApplicationsService.getAllGenders().subscribe(response => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.gendersList = this.responseModel.data.filter((gender: { status: number; }) => gender.status == 1).map((gender: any) => {
            let newObj = { status: gender.name, code: gender.id };
            return newObj;
          });
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })
    }
  
    getAllRelationShipTypes() {
      this.commonComponent.startSpinner();
      this, this.termLoanApplicationsService.getAllRelationTypes().subscribe(response => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.relationshipTypesList = this.responseModel.data.filter((relationShipType: { status: number; }) => relationShipType.status == 1).map((relationShipType: any) => {
            let newObj = { status: relationShipType.name, code: relationShipType.id };
            return newObj;
          });
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })
    }
  
    onChangeProduct(event: any) {
      this.displayDialog = true;
      this.productInfoFalg = true;
      if (event.value != null && event.value != undefined) {
        this.getProductDefinitionByProductIdAndApplicationDate(event.value);
      }
    }
  
    onChangeAccountType(event: any) {
      if (event.value != null && event.value != undefined) {
        const filteredItem = this.operationTypesList.find((item: { value: any; }) => item.value === event.value);
        this.termLoanApplicationModel.operationTypeName = filteredItem.label;
        this.updateData();
      }
    }
  
    onChangeRepayment(event: any) {
      //  if (event.value != null && event.value != undefined) {
      //   this.getProductDefinitionByProductId(event.value);
      // }
    }
  
    onChangePurpose(event: any) {
      //  if (event.value != null && event.value != undefined) {
      //   this.getProductDefinitionByProductId(event.value);
      // }
    }
  
    //get account details by admissionNumber list
    getTermApplicationByTermAccId(loanAccId: any) {
      this.termLoanApplicationsService.getTermApplicationByTermAccId(loanAccId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
  
              if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
                if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                  this.termLoanApplicationModel = this.responseModel.data[0];
                  if (this.termLoanApplicationModel.applicationDate == null || this.termLoanApplicationModel.applicationDate == undefined) {
                    this.termLoanApplicationModel.applicationDateVal = this.commonFunctionsService.currentDate();
  
                    if (this.termLoanApplicationModel.applicationDateVal != null && this.termLoanApplicationModel.applicationDateVal != undefined) {
                      this.termLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpochWithTimedateConversionToLong(this.termLoanApplicationModel.applicationDateVal);
                    }
                  }
                  else if (this.termLoanApplicationModel.applicationDate != null && this.termLoanApplicationModel.applicationDate != undefined) {
                    this.termLoanApplicationModel.applicationDateVal = this.commonFunctionsService.dateConvertionIntoFormate(this.termLoanApplicationModel.applicationDate);
                  }
                  if (this.termLoanApplicationModel.termProductId != null && this.termLoanApplicationModel.termProductId != undefined)
                    this.isProductDisable = applicationConstants.TRUE;
                  
                  if (this.termLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                    this.membershipBasicRequiredDetailsModel = this.termLoanApplicationModel.individualMemberDetailsDTO;
  
                    if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined)
                      this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
  
                    if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined)
                      this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
  
                    if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
                      this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
                    }
                    if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                      this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
                    }
                  }
                 
                  // if (this.termLoanApplicationModel.applicationDate != null && this.termLoanApplicationModel.applicationDate != undefined) {
                  //   this.termLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.termLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);
                  // }
                  
                  if (this.termLoanApplicationModel.sanctionDate != null && this.termLoanApplicationModel.sanctionDate != undefined) {
                    this.termLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.termLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);
                  }
                  if (this.termLoanApplicationModel.loanDueDate != null && this.termLoanApplicationModel.loanDueDate != undefined) {
                    this.termLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.termLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
                  }
                  if (this.termLoanApplicationModel.memberTypeName != null && this.termLoanApplicationModel.memberTypeName != undefined) {
                    this.memberTypeName = this.termLoanApplicationModel.memberTypeName;
                    if (this.termLoanApplicationModel.memberTypeName == "Individual")
                      this.isIndividual = true;
                  }
                  if (this.termLoanApplicationModel.admissionNo != null && this.termLoanApplicationModel.admissionNo != undefined) {
                    this.admissionNumber = this.termLoanApplicationModel.admissionNo;
                  }
                  if (this.termLoanApplicationModel.operationTypeName != null && this.termLoanApplicationModel.operationTypeName != undefined) {
                    this.applicationType = true;
                  }
  
                  if (this.termLoanApplicationModel.termProductName != null && this.termLoanApplicationModel.termProductName != undefined) {
                    this.productInfoFalg = true;
                  }
  
                  if (this.termLoanApplicationModel.termLoanInsuranceDetailsDTO != null && this.termLoanApplicationModel.termLoanInsuranceDetailsDTO != undefined) {
                    this.termLoanInsuranceDetailsModel = this.termLoanApplicationModel.termLoanInsuranceDetailsDTO;
                  }
  
                  if (this.termLoanApplicationModel.termProductId != undefined && this.termLoanApplicationModel.termProductId != null
                    && this.termLoanApplicationModel.applicationDate != null && this.termLoanApplicationModel.applicationDate != null)
                    this.getProductDefinitionByProductIdAndApplicationDate(this.termLoanApplicationModel.termProductId);
  
                  this.updateData();
                }
              }
            }
          }
        }
      });
    }
  
    getProductDefinitionByProductIdAndApplicationDate(productId: any) {
      this.termLoanApplicationsService.getPreviewDetailsByProductId(productId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              this.termLoanProductDefinitionModel = this.responseModel.data[0];
              if (this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != undefined && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != null) {
                this.termLoanInterestPolicyModel = this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0];
              }
            }
          }
        }
      });
    }
  
    onChange() {
      this.checked = !this.checked;
      if (this.checked) {
        this.isMemberCreation = true;
      }
      else {
        this.isMemberCreation = false;
      }
    }
  
    showDialog() {
      this.visible = true;
    }
  
    closeProductDefinition() {
      this.productDefinitionFlag = false;
    }
}
