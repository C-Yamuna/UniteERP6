import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../ci-membership-details/shared/membership-details.model';
import { CiLoanApplication, CiLoanInsuranceDetails } from './shared/ci-loan-application.model';
import { CompoundInterestProductDefinition } from '../../compound-interest-product-definition/shared/compound-interest-product-definition.model';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { CiInterestPolicy } from '../../compound-interest-product-definition/compound-interest-product-definition-stepper/ci-interest-policy/shared/ci-interest-policy.model';
import { CiLoanApplicationService } from './shared/ci-loan-application.service';
import { CompoundInterestProductDefinitionService } from '../../compound-interest-product-definition/shared/compound-interest-product-definition.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';

@Component({
  selector: 'app-ci-product-details',
  templateUrl: './ci-product-details.component.html',
  styleUrls: ['./ci-product-details.component.css']
})
export class CiProductDetailsComponent {
  ciLoanApplicationForm: FormGroup;
  insuranceForm: FormGroup;
  checked: boolean = false;
  responseModel!: Responsemodel;
  productsList: any[] = [];
  repaymentFrequencyList: any[] = [];
  loanPurposeList: any[] = [];
  operationTypesList: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  insuranceVendorDetailsList: any[] = [];
  occupationTypesList: any[] = [];
  gendersList: any[] = [];
  isMemberCreation: boolean = false;
  memberTypeName: any;
  ciLoanApplicationId: any;
  isEdit: boolean = false;
  admissionNumber: any;
  promoterDetails: any[] = [];
  institutionPromoter: any[] = [];
  visible: boolean = false;
  applicationType: boolean = false;
  isIndividual: Boolean = false;
  productInfoFalg: boolean = false;
  isProductDisable: boolean = false;
  productDefinitionFlag: boolean = false;

  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication;
  ciProductDefinitionModel: CompoundInterestProductDefinition = new CompoundInterestProductDefinition();
  ciLoanInsuranceDetailsModel: CiLoanInsuranceDetails = new CiLoanInsuranceDetails();
  ciLoanInterestPolicyModel: CiInterestPolicy = new CiInterestPolicy();
  displayDialog: boolean = false;
  interestConfigList: any[]=[];
  

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService,
    private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private activateRoute: ActivatedRoute,
    private ciLoanApplicationService: CiLoanApplicationService,
    private ciProductDefinitionService: CompoundInterestProductDefinitionService) {

    this.ciLoanApplicationForm = this.formBuilder.group({
      ciProductId: ['', [Validators.required]],
      accountNumber: [{ value: '', disabled: true }],
      applicationDate: ['', [Validators.required]],
      operationTypeId: ['', ],
      effectiveRoi: [{ value: '', disabled: true }],
      penalRoi: [{ value: '', disabled: true }],
      iod: [{ value: '', disabled: true }],
      repaymentFrequency: ['', [Validators.required]],
      monthlyIncome: ['', [Validators.pattern(applicationConstants.NEW_AMOUNT_PATTERN), Validators.compose([Validators.required])]],
      purposeId:['', [Validators.required]],
      requestedAmount:  ['', [Validators.pattern(applicationConstants.NEW_AMOUNT_PATTERN), Validators.compose([Validators.required])]],
      sanctionAmount:  ['', [Validators.pattern(applicationConstants.NEW_AMOUNT_PATTERN), Validators.compose([Validators.required])]],
      sanctionDate:['', [Validators.required]],
      plannedDisbursements:  ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
      loanPeriod:  ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
      loanDueDate: ['', [Validators.required]],
    })

    this.insuranceForm = this.formBuilder.group({
      vendorId: ['', [Validators.required]],
      policyName: ['', [Validators.pattern(applicationConstants.NAME_PATTERN), Validators.compose([Validators.required])]],
      policyNumber: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
      sumInsured:['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
      premium: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
    })
  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.getAllProducts();
    this.getAllRepaymentFrequency();
    this.getAllLoanPurpose();
    this.getAllAccountTypes();
    this.getAllInsuranceVendors();

    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.ciLoanApplicationId = Number(id);
        this.isEdit = true;
        this.getCiLoanApplicationById(this.ciLoanApplicationId);
        this.commonComponent.stopSpinner();
      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    })
    this.ciLoanApplicationForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });
    this.insuranceForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });
  }

  save() {
    this.updateData();
  }

  updateData() {
    this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO = this.ciLoanInsuranceDetailsModel;
    this.ciLoanApplicationService.changeData({
      formValid: (!this.ciLoanApplicationForm.valid && !this.insuranceForm.valid )? true : false,
      data: this.ciLoanApplicationModel,
      isDisable: (!this.ciLoanApplicationForm.valid) && (!this.insuranceForm.valid),
      stepperIndex: 3,
    });
  }

  getAllProducts() {
    this.commonComponent.startSpinner();
    this.ciProductDefinitionService.getAllCompoundInterestProductDefinition().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.productsList = this.responseModel.data.filter((product: { status: number; }) => product.status == 3).map((product: any) => {
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

  getProductDefinitionByProductId(id: any) {
    this.ciProductDefinitionService.getCompoundInterestProductDefinitionById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.ciProductDefinitionModel = this.responseModel.data[0];
            if (this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList != undefined && this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList != null) {
              // this.ciLoanApplicationModel.effectiveRoi =  this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList[0].roi;
              // this.ciLoanApplicationModel.penalInterest =  this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList[0].penalInterest;
              // this.ciLoanApplicationModel.iod =  this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList[0].iod;
            }
          }
        }
      }
    });
  }

  getAllRepaymentFrequency() {
    this.commonComponent.startSpinner();
    this.ciLoanApplicationService.getAllRepaymentFrequency().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.repaymentFrequencyList = this.responseModel.data.filter((repaymentFrequency: { status: number; }) => repaymentFrequency.status == applicationConstants.ACTIVE).map((repaymentFrequency: any) => {
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
    this.ciLoanApplicationService.getAllLoanPurpose().subscribe(response => {
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
    this.ciLoanApplicationService.getAllAccountTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.operationTypesList = this.responseModel.data;
            this.operationTypesList = this.operationTypesList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
          }
        }
        if (this.ciLoanApplicationModel.operationTypeId != undefined) {
          const filteredItem = this.operationTypesList.find((item: { value: any; }) => item.value === this.ciLoanApplicationModel.operationTypeId);
          this.ciLoanApplicationModel.operationTypeName = filteredItem.label;
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
    this.ciLoanApplicationService.getAllInsuranceVendors().subscribe(response => {
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

  productOnChange(event: any) {
    this.displayDialog = true;
    this.productInfoFalg = true;
    if (event.value != null && event.value != undefined) {
      this.getProductDefinitionByProductId(event.value);
    }
  }

  onChangeAccountType(event: any) {
    if (event.value != null && event.value != undefined) {
      const filteredItem = this.operationTypesList.find((item: { value: any; }) => item.value === event.value);
      this.ciLoanApplicationModel.operationTypeName = filteredItem.label;
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
  getCiLoanApplicationById(ciLoanApplicationId: any) {
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.ciLoanApplicationModel = this.responseModel.data[0];
                if (this.ciLoanApplicationModel.ciProductId != null && this.ciLoanApplicationModel.ciProductId != undefined)
                  this.isProductDisable = applicationConstants.TRUE;
                // if (this.ciLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                //   this.membershipBasicDetailsModel = this.ciLoanApplicationModel.individualMemberDetailsDTO;
                //   if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined)
                //     this.membershipBasicDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);

                //   if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined)
                //     this.membershipBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                // }
                if (this.ciLoanApplicationModel.applicationDate != null && this.ciLoanApplicationModel.applicationDate != undefined) {
                  this.ciLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.ciLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);
                }
                if (this.ciLoanApplicationModel.sanctionDate != null && this.ciLoanApplicationModel.sanctionDate != undefined) {
                  this.ciLoanApplicationModel.sanctionDate = this.datePipe.transform(this.ciLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);
                }
                if (this.ciLoanApplicationModel.loanDueDate != null && this.ciLoanApplicationModel.loanDueDate != undefined) {
                  this.ciLoanApplicationModel.loanDueDate = this.datePipe.transform(this.ciLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
                }
                if (this.ciLoanApplicationModel.memberTypeName != null && this.ciLoanApplicationModel.memberTypeName != undefined) {
                  this.memberTypeName = this.ciLoanApplicationModel.memberTypeName;
                  if (this.ciLoanApplicationModel.memberTypeName == "Individual")
                    this.isIndividual = true;
                }
                if (this.ciLoanApplicationModel.admissionNo != null && this.ciLoanApplicationModel.admissionNo != undefined) {
                  this.admissionNumber = this.ciLoanApplicationModel.admissionNo;
                }
                if (this.ciLoanApplicationModel.operationTypeName != null && this.ciLoanApplicationModel.operationTypeName != undefined) {
                  this.applicationType = true;
                }
                if (this.ciLoanApplicationModel.ciProductName != null && this.ciLoanApplicationModel.ciProductName != undefined) {
                  this.productInfoFalg = true;
                }
                if (this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO != null && this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO != undefined) {
                  this.ciLoanInsuranceDetailsModel = this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO;
                }
                this.getProductDefinitionByProductId(this.ciLoanApplicationModel.ciProductId);
                this.updateData();
              }
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

  // getProductDefinition() {
  //   this.productDefinitionFlag = true;
  //   this.getProductDefinitionByProductId(this.ciLoanApplicationModel.ciProductId);
  // }

  closeProductDefinition() {
    this.productDefinitionFlag = false;
  }

  /**
   * @implements onSaction amount entry
   * @param sactionAmount 
   * @author jyothi.naidana
   */
  onSactionAmountChange(sactionAmount:any){
    this.interestConfigList = this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList.filter((obj:any)=>(obj.minSlabAmount <= sactionAmount && obj.maxSlabAmount >= sactionAmount ));
    if( this.interestConfigList != null &&  this.interestConfigList != undefined &&  this.interestConfigList.length >0){
      this.ciLoanApplicationModel.effectiveRoi = this.interestConfigList[0].roi;
      this.ciLoanApplicationModel.penalInterest = this.interestConfigList[0].penalInterest;
      this.ciLoanApplicationModel.iod = this.interestConfigList[0].iod;
    }
    else {
      this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "Given Saction Amount is Not in between of any Slabs in Product definition" }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
    }
  
  }
}
