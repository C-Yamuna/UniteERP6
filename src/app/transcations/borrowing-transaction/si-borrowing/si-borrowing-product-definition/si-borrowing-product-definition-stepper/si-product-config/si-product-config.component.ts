import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { SiBorrowingProductDefinition } from '../../shared/si-borrowing-product-definition.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SiBorrowingProductDefinitionService } from '../../shared/si-borrowing-product-definition.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';

@Component({
  selector: 'app-si-product-config',
  templateUrl: './si-product-config.component.html',
  styleUrls: ['./si-product-config.component.css']
})
export class SiProductConfigComponent {
  productionDefinitionForm: any;
  siProductDefinitionModel :SiBorrowingProductDefinition = new SiBorrowingProductDefinition();
  orgnizationSetting:any;
  isEdit: any;
  maxDate = new Date();
  minDate = new Date();
  responseModel!: Responsemodel;
  savedID: any;
  msgs: any[] = [];
  isSpecialSchemelist: any[] = [];
  repaymentFrequencyList: any[] = [];
  selectedList: any[]=[];
  id: any;
  collaterals:any;
  statusList: any[] = [];
  borrowingTypeList: any[] = [];
  interestCalculationTypeList: any[] = [];
  linkShareCapitalList: any[] = [];

  constructor(private formBuilder: FormBuilder,private commonComponent: CommonComponent,private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,private encryptService: EncryptDecryptService,
    private siBorrowingProductDefinitionService : SiBorrowingProductDefinitionService,
    private changeDetectorRef: ChangeDetectorRef,private commonFunctionsService: CommonFunctionsService, 
  )
  { 
    this.productionDefinitionForm = this.formBuilder.group({
     'name': new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS),Validators.required]),
     'effectiveStartDate': new FormControl('', Validators.required),
     'endDate': new FormControl('', Validators.required),
     'minAmount': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS),Validators.required]),
     'maxAmount': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS),Validators.required]),
     'minBorrowingPeriodInMonths': new FormControl('',Validators.required),
     'maxBorrowingPeriodInMonths': new FormControl('', Validators.required),
     'borrowingType': new FormControl('', Validators.required),
     'borrowingSchemeType': new FormControl('',),
     'demandAlertDays': new FormControl('',),
     'interestCalculationType': new FormControl('', Validators.required),
     'repaymentFrequency': new FormControl('', Validators.required),
     'defaulterAlertDays': new FormControl('', ),
     'maxBorrowingAccountsAllowed': new FormControl('', ),
     'linkSharecapitalApplicable': new FormControl('', Validators.required),
     'institutionName': new FormControl('', ),
     'minDaysForRenewel': new FormControl(''),
     'isNpaExceptional': new FormControl('', Validators.required),
     'interestType': new FormControl(''),
     'interestCalculationFrequency': new FormControl(''),
     'isForeclosureAllowed': new FormControl('', Validators.required),
     'isGestationPeriodRequired': new FormControl('', Validators.required),
    })    
  }
  /**
    @author vinitha
    @implements Si Borrowings Configuration details 
    @argument ProductId
    @returns Si Borrowings Configuration details  if already exist
   */
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isSpecialSchemelist = this.commonComponent.requiredlist();
      this.repaymentFrequencyList = this.commonComponent.rePaymentFrequency();
      this.borrowingTypeList = this.commonComponent.borrowingTypes();
      this.interestCalculationTypeList = this.commonComponent.interestCalculationType();
      this.linkShareCapitalList =this.commonComponent.mandatoryList();
      this.statusList = this.commonComponent.status();
    this.activateRoute.queryParams.subscribe(params => {
      let encrypted = params['id'];
      if (encrypted!= undefined) {
        this.isEdit = applicationConstants.TRUE;
        this.id = Number(this.encryptService.decrypt(encrypted));
          this.getPreviewByProductId(this.id);
      } else {
        this.isEdit = applicationConstants.FALSE;
      }
      this.updateData();
    });
  
    this.productionDefinitionForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.productionDefinitionForm.valid) {
        this.save();
      }
    });
  }
  getPreviewByProductId(id: any) {
    this.isEdit = applicationConstants.TRUE;
    this.siBorrowingProductDefinitionService.getPreviewByProductId(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.siProductDefinitionModel = this.responseModel.data[0];
        if (this.siProductDefinitionModel != null && this.siProductDefinitionModel != undefined) {

          if(null!=this.siProductDefinitionModel.effectiveStartDate && undefined!=this.siProductDefinitionModel.effectiveStartDate)
            this.siProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.siProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          if(null!=this.siProductDefinitionModel.endDate && undefined!=this.siProductDefinitionModel.endDate)
            this.siProductDefinitionModel.endDate = this.datePipe.transform(this.siProductDefinitionModel.endDate, this.orgnizationSetting.datePipe);
      }
      this.updateData();
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
    @implements Integrating Si Borrowings Configuration details To Main Stepper Component
    @argument siProductDefinitionModel, productionDefinitionform.valid
   */
  updateData() {
    this.siProductDefinitionModel.id = this.id
    this.siBorrowingProductDefinitionService.changeData({
      formValid: this.productionDefinitionForm.valid,
      data: this.siProductDefinitionModel,
      stepperIndex: 0,
      
    });
  }
 
  /**
    @author vinitha
    @implements To Call update Data function to integrate data to main stepper
   */
  save() {
    this.updateData();
  }

  /**
    @author Bhargavi
    @implements effectiveStartDate and endDate validation 
  */
  dateValidation(box: any) {
    if (this.siProductDefinitionModel.effectiveStartDate != undefined && this.siProductDefinitionModel.effectiveStartDate != undefined
      && this.siProductDefinitionModel.endDate != null && this.siProductDefinitionModel.endDate != null) {
      let startDate = new Date(this.siProductDefinitionModel.effectiveStartDate);  
      let endDate = new Date(this.siProductDefinitionModel.endDate);     

      if (startDate > endDate) {
        this.msgs = [];
        if (box == this.siProductDefinitionModel.effectiveStartDate) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.START_DATE_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_END_DATA });
          this.productionDefinitionForm.get('effectiveStartDate').reset();
          this.siProductDefinitionModel.effectiveStartDate = null;
        } else if (box == this.siProductDefinitionModel.endDate) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.END_DATE_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_START_DATE });
          this.productionDefinitionForm.get('endDate').reset();
          this.siProductDefinitionModel.endDate = null;
        }
        setTimeout(() => {
          this.msgs = [];
        }, 1500);
      }
    }
    this.updateData();
  }

  /**
    @author Bhargavi
    @implements minAmount and maxAmount validation 
  */
  amountValidation(box: any) {
    if (this.siProductDefinitionModel.minAmount != null && this.siProductDefinitionModel.minAmount != undefined
      && this.siProductDefinitionModel.maxAmount != null && this.siProductDefinitionModel.maxAmount != undefined) {

      if (this.siProductDefinitionModel.minAmount > this.siProductDefinitionModel.maxAmount) {
        this.msgs = [];
        if (box == this.siProductDefinitionModel.minAmount) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_DEPOSIT_AMOUNT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_DEPOSIT_AMOUNT });
          this.productionDefinitionForm.get('minAmount').reset();
          this.siProductDefinitionModel.minAmount = null;
        } else if (box == this.siProductDefinitionModel.maxAmount) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_DEPOSIT_AMOUNT_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_DEPOSIT_AMOUNT });
          this.productionDefinitionForm.get('maxAmount').reset();
          this.siProductDefinitionModel.maxAmount = null;
        }
        setTimeout(() => {
          this.msgs = [];
        }, 1500);
      }
    }
    this.updateData();
  }

  /**
    @author Bhargavi
    @implements minBorrowingPeriodInMonths and maxBorrowingPeriodInMonths validation 
  */
  tenureValidation(box: any) {
    if (this.siProductDefinitionModel.minBorrowingPeriodInMonths != null && this.siProductDefinitionModel.minBorrowingPeriodInMonths != undefined
      && this.siProductDefinitionModel.maxBorrowingPeriodInMonths != null && this.siProductDefinitionModel.maxBorrowingPeriodInMonths != undefined) {

      if (this.siProductDefinitionModel.minBorrowingPeriodInMonths > this.siProductDefinitionModel.maxBorrowingPeriodInMonths) {
        this.msgs = [];
        if (box == this.siProductDefinitionModel.minBorrowingPeriodInMonths) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_TENURE_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_TENURE });
          this.productionDefinitionForm.get('minBorrowingPeriodInMonths').reset();
          this.siProductDefinitionModel.minBorrowingPeriodInMonths = null;
        } else if (box == this.siProductDefinitionModel.maxBorrowingPeriodInMonths) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_TENURE_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_TENURE });
          this.productionDefinitionForm.get('maxBorrowingPeriodInMonths').reset();
          this.siProductDefinitionModel.maxBorrowingPeriodInMonths = null;
        }
        setTimeout(() => {
          this.msgs = [];
        }, 1500);
      }
    }
    this.updateData();
  }
}
