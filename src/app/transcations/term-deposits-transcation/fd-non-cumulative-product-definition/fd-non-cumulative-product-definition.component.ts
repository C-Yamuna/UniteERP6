import { Component } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { termdeposittransactionconstant } from '../term-deposit-transaction-constant';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FdNonCumulativeProductDefinition } from './shared/fd-non-cumulative-product-definition.model';
import { FdNonCumulativeProductDefinitionService } from './shared/fd-non-cumulative-product-definition.service';
import { DatePipe } from '@angular/common';
import { CommonStatusData } from '../../common-status-data.json';

@Component({
  selector: 'app-fd-non-cumulative-product-definition',
  templateUrl: './fd-non-cumulative-product-definition.component.html',
  styleUrls: ['./fd-non-cumulative-product-definition.component.css']
})
export class FdNonCumulativeProductDefinitionComponent {
  responseModel!: Responsemodel;
  fdNonCumulativeproductdefinition: any[] = [];
  showForm: boolean = applicationConstants.FALSE;
  editViewButton:boolean = applicationConstants.FALSE;
  gridListData: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  tempGridListData: any[] = [];
  activeStatusCount: any;
  inactiveStatusCount: any;
  gridListLength: Number | undefined;

  constructor(private router: Router,private translate: TranslateService,private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService,private fdNonCumulativeProductDefinitionService : FdNonCumulativeProductDefinitionService,private datePipe: DatePipe,
    private commonComponent: CommonComponent){ 
      
    }

    /**
    @author vinitha
    @implements Fd Cummulative Configuration details Stepper Configuration
   */
  ngOnInit() {
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });
    this.fdNonCumulativeproductdefinition = [
      { field: 'name', header: 'TERMDEPOSITSTRANSACTION.PRODUCT_NAME' },
      { field: '', header: 'TERMDEPOSITSTRANSACTION.RATE_OF_INTEREST' },
      { field: 'minDepositAmount', header: 'TERMDEPOSITSTRANSACTION.MIN_DEPOSIT_AMOUNT' },
      { field: 'maxDepositAmount',header:'TERMDEPOSITSTRANSACTION.MAX_DEPOSIT_AMOUNT'},
      { field: 'effectiveStartDate',header:'TERMDEPOSITSTRANSACTION.EFFECTIVE_START_DATE'},
      { field: 'statusName',header:'TERMDEPOSITSTRANSACTION.STATUS'}
    ];
    this.getAllFdNonCumulativeProductDefinition();
}
/**
    @author vinitha
    @implements Routes to add Fd Cummulative Product Defination Stepper
   */
  addFdNonCumulative(){
    this.router.navigate([termdeposittransactionconstant.FD_NON_CUMULATIVE_GENERAL_CONFIG]);
  }
  /**
    @author vinitha
    @implements Routes to View Fd Cummulative Product Defination Details
   */
  viewNonfdNonCummulative(rowData: any) {
    let viewScreen = true;
    this.router.navigate([termdeposittransactionconstant.VIEW_FD_NON_CUMMULATIVE_PRODUCT_DEFINITION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id),view: this.encryptDecryptService.encrypt(viewScreen), editbtn: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE),isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) }});
  }
  /**
    @author vinitha
    @implements Routes to Edit Fd Cummulative Product Defination Stepper
   */
  editNonfdNonCummulative(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.VIEW_FD_NON_CUMMULATIVE_PRODUCT_DEFINITION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id),editbtn: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
    // this.editViewButton =applicationConstants.TRUE;
  }
  /**
    @author vinitha
    @implements Get All Fd Cummulative Configuration details 
    @returns list of Fd Cummulative Configuration details
   */
    getAllFdNonCumulativeProductDefinition() {
    this.fdNonCumulativeProductDefinitionService.getAllFdNonCumulativeProductDefinition().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if(null!=this.responseModel.data && undefined!=this.responseModel.data ){
          this.gridListData = this.responseModel.data;
          if(null!=this.gridListData && undefined!=this.gridListData && this.gridListData.length>0){
            this.gridListData = this.gridListData.filter((data:any) => null!=data.effectiveStartDate).map(fdNonCummulative => {
              fdNonCummulative.effectiveStartDate = this.datePipe.transform(fdNonCummulative.effectiveStartDate, this.orgnizationSetting.datePipe)||'';
              //defaualt values as false
              fdNonCummulative.inProgress = false;
              fdNonCummulative.isSubmissionForApproval = false;
              fdNonCummulative.isApproved = false;
              fdNonCummulative.isRejected = false;
              fdNonCummulative.isRequestForResubmission = false;
              fdNonCummulative.viewButton = false;
              fdNonCummulative.showEdit = false;

              if (fdNonCummulative.statusName === CommonStatusData.IN_PROGRESS) {
                fdNonCummulative.inProgress = true;
                fdNonCummulative.showEdit = true;
              }else if (fdNonCummulative.statusName === CommonStatusData.REQUEST_FOR_RESUBMISSION) {
                fdNonCummulative.isRequestForResubmission = true;
                fdNonCummulative.showEdit = true;
              }else if (fdNonCummulative.statusName === CommonStatusData.APPROVED) {
                fdNonCummulative.isApproved = true;
                fdNonCummulative.showEdit = true;
              } else if (fdNonCummulative.statusName === CommonStatusData.REJECTED) {
                fdNonCummulative.isRejected = true;
                fdNonCummulative.showEdit = true;
              }else if (fdNonCummulative.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL) {
                fdNonCummulative.isSubmissionForApproval = true;
                fdNonCummulative.showEdit = true;
              }
              return fdNonCummulative
            });
          }
        }
        this.activeStatusCount = this.gridListData.filter(fdAccountApplication => fdAccountApplication.status != null && fdAccountApplication.status != undefined && fdAccountApplication.status === applicationConstants.ACTIVE).length;
        this.inactiveStatusCount = this.gridListData.filter(fdAccountApplication => fdAccountApplication.status != null && fdAccountApplication.status != undefined && fdAccountApplication.status === applicationConstants.IN_ACTIVE).length;
        this.gridListLength = this.gridListData.length;
        this.tempGridListData = this.gridListData;
         this.commonComponent.stopSpinner();
      }else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail:  applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      this.commonComponent.stopSpinner();
    });
  }
  /**
    @author vinitha
    @implements To Enable/ Disable search filter form
   */
  onChange(){
    this.showForm = !this.showForm;
  }
}
