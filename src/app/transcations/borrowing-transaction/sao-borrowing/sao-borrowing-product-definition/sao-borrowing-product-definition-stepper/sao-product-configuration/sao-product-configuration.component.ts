import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { SaoBorrowingProductDefinition } from '../../shared/sao-borrowing-product-definition.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { SaoBorrowingProductDefinitionService } from '../../shared/sao-borrowing-product-definition.service';

@Component({
  selector: 'app-sao-product-configuration',
  templateUrl: './sao-product-configuration.component.html',
  styleUrls: ['./sao-product-configuration.component.css']
})
export class SaoProductConfigurationComponent {
  productionDefinitionForm: any;
  saoProductDefinitionModel :SaoBorrowingProductDefinition = new SaoBorrowingProductDefinition();
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
  saoProductId: any;
  collaterals:any;
  statusList: any[] = [];
  borrowingTypeList: any[] = [];
  interestCalculationTypeList: any[] = [];

  constructor(private formBuilder: FormBuilder,private commonComponent: CommonComponent,private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,private encryptService: EncryptDecryptService,
    private saoBorrowingProductDefinitionService : SaoBorrowingProductDefinitionService,
    private changeDetectorRef: ChangeDetectorRef,
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
    @implements Sao Borrowings Configuration details 
    @argument ProductId
    @returns Sao Borrowings Configuration details  if already exist
   */
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isSpecialSchemelist = this.commonComponent.requiredlist();
      this.repaymentFrequencyList = this.commonComponent.rePaymentFrequency();
      this.borrowingTypeList = this.commonComponent.borrowingTypes();
      this.interestCalculationTypeList = this.commonComponent.interestCalculationType();
      this.statusList = this.commonComponent.status();
    this.activateRoute.queryParams.subscribe(params => {
      let encrypted = params['id'];
      if (encrypted!= undefined) {
        this.isEdit = applicationConstants.TRUE;
        this.saoProductId = Number(this.encryptService.decrypt(encrypted));
          this.getPreviewByProductId(this.saoProductId);
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
    this.saoBorrowingProductDefinitionService.getPreviewByProductId(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.saoProductDefinitionModel = this.responseModel.data[0];
        if (this.saoProductDefinitionModel != null && this.saoProductDefinitionModel != undefined) {

          if(null!=this.saoProductDefinitionModel.effectiveStartDate && undefined!=this.saoProductDefinitionModel.effectiveStartDate)
            this.saoProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.saoProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
 
          if(null!=this.saoProductDefinitionModel.endDate && undefined!=this.saoProductDefinitionModel.endDate)
            this.saoProductDefinitionModel.endDate = this.datePipe.transform(this.saoProductDefinitionModel.endDate, this.orgnizationSetting.datePipe);

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
    @implements Integrating Sao Borrowings Configuration details To Main Stepper Component
    @argument SaoProductDefinitionModel, productionDefinitionform.valid
   */
  updateData() {
    this.saoProductDefinitionModel.saoProductId = this.saoProductId
    this.saoBorrowingProductDefinitionService.changeData({
      formValid: this.productionDefinitionForm.valid,
      data: this.saoProductDefinitionModel,
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
    if (this.saoProductDefinitionModel.effectiveStartDate != undefined && this.saoProductDefinitionModel.effectiveStartDate != undefined
      && this.saoProductDefinitionModel.endDate != null && this.saoProductDefinitionModel.endDate != null) {
      let startDate = new Date(this.saoProductDefinitionModel.effectiveStartDate);  
      let endDate = new Date(this.saoProductDefinitionModel.endDate);     

      if (startDate > endDate) {
        this.msgs = [];
        if (box == this.saoProductDefinitionModel.effectiveStartDate) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.START_DATE_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_END_DATA });
          this.productionDefinitionForm.get('effectiveStartDate').reset();
          this.saoProductDefinitionModel.effectiveStartDate = null;
        } else if (box == this.saoProductDefinitionModel.endDate) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.END_DATE_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_START_DATE });
          this.productionDefinitionForm.get('endDate').reset();
          this.saoProductDefinitionModel.endDate = null;
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
    if (this.saoProductDefinitionModel.minAmount != null && this.saoProductDefinitionModel.minAmount != undefined
      && this.saoProductDefinitionModel.maxAmount != null && this.saoProductDefinitionModel.maxAmount != undefined) {

      if (this.saoProductDefinitionModel.minAmount > this.saoProductDefinitionModel.maxAmount) {
        this.msgs = [];
        if (box == this.saoProductDefinitionModel.minAmount) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_DEPOSIT_AMOUNT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_DEPOSIT_AMOUNT });
          this.productionDefinitionForm.get('minAmount').reset();
          this.saoProductDefinitionModel.minAmount = null;
        } else if (box == this.saoProductDefinitionModel.maxAmount) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_DEPOSIT_AMOUNT_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_DEPOSIT_AMOUNT });
          this.productionDefinitionForm.get('maxAmount').reset();
          this.saoProductDefinitionModel.maxAmount = null;
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
    if (this.saoProductDefinitionModel.minBorrowingPeriodInMonths != null && this.saoProductDefinitionModel.minBorrowingPeriodInMonths != undefined
      && this.saoProductDefinitionModel.maxBorrowingPeriodInMonths != null && this.saoProductDefinitionModel.maxBorrowingPeriodInMonths != undefined) {

      if (this.saoProductDefinitionModel.minBorrowingPeriodInMonths > this.saoProductDefinitionModel.maxBorrowingPeriodInMonths) {
        this.msgs = [];
        if (box == this.saoProductDefinitionModel.minBorrowingPeriodInMonths) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_TENURE_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_TENURE });
          this.productionDefinitionForm.get('minBorrowingPeriodInMonths').reset();
          this.saoProductDefinitionModel.minBorrowingPeriodInMonths = null;
        } else if (box == this.saoProductDefinitionModel.maxBorrowingPeriodInMonths) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_TENURE_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_TENURE });
          this.productionDefinitionForm.get('maxBorrowingPeriodInMonths').reset();
          this.saoProductDefinitionModel.maxBorrowingPeriodInMonths = null;
        }
        setTimeout(() => {
          this.msgs = [];
        }, 1500);
      }
    }
    this.updateData();
  }

  
 
}
