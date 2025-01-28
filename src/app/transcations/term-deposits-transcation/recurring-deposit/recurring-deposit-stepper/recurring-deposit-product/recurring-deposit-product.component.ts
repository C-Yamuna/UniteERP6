import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { RdAccountsService } from '../../../shared/rd-accounts.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { RdAccountsModel, RdProductDefinition } from '../../../shared/term-depost-model.model';
import { MembershipBasicDetail } from '../../../shared/membership-basic-detail.model';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { RecurringDepositProductDefinition } from '../../../recurring-deposit-product-definition/shared/recurring-deposit-product-definition.model';
import { RecurringDepositInterestPolicy } from '../../../recurring-deposit-product-definition/add-recurring-deposit-product-definition/recurring-deposit-interest-policy/shared/recurring-deposit-interest-policy.model';

@Component({
  selector: 'app-recurring-deposit-product',
  templateUrl: './recurring-deposit-product.component.html',
  styleUrls: ['./recurring-deposit-product.component.css']
})
export class RecurringDepositProductComponent implements OnInit {
  
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
  rdProductDefinition:RdProductDefinition = new RdProductDefinition();
  rdAccountModel:RdAccountsModel = new RdAccountsModel();
  membershipBasicDetail:MembershipBasicDetail = new MembershipBasicDetail();
   recurringDepositProductDefinitionModel :RecurringDepositProductDefinition = new RecurringDepositProductDefinition();
    recurringDepositInterestPolicyModel :RecurringDepositInterestPolicy = new RecurringDepositInterestPolicy();
  memberTypeName: any;
  fdNonCummulativeAccId: any;
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



  
  constructor(private router: Router,private datePipe: DatePipe, private formBuilder: FormBuilder, 
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService, 
    private commonFunctionsService: CommonFunctionsService , private ref: ChangeDetectorRef, private rdAccountsService: RdAccountsService,
    private translate: TranslateService,private fileUploadService :FileUploadService
  ) {
    this.applicationForm = this.formBuilder.group({
      'rdProductId':['', [Validators.required]],
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
        this.fdNonCummulativeAccId = Number(id);
        this.isEdit = true;
        this.getRdAccounts(this.fdNonCummulativeAccId);
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
    this.rdAccountsService.changeData({
      formValid: !this.applicationForm.valid ? true : false,
      data: this.rdAccountModel,
      isDisable: (!this.applicationForm.valid),
      stepperIndex: 3,
    });
  }


  getAllProducts() {
    this.rdAccountsService.getAllProductDefinitionList().subscribe((res: any) => {
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
    this.rdAccountsService.getAllAccountTypesList().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.accountList = this.responseModel.data;
            this.accountList = this.accountList.filter((obj: any) => obj != null  && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };

            });
            // this.accountList.unshift({ label: 'select', value: 0 });
          }
        }
        if (this.rdAccountModel.accountType != undefined) {
          const filteredItem = this.accountList.find((item: { value: any; }) => item.value === this.rdAccountModel.accountType);
          this.rdAccountModel.accountTypeName = filteredItem.label;
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
      this.getrdProductDefinitionByProductIdAndDepositDate(event.value);
    }
  }

  onChangeAccountType(event: any) {
    if (event.value != null && event.value != undefined) {
      const filteredItem = this.accountList.find((item: { value: any; }) => item.value === event.value);
      this.rdAccountModel.accountTypeName = filteredItem.label;
      this.updateData();
    }
  }




  //get account details by admissionNumber list
  getRdAccounts(fdNonCummulativeAccId: any) {
    this.rdAccountsService.getRdAccounts(fdNonCummulativeAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.rdAccountModel = this.responseModel.data[0];
            if (this.rdAccountModel.rdProductId != null && this.rdAccountModel.rdProductId != undefined)
              this.isProductDisable = applicationConstants.TRUE;

            if (this.rdAccountModel.memberShipBasicDetailsDTO != undefined) {
              this.membershipBasicDetail = this.rdAccountModel.memberShipBasicDetailsDTO;

              if (this.membershipBasicDetail.dob != null && this.membershipBasicDetail.dob != undefined)
                this.membershipBasicDetail.dobVal = this.datePipe.transform(this.membershipBasicDetail.dob, this.orgnizationSetting.datePipe);

              if (this.membershipBasicDetail.admissionDate != null && this.membershipBasicDetail.admissionDate != undefined)
                this.membershipBasicDetail.admissionDateVal = this.datePipe.transform(this.membershipBasicDetail.admissionDate, this.orgnizationSetting.datePipe);

              if (this.membershipBasicDetail.signaturePath != null && this.membershipBasicDetail.signaturePath != undefined) {
                this.membershipBasicDetail.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetail.signaturePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetail.signaturePath);
              }
            }

            if (this.rdAccountModel.depositDate != null && this.rdAccountModel.depositDate != undefined)
              this.rdAccountModel.depositDateVal = this.datePipe.transform(this.rdAccountModel.depositDate, this.orgnizationSetting.datePipe);

           
            if (this.rdAccountModel.memberTypeName != null && this.rdAccountModel.memberTypeName != undefined) {
              this.memberTypeName = this.rdAccountModel.memberTypeName;
              if (this.rdAccountModel.memberTypeName == "Individual")
                this.isIndividual = true;
            }
            if (this.rdAccountModel.adminssionNumber != null && this.rdAccountModel.adminssionNumber != undefined)
              this.admissionNumber = this.rdAccountModel.adminssionNumber;

            if (this.rdAccountModel.accountTypeName != null && this.rdAccountModel.accountTypeName != undefined)
              this.applicationType = true;

            if (this.rdAccountModel.rdProductName != null && this.rdAccountModel.rdProductName != undefined)
              this.productInfoFalg = true;

            
            if (this.rdAccountModel.rdProductDefinitionDTO != null && this.rdAccountModel.rdProductDefinitionDTO != undefined) {
              this.recurringDepositProductDefinitionModel = this.rdAccountModel.rdProductDefinitionDTO;
              if (this.recurringDepositProductDefinitionModel.intestPolicyConfigList != undefined && this.recurringDepositProductDefinitionModel.intestPolicyConfigList != null)
                this.recurringDepositInterestPolicyModel = this.recurringDepositProductDefinitionModel.intestPolicyConfigList[0];
              if (this.recurringDepositProductDefinitionModel.effectiveStartDate != null && this.recurringDepositProductDefinitionModel.effectiveStartDate != undefined)
                this.recurringDepositProductDefinitionModel.effectiveStartDateVal = this.datePipe.transform(this.recurringDepositProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
  
            }

          }
          this.updateData();
        }
      }
    });
  }

  onSelectdepositDate(){
    this.getrdProductDefinitionByProductIdAndDepositDate(this.rdAccountModel.rdProductId);
  }
  
  getrdProductDefinitionByProductIdAndDepositDate(productId: any) {
    if (this.rdAccountModel.depositDateVal != undefined && this.rdAccountModel.depositDateVal != null)
      this.rdAccountModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.rdAccountModel.depositDateVal));

    this.rdAccountsService.getrdProductDefinitionByProductIdAndDepositDate(this.pacsId, productId, this.rdAccountModel.id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.recurringDepositProductDefinitionModel = this.responseModel.data[0];
          if (this.recurringDepositProductDefinitionModel.effectiveStartDate != null && this.recurringDepositProductDefinitionModel.effectiveStartDate != undefined)
            this.recurringDepositProductDefinitionModel.effectiveStartDateVal = this.datePipe.transform(this.recurringDepositProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
          if (this.recurringDepositProductDefinitionModel.intestPolicyConfigList != undefined && this.recurringDepositProductDefinitionModel.intestPolicyConfigList != null) {
            this.recurringDepositInterestPolicyModel = this.recurringDepositProductDefinitionModel.intestPolicyConfigList[0];
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
