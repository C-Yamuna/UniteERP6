import { SiLoanApplication } from './../../../shared/si-loans/si-loan-application.model';
import { SiLoanDisbursement } from './../../../shared/si-loans/si-loan-disbursement.model';
import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Loantransactionconstant } from '../../../loan-transaction-constant';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { Table } from 'primeng/table';
import { SiDisbursementService } from '../../../shared/si-loans/si-disbursement.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SiLoanApplicationService } from '../../../shared/si-loans/si-loan-application.service';
import { SiProductDefinitionService } from '../../../shared/si-loans/si-product-definition.service';
import { SiLoanProductDefinition } from '../../../shared/si-loans/si-loan-product-definition.model';
import { TranslateService } from '@ngx-translate/core';
import { MembershipBasicRequiredDetails } from '../../../shared/si-loans/si-loan-membership-details.model';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-simple-interest-loan-disbursement',
  templateUrl: './simple-interest-loan-disbursement.component.html',
  styleUrls: ['./simple-interest-loan-disbursement.component.css']
})
export class SimpleInterestLoanDisbursementComponent {

  orgnizationSetting: any;
  disbursementForm: FormGroup;
  siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
  siLoanDisbursementModel: SiLoanDisbursement = new SiLoanDisbursement();
  siLoanProductDefinitionModel: SiLoanProductDefinition = new SiLoanProductDefinition();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  isEdit: boolean = false;
  responseModel!: Responsemodel;
  siLoanDisbursementList: any[] = [];
  loanAccId: any;
  msgs: any[] = [];
  showForm: boolean = false;

  rowEdit: boolean = false;

  @ViewChild('dt', { static: false }) private dt!: Table;

  addButtonService: boolean = false;
  editDeleteDisable: boolean = false;

  siLoanDisbursementColumns: any[] = [];
  buttonDisabled: boolean = true;
  pacsId: any;
  branchId: any;
  pacsCode: any;

  isRowView: Boolean = false;
  memberTypeName: any;
  admissionNumber: any;
  isIndividual: Boolean = false;
  applicationType: boolean = false;
  disable: boolean = true;

  memberPhotoCopyZoom: boolean = false;
  institutionPromoterFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  photoCopyFlag: boolean = false;
  memberSignatureCopyZoom: boolean = false;
  membreIndividualFlag: boolean = false;
  isKycApproved: any;

  constructor(private router: Router, private formBuilder: FormBuilder, private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent, private datePipe: DatePipe,
    private activateRoute: ActivatedRoute, private siDisbursementService: SiDisbursementService, private siLoanApplicationService: SiLoanApplicationService,
    private siProductDefinitionService: SiProductDefinitionService, private translate: TranslateService, private fileUploadService: FileUploadService,) {

    this.siLoanDisbursementColumns = [
      { field: 'siProductName', header: 'LOANS.PRODUCT_NAME' },
      { field: 'accountNumber', header: 'LOANS.ACCOUNT_NUMBER' },
      { field: 'disbursementDateVal', header: 'LOANS.DISBURSEMENT_DATE' },
      { field: 'disbursementAmount', header: 'LOANS.DISBURSEMENT_AMOUNT' },
      { field: 'transactionDateVal', header: 'LOANS.TRANSACTION_DATE' },
      { field: 'statusName', header: 'LOANS.STATUS' }
    ];

    this.disbursementForm = this.formBuilder.group({
      'siProductName': new FormControl('', Validators.required),
      'accountNumber': new FormControl('', Validators.required),
      'disbursementDate': new FormControl('', Validators.required),
      'disbursementAmount': new FormControl('', Validators.required),
      'transactionDate': new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.loanAccId = this.encryptDecryptService.decrypt(params['id']);
        this.getSILoanApplicationById(this.loanAccId);
        this.isEdit = true;
      } else {
        this.isEdit = false;
        this.siLoanDisbursementModel = new SiLoanDisbursement();
      }
    });
  }

  //get account details by admissionNumber list
  getSILoanApplicationById(loanAccId: any) {
    this.siDisbursementService.getSILoanDisbursementDetailsByApplicationId(loanAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {

            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siLoanApplicationModel = this.responseModel.data[0];

                if (this.siLoanApplicationModel.accountNumber != null && this.siLoanApplicationModel.accountNumber != undefined) {
                  this.siLoanDisbursementModel.accountNumber = this.siLoanApplicationModel.accountNumber;
                }

                if (this.siLoanApplicationModel.applicationDate != null && this.siLoanApplicationModel.applicationDate != undefined) {
                  this.siLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.siLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);
                }
                if (this.siLoanApplicationModel.sanctionDate != null && this.siLoanApplicationModel.sanctionDate != undefined) {
                  this.siLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.siLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);
                }
                if (this.siLoanApplicationModel.loanDueDate != null && this.siLoanApplicationModel.loanDueDate != undefined) {
                  this.siLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.siLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
                }

                if (this.siLoanApplicationModel.memberTypeName != null && this.siLoanApplicationModel.memberTypeName != undefined) {
                  this.memberTypeName = this.siLoanApplicationModel.memberTypeName;
                  if (this.siLoanApplicationModel.memberTypeName == MemberShipTypesData.INDIVIDUAL)
                    this.isIndividual = true;
                }
                if (this.siLoanApplicationModel.admissionNo != null && this.siLoanApplicationModel.admissionNo != undefined) {
                  this.admissionNumber = this.siLoanApplicationModel.admissionNo;
                }
                if (this.siLoanApplicationModel.operationTypeName != null && this.siLoanApplicationModel.operationTypeName != undefined) {
                  this.applicationType = true;
                }

                if (this.siLoanApplicationModel.individualMemberDetailsDTO != undefined && this.siLoanApplicationModel.individualMemberDetailsDTO != null) {
                  this.membershipBasicRequiredDetailsModel = this.siLoanApplicationModel.individualMemberDetailsDTO;

                  if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined)
                    this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);

                  if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined)
                    this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

                  if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
                    this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
                    this.photoCopyFlag = true;
                  }
                  if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                    this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
                  }

                  if (this.membershipBasicRequiredDetailsModel.isKycApproved != null && this.membershipBasicRequiredDetailsModel.isKycApproved != undefined && this.membershipBasicRequiredDetailsModel.isKycApproved)
                    this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                  else
                    this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;

                }
                if (this.siLoanApplicationModel.siProductDefinitionDTO != null && this.siLoanApplicationModel.siProductDefinitionDTO != undefined)
                  this.siLoanProductDefinitionModel = this.siLoanApplicationModel.siProductDefinitionDTO;
              }
            }
          }
        }
      }
    });
  }

  getProductDefinitionByProductId(id: any) {
    this.siProductDefinitionService.getSIProductDefinitionPreviewByProductId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.siLoanProductDefinitionModel = this.responseModel.data[0];

            if (null != this.siLoanProductDefinitionModel && this.siLoanProductDefinitionModel != undefined) {
              if (this.siLoanProductDefinitionModel.name != null && this.siLoanProductDefinitionModel.name != undefined)
                this.siLoanDisbursementModel.siProductName = this.siLoanProductDefinitionModel.name;
            }
            // if (this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList != undefined && this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList != null) {
            //   this.siLoanInterestPolicyModel = this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList[0];
            // }
          }
        }
      }
    });
  }

  getSILoanDisbursementsById(id: any) {
    this.siDisbursementService.getSIDisbursementListByApplicationId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.siLoanDisbursementList = this.responseModel.data;

            for (let disbursement of this.siLoanDisbursementList) {
              if (disbursement.disbursementDate != null && disbursement.disbursementDate != undefined)
                disbursement.disbursementDateVal = this.datePipe.transform(disbursement.disbursementDate, this.orgnizationSetting.datePipe);

              if (disbursement.transactionDate != null && disbursement.transactionDate != undefined)
                disbursement.transactionDateVal = this.datePipe.transform(disbursement.transactionDate, this.orgnizationSetting.datePipe);

              if (disbursement.statusName != null && disbursement.statusName != undefined && disbursement.statusName === "Created")
                disbursement.isEditShow = applicationConstants.TRUE;
              else
                disbursement.isEditShow = applicationConstants.FALSE;
            }
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


  saveDisbursement() {
    // this.siLoanDisbursementModel.pacsCode = this.pacsCode;
    this.siLoanDisbursementModel.pacsId = this.pacsId;
    this.siLoanDisbursementModel.branchId = this.branchId;

    if (this.siLoanDisbursementModel.disbursementDateVal != undefined)
      this.siLoanDisbursementModel.disbursementDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanDisbursementModel.disbursementDateVal));

    if (this.siLoanDisbursementModel.transactionDateVal != undefined)
      this.siLoanDisbursementModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanDisbursementModel.transactionDateVal));

    this.siLoanDisbursementModel.statusName = 'Created'
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.siDisbursementService.addSIDisbursement(this.siLoanDisbursementModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.addButtonService = false;

        this.getSILoanDisbursementsById(this.loanAccId);
        this.resetDisbrusmentFormData();

        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);

      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    },
      error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    this.disableForm();
  }

  resetDisbrusmentFormData() {
    this.siLoanDisbursementModel.siProductName = null;
    this.siLoanDisbursementModel.accountNumber = null;
    this.siLoanDisbursementModel.disbursementDateVal = null;
    this.siLoanDisbursementModel.disbursementAmount = null;
    this.siLoanDisbursementModel.transactionDateVal = null;

    this.enableForm();
  }

  clearDisbursement() {
    this.siLoanDisbursementModel = new SiLoanDisbursement();
    this.addButtonService = false;
    this.editDeleteDisable = false;

    this.enableForm();
  }

  delete(row: any) {
    this.siDisbursementService.deleteSIDisbursement(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.siLoanDisbursementList = this.responseModel.data;
        this.getSILoanDisbursementsById(this.loanAccId);
      }
    });
  }

  editRow(rowData: any) {
    this.isRowView = false;
    this.siLoanDisbursementModel.siProductId = rowData.siProductId;
    this.siLoanDisbursementModel.siLoanApplicationId = rowData.siLoanApplicationId;
    this.siLoanDisbursementModel.siProductName = rowData.siProductName;
    this.siLoanDisbursementModel.accountNumber = rowData.accountNumber;
    this.siLoanDisbursementModel.disbursementDateVal = rowData.disbursementDateVal;
    this.siLoanDisbursementModel.disbursementAmount = rowData.disbursementAmount;
    this.siLoanDisbursementModel.transactionDateVal = rowData.transactionDateVal;
    this.siLoanDisbursementModel.id = rowData.id;
    this.rowEdit = true;

    this.disableForm();
  }

  viewRow(rowData: any) {
    this.isRowView = true;
    this.siLoanDisbursementModel.siProductId = rowData.siProductId;
    this.siLoanDisbursementModel.siLoanApplicationId = rowData.siLoanApplicationId;
    this.siLoanDisbursementModel.siProductName = rowData.siProductName;
    this.siLoanDisbursementModel.accountNumber = rowData.accountNumber;
    this.siLoanDisbursementModel.disbursementDateVal = rowData.disbursementDateVal;
    this.siLoanDisbursementModel.disbursementAmount = rowData.disbursementAmount;
    this.siLoanDisbursementModel.transactionDateVal = rowData.transactionDateVal;
    this.siLoanDisbursementModel.id = rowData.id;
    this.rowEdit = true;

    this.disableForm();
  }

  disableFormControl(controlName: string): void {
    this.disbursementForm.get(controlName)?.disable();
  }

  enableFormControl(controlName: string): void {
    this.disbursementForm.get(controlName)?.enable();
  }

  back() {
    this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_TRANSACTION]);
  }

  disableForm() {
    this.disableFormControl('siProductName');
    this.disableFormControl('accountNumber');
    if (this.isRowView)
      this.disableFormControl('disbursementDate');
    else
      this.enableFormControl('disbursementDate');

    this.disableFormControl('disbursementAmount');
    this.disableFormControl('transactionDate');
  }

  enableForm() {
    this.enableFormControl('siProductName');
    this.enableFormControl('accountNumber');
    this.enableFormControl('disbursementDate');
    this.enableFormControl('disbursementAmount');
    this.enableFormControl('transactionDate');
  }
  isBasicDetails: boolean = false;
  position: string = 'center';
  showBasicDetailsDialog(position: string) {
    this.position = position;
    this.isBasicDetails = true;
  }

  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }

  onClickOfGroupMoreDetails() {
    this.groupPromotersPopUpFlag = true;
  }

  onClickInstitutionMoreDetails() {
    this.institutionPromoterFlag = true;
  }

  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }

  close() {
    this.institutionPromoterFlag = false;
    this.groupPromotersPopUpFlag = false;
    this.memberSignatureCopyZoom = false;
    this.memberPhotoCopyZoom = false;
  }

}
