import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Loantransactionconstant } from '../../../loan-transaction-constant';
import { SaoLoanApplicationService } from '../../../shared/sao-loans/sao-loan-application.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SaoLoanApplication } from '../../shared/sao-loan-application.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { SaoLoanCollections } from './shared/sao-loan-collections.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TranslateService } from '@ngx-translate/core';
import { SaoCollectionService } from './shared/sao-collection.service';
import { DatePipe } from '@angular/common';
interface Transaction {
  charges: number;
  interest: number;
  principal: number;
}

interface Data {
  totalOutstanding: number;
  debit: Transaction;
  credit: Transaction;
  outstanding: Transaction;
}


@Component({
  selector: 'app-sao-loan-collections',
  templateUrl: './sao-loan-collections.component.html',
  styleUrls: ['./sao-loan-collections.component.css']
})
export class SaoLoanCollectionsComponent {
  collectionForm:FormGroup;
  collectionDetails:any;
  saoLoanApplicationModel: SaoLoanApplication = new SaoLoanApplication();
  saoLoanCollectionsModel: SaoLoanCollections = new SaoLoanCollections();
  foreclosureChargesEnabled: boolean = false;
  paymentOptions:any;
  additionalChargesCheck:boolean = false;
  accountNumber: any;
  responseModel!: Responsemodel;
  orgnizationSetting: any;
  msgs: any[] = [];
  loanId: any;
  isEdit: any;
  showForm: boolean = false;
  rowEdit: boolean = false;
  yourData: Data[] = [
    {
        totalOutstanding: 1000,
        debit: {
            charges: 200,
            interest: 300,
            principal: 500
        },
        credit: {
            charges: 150,
            interest: 250,
            principal: 400
        },
        outstanding: {
            charges: 50,
            interest: 50,
            principal: 100
        }
    },
  ];
  pacsId: any;
  branchId: any;
  saoLoanCollectionList: any[] = [];
  totalDue: any;
 
  
  constructor(private router: Router,private saoLoanApplicationService : SaoLoanApplicationService,private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,private encryptDecryptService: EncryptDecryptService, private formBuilder: FormBuilder
    , private commonFunctionsService: CommonFunctionsService,private translate: TranslateService,private saoCollectionService: SaoCollectionService
    , private datePipe: DatePipe,
  ){
    this.paymentOptions = [
      { label: 'Cash', value: 1 },
      { label: 'Cheque', value: 2 },
      //{ label: 'Transfer', value: 3 }
    ];
    this.collectionForm = this.formBuilder.group({
      // effectiveRoi: ['', ],
      totaolDueAmount:[{ value: '', disabled: true }],
      totaolCollectionAmount: ['', [Validators.required, Validators.minLength(3)]],
      transactionDate: [{ value: '', disabled: true }],
      paymentModeName: ['', [Validators.required]],
      referenceNumber: ['', [Validators.required]],

      // minLoanPeriod: [{ value: '', disabled: true }],
      // maxLoanPeriod: [{ value: '', disabled: true }],
      // penalInterest: [{ value: '', disabled: true }],
      // iod: [{ value: '', disabled: true }],
      // repaymentFrequency:[{ value: '', disabled: true }],
      // purposeName:  ['', [Validators.required, Validators.minLength(3)]],
      // operationTypeName: ['', [Validators.required, Validators.minLength(3)]],
      // sanctionAmount: ['', [Validators.required, Validators.minLength(3)]],
      // loanPeriod:['', ],
      // loanDueDate:['', ],
      // plannedDisbursements:['', ],
      
    })
    this.collectionDetails = [
      // { field: 'productName', header: 'LOANS.PRODUCT_NAME' },
      // { field: 'collectionDateVal', header: 'LOANS.COLLECTION_DATE' },
      { field: 'totaolCollectionAmount', header: 'LOANS.COLLECTION_AMOUNT' },
      { field: 'transactionDateVal', header: 'LOANS.TRANSACTION_DATE' },
      { field: 'paymentModeName', header: 'LOANS.PAYMENT_MODE' },
      // { field: 'accountNumber', header: 'LOANS.ACCOUNT_NUMBER' },
      { field: 'referenceNumber', header: 'LOANS.REFERENCE_NUMBER' },
      { field: 'statusName', header: 'LOANS.STATUS' },
     
    ];
  }
  ngOnInit() {
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['accountNumber'] != undefined) {
        this.commonComponent.startSpinner();
        this.loanId = Number(this.encryptDecryptService.decrypt(params['id']));
        if(params['accountNumber'] != undefined){
          this.accountNumber = Number(this.encryptDecryptService.decrypt(params['accountNumber'])); 
        }
        // this.isEdit = true;
        this.getSaoCollectionListByApplicationId(this.loanId);
      } else {
        // this.isEdit = false;
        this.saoLoanCollectionsModel = new SaoLoanCollections();
      }
    }) 
    // this.documentForm.valueChanges.subscribe((data: any) => {
    //   this.updateData();
    //   if (this.documentForm.valid) {
    //     this.save();
    //   }
    // });
  }
  saveCollection() {
    // this.saoLoanCollectionsModel.pacsCode = this.pacsCode;
    this.saoLoanCollectionsModel.pacsId = this.pacsId;
    this.saoLoanCollectionsModel.branchId = this.branchId;
    this.saoLoanCollectionsModel.saoLoanApplicationId = this.saoLoanApplicationModel.id;
    this.saoLoanCollectionsModel.saoProductId = this.saoLoanApplicationModel.saoProductId;
    this.saoLoanCollectionsModel.totaolDueAmount = this.totalDue

    if (this.saoLoanCollectionsModel.collectionDateVal != undefined)
      this.saoLoanCollectionsModel.collectionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoLoanCollectionsModel.collectionDateVal));

    if (this.saoLoanCollectionsModel.transactionDateVal != undefined)
      this.saoLoanCollectionsModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoLoanCollectionsModel.transactionDateVal));

    this.saoLoanCollectionsModel.statusName = 'Created'
    if (this.isEdit) {
      this.saoCollectionService.updateSaoCollection(this.saoLoanCollectionsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
        this.getSaoCollectionListByApplicationId(this.loanId);
        this.resetCollectionFormData();
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
    else {
      this.saoCollectionService.addSaoCollection(this.saoLoanCollectionsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
        this.getSaoCollectionListByApplicationId(this.loanId);
        this.resetCollectionFormData();
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }
  
  getSaoCollectionListByApplicationId(id: any) {
    this.saoCollectionService.getSaoCollectionListByApplicationId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.saoLoanApplicationModel = this.responseModel.data[0];

            if (this.saoLoanApplicationModel.loanApprovedDate != null && this.saoLoanApplicationModel.loanApprovedDate != undefined)
              this.saoLoanApplicationModel.loanApprovedDateVal = this.datePipe.transform(this.saoLoanApplicationModel.loanApprovedDate, this.orgnizationSetting.datePipe);
            
            if (this.saoLoanApplicationModel.loanDueDate != null && this.saoLoanApplicationModel.loanDueDate != undefined)
              this.saoLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.saoLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
           
            if (this.saoLoanApplicationModel.saoCollectionDTOList != undefined && this.saoLoanApplicationModel.saoCollectionDTOList != null
              && this.saoLoanApplicationModel.saoCollectionDTOList.length > 0) {
              this.saoLoanCollectionList = this.saoLoanApplicationModel.saoCollectionDTOList;

              if(this.saoLoanCollectionsModel.transactionDate == null || this.saoLoanCollectionsModel.transactionDate == undefined){
                this.saoLoanCollectionsModel.transactionDateVal = this.commonFunctionsService.currentDate();
              }
             
              for (let collection of this.saoLoanCollectionList) {
                if (this.saoLoanApplicationModel.accountNumber != null)
                  collection.accountNumber = this.saoLoanApplicationModel.accountNumber;

                if (collection.collectionDate != null && collection.collectionDate != undefined)
                  collection.collectionDateVal = this.datePipe.transform(collection.collectionDate, this.orgnizationSetting.datePipe);

                if (collection.transactionDate != null && collection.transactionDate != undefined)
                  collection.transactionDateVal = this.datePipe.transform(collection.transactionDate, this.orgnizationSetting.datePipe);
                
                if(collection.totaolDueAmount != null&& collection.totaolDueAmount != undefined)
                  this.saoLoanCollectionsModel.totaolDueAmount = this.saoLoanApplicationModel.totalDisbursedAmount - this.saoLoanApplicationModel.totalCollectionAmount;
                else
                  this.saoLoanCollectionsModel.totaolDueAmount = this.saoLoanApplicationModel.totalDisbursedAmount;

                if (collection.statusName != null && collection.statusName != undefined && collection.statusName === "Created")
                  collection.isEditShow = applicationConstants.TRUE;
                else
                  collection.isEditShow = applicationConstants.FALSE;
              }
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
  editRow(rowData: any) {
    this.saoLoanCollectionsModel.saoLoanApplicationId = rowData.saoLoanApplicationId;
    this.saoLoanCollectionsModel.accountNumber = rowData.accountNumber;
    this.saoLoanCollectionsModel.collectionDateVal = rowData.collectionDateVal;
    this.saoLoanCollectionsModel.totaolCollectionAmount = rowData.totaolCollectionAmount;
    this.saoLoanCollectionsModel.transactionDateVal = rowData.transactionDateVal;
    this.saoLoanCollectionsModel.paymentMode = rowData.paymentMode;
    this.saoLoanCollectionsModel.referenceNumber = rowData.referenceNumber;
    this.saoLoanCollectionsModel.id = rowData.id;
    this.rowEdit = true;
    this.isEdit = true;
  }
  resetCollectionFormData() {
    this.saoLoanCollectionsModel.collectionDateVal = null;
    this.saoLoanCollectionsModel.totaolCollectionAmount = null;
    this.saoLoanCollectionsModel.transactionDateVal = null;
    this.saoLoanCollectionsModel.paymentMode = null;
    this.saoLoanCollectionsModel.referenceNumber = null;
  }
  back(){
    this.router.navigate([Loantransactionconstant.SAO_LOAN]);
  }
  
  isBasicDetails: boolean = false;
  position: string = 'center';
  showBasicDetailsDialog(position: string) {
    this.position = position;
    this.isBasicDetails = true;
  }
  onClickMemberIndividualMoreDetails(){
    this.showForm = true
  }
}
