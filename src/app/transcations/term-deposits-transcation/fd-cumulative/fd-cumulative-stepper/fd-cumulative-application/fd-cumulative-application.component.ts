import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FdCummProductDefinitionModel, FdCumulativeApplication } from './shared/fd-cumulative-application.model';
import { MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from '../new-membership-add/shared/new-membership-add.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FdCumulativeApplicationService } from './shared/fd-cumulative-application.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { InterestPolicy } from '../../../term-deposit-product-definition/add-td-product-definition/interest-policy/shared/interest-policy.model';

@Component({
  selector: 'app-fd-cumulative-application',
  templateUrl: './fd-cumulative-application.component.html',
  styleUrls: ['./fd-cumulative-application.component.css']
})
export class FdCumulativeApplicationComponent {

  applicationForm: FormGroup;

  checked: boolean = false;
  responseModel!: Responsemodel;
  productsList: any[] = [];
  repaymentFrequencyList: any[] = [];
  loanPurposeList: any[] = [];
  accountList: any[] = [];
  schemeTypesList: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  insuranceVendorDetailsList: any[] = [];
  occupationTypesList: any[] = [];
  gendersList: any[] = [];
  relationshipTypesList: any[] = [];
  isMemberCreation: boolean = false;
  fdCumulativeApplicationModel: FdCumulativeApplication = new FdCumulativeApplication();
  productDefinitionModel: FdCummProductDefinitionModel = new FdCummProductDefinitionModel();
  membershipBasicRequiredDetails: NewMembershipAdd = new NewMembershipAdd();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
    interestPolicyModel :InterestPolicy = new InterestPolicy();
  memberTypeName: any;
  fdCummulativeAccId: any;
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
  displayDialog: boolean = false;
  displayDeleteDialog: boolean = false;
  siLoanDisbursementScheduleList: any[] = [];
  editDeleteDisable: boolean = false;

  disableAddButton: boolean = false;
  deleteId: any;
  pacsId: any;
  branchId: any;

  constructor(
    private formBuilder: FormBuilder,
    private fdCumulativeApplicationService: FdCumulativeApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe, private fileUploadService: FileUploadService) {

      this.applicationForm = this.formBuilder.group({
        'fdCummulativeProductId':['', [Validators.required]],
        'accountNumber': [{ value: '', disabled: true }],
        'roi': [{ value: '', disabled: true }],
        'depositDate': ['', ],
        'penalRoi': [{ value: '', disabled: true }],
        'monthlyIncome': ['', ],
        'tenureInDays': ['', ],
        'tenureInMonths':['',],
        'tenureInYears':['',],
        'depositAmount': ['',],
        'accountType': ['', [Validators.required]],
    
        })
  }

 
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);



    this.getAllProducts();
    this.getAllAccountTypes();


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

    this.applicationForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.applicationForm.valid) {
      //   this.save();
      // }
    });
  }

  save() {
    this.updateData();
  }

  updateData() {
    this.fdCumulativeApplicationService.changeData({
      formValid: !this.applicationForm.valid ? true : false,
      data: this.fdCumulativeApplicationModel,
      isDisable: (!this.applicationForm.valid),
      stepperIndex: 3,
    });
  }


  getAllProducts() {
    this.fdCumulativeApplicationService.getAllProductDefinitionList().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.productsList = this.responseModel.data;
            this.productsList = this.productsList.filter((obj: any) => obj != null).map((product: { name: any; id: any; }) => {
              return { label: product.name, value: product.id };
            });
          }
        }
      }
    });
  }



  getAllAccountTypes() {
    this.fdCumulativeApplicationService.getAllAccountTypesList().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.accountList = this.responseModel.data;
            this.accountList = this.accountList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };

            });
            // this.accountList.unshift({ label: 'select', value: 0 });
          }
        }
        if (this.fdCumulativeApplicationModel.accountType != undefined) {
          const filteredItem = this.accountList.find((item: { value: any; }) => item.value === this.fdCumulativeApplicationModel.accountType);
          this.fdCumulativeApplicationModel.accountTypeName = filteredItem.label;
        }
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    })
  }
  onChangeProduct(event: any) {
    this.displayDialog = true;
    this.productInfoFalg = true;
    if (event.value != null && event.value != undefined) {
      this.getfdnonProductDefinitionByProductIdAndDepositDate(event.value);
    }
  }

  onChangeAccountType(event: any) {
    if (event.value != null && event.value != undefined) {
      const filteredItem = this.accountList.find((item: { value: any; }) => item.value === event.value);
      this.fdCumulativeApplicationModel.accountTypeName = filteredItem.label;
      this.updateData();
    }
  }




  //get account details by admissionNumber list
  getFdCummApplicationById(fdCummulativeAccId: any) {
    this.fdCumulativeApplicationService.getFdCummApplicationById(fdCummulativeAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.fdCumulativeApplicationModel = this.responseModel.data[0];
            if (this.fdCumulativeApplicationModel.fdCummulativeProductId != null && this.fdCumulativeApplicationModel.fdCummulativeProductId != undefined)
              this.isProductDisable = applicationConstants.TRUE;

            if (this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO != undefined) {
              this.membershipBasicRequiredDetails = this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO;

              if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined)
                this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);

              if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined)
                this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);

              if (this.membershipBasicRequiredDetails.signaturePath != null && this.membershipBasicRequiredDetails.signaturePath != undefined) {
                this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signaturePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signaturePath);
              }
            }

            if (this.fdCumulativeApplicationModel.depositDate != null && this.fdCumulativeApplicationModel.depositDate != undefined)
              this.fdCumulativeApplicationModel.depositDateVal = this.datePipe.transform(this.fdCumulativeApplicationModel.depositDate, this.orgnizationSetting.datePipe);

           
            if (this.fdCumulativeApplicationModel.memberTypeName != null && this.fdCumulativeApplicationModel.memberTypeName != undefined) {
              this.memberTypeName = this.fdCumulativeApplicationModel.memberTypeName;
              if (this.fdCumulativeApplicationModel.memberTypeName == "Individual")
                this.isIndividual = true;
            }
            if (this.fdCumulativeApplicationModel.admissionNumber != null && this.fdCumulativeApplicationModel.admissionNumber != undefined)
              this.admissionNumber = this.fdCumulativeApplicationModel.admissionNumber;

            if (this.fdCumulativeApplicationModel.accountTypeName != null && this.fdCumulativeApplicationModel.accountTypeName != undefined)
              this.applicationType = true;

            if (this.fdCumulativeApplicationModel.fdCummulativeProductName != null && this.fdCumulativeApplicationModel.fdCummulativeProductName != undefined)
              this.productInfoFalg = true;

            
            if (this.fdCumulativeApplicationModel.fdCummulativeProductDefinitionDTO != null && this.fdCumulativeApplicationModel.fdCummulativeProductDefinitionDTO != undefined) {
              this.productDefinitionModel = this.fdCumulativeApplicationModel.fdCummulativeProductDefinitionDTO;
              if (this.productDefinitionModel.intestPolicyConfigList != undefined && this.productDefinitionModel.intestPolicyConfigList != null)
                this.interestPolicyModel = this.productDefinitionModel.intestPolicyConfigList[0];
              if (this.productDefinitionModel.effectiveStartDate != null && this.productDefinitionModel.effectiveStartDate != undefined)
                this.productDefinitionModel.effectiveStartDateVal = this.datePipe.transform(this.productDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
  
            }

          }
          this.updateData();
        }
      }
    });
  }

  onSelectdepositDate(){
    this.getfdnonProductDefinitionByProductIdAndDepositDate(this.fdCumulativeApplicationModel.fdCummulativeProductId);
  }
  
  getfdnonProductDefinitionByProductIdAndDepositDate(productId: any) {
    if (this.fdCumulativeApplicationModel.depositDateVal != undefined && this.fdCumulativeApplicationModel.depositDateVal != null)
      this.fdCumulativeApplicationModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdCumulativeApplicationModel.depositDateVal));

    this.fdCumulativeApplicationService.getfdProductDefinitionByProductIdAndDepositDate(this.pacsId, productId, this.fdCumulativeApplicationModel.id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.productDefinitionModel = this.responseModel.data[0];
          if (this.productDefinitionModel.effectiveStartDate != null && this.productDefinitionModel.effectiveStartDate != undefined)
            this.productDefinitionModel.effectiveStartDateVal = this.datePipe.transform(this.productDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
          if (this.productDefinitionModel.intestPolicyConfigList != undefined && this.productDefinitionModel.intestPolicyConfigList != null) {
            this.interestPolicyModel = this.productDefinitionModel.intestPolicyConfigList[0];
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
