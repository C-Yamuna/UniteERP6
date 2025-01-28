import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecurringDepositProductDefinition } from '../../shared/recurring-deposit-product-definition.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { ActivatedRoute } from '@angular/router';
import { RecurringDepositProductDefinitionService } from '../../shared/recurring-deposit-product-definition.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { BoxNumber } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-recurring-deposit-general-config',
  templateUrl: './recurring-deposit-general-config.component.html',
  styleUrls: ['./recurring-deposit-general-config.component.css']
})
export class RecurringDepositGeneralConfigComponent {
  generalconfigform: any;
  recurringDepositProductDefinitionModel :RecurringDepositProductDefinition = new RecurringDepositProductDefinition();
  orgnizationSetting:any;
  isEdit: any;
  maxDate = new Date();
  minDate = new Date();
  responseModel!: Responsemodel;
  savedID: any;
  msgs: any[] = [];
  isSpecialSchemelist: any[] = [];
  amountAndTenureFlag: boolean = applicationConstants.TRUE;
  constructor(private formBuilder: FormBuilder,private commonComponent: CommonComponent,private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,private encryptService: EncryptDecryptService,
    private recurringDepositProductDefinitionService : RecurringDepositProductDefinitionService,
  )
  { 
    this.generalconfigform = this.formBuilder.group({
     'name': new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS),Validators.required]),
     'isSpecialScheme': new FormControl('', Validators.required),
     'minDepositAmount': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS),Validators.required]),
     'maxDepositAmount': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS),Validators.required]),
     'minTenure': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NEW_NUMBERS),Validators.required]),
     'maxTenure': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NEW_NUMBERS),Validators.required]),
     'isAutoRenewal': new FormControl('', Validators.required),
     'effectiveStartDate': new FormControl('', Validators.required),
     'effectiveEndDate': new FormControl('', Validators.required)
    })    
  }
  /**
    @author vinitha
    @implements Recurring Deposit Configuration details 
    @argument ProductId
    @returns Recurring Deposit Configuration details  if already exist
   */
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isSpecialSchemelist = this.commonComponent.requiredlist();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let queryParams = params['id'].split('#');
        let id = this.encryptService.decrypt(params['id']);

        if (id != "" && id != null && id != undefined) {
          this.isEdit = applicationConstants.TRUE;
          this.recurringDepositProductDefinitionService.getRecurringDepositProductDefinitionOverviewDetailsById(id).subscribe(res => {
            this.responseModel = res;
            if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
              this.recurringDepositProductDefinitionModel = this.responseModel.data[0];
              if (this.recurringDepositProductDefinitionModel != null && this.recurringDepositProductDefinitionModel != undefined) {
                if(this.recurringDepositProductDefinitionModel.effectiveStartDate != null && this.recurringDepositProductDefinitionModel.effectiveStartDate != undefined ){
                  this.recurringDepositProductDefinitionModel.effectiveStartDate=this.datePipe.transform(this.recurringDepositProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
                 
                }
                if(this.recurringDepositProductDefinitionModel.effectiveEndDate != null && this.recurringDepositProductDefinitionModel.effectiveEndDate != undefined ){
                  this.recurringDepositProductDefinitionModel.effectiveEndDate=this.datePipe.transform(this.recurringDepositProductDefinitionModel.effectiveEndDate, this.orgnizationSetting.datePipe);
                 
                }
              }
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
      } 
    })
    this.generalconfigform.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.generalconfigform.valid) {
        this.save();
      }
    });
  }

  /**
    @author vinitha
    @implements Integrating Recurring Deposit Configuration details To Main Stepper Component
    @argument RecurringDepositProductDefinitionModel, generalconfigform.valid
   */
  updateData() {
    this.recurringDepositProductDefinitionService.changeData({
      formValid: this.generalconfigform.valid && this.amountAndTenureFlag,
      data: this.recurringDepositProductDefinitionModel,
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

  amountValidation(box: any) {
    if (this.recurringDepositProductDefinitionModel.minDepositAmount != null && this.recurringDepositProductDefinitionModel.minDepositAmount != undefined
      && this.recurringDepositProductDefinitionModel.maxDepositAmount != null && this.recurringDepositProductDefinitionModel.maxDepositAmount != undefined) {

  if (this.recurringDepositProductDefinitionModel.minDepositAmount > this.recurringDepositProductDefinitionModel.maxDepositAmount) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_DEPOSIT_AMOUNT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_DEPOSIT_AMOUNT });
      this.generalconfigform.get('minDepositAmount').reset();
      this.recurringDepositProductDefinitionModel.minDepositAmount = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_DEPOSIT_AMOUNT_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_DEPOSIT_AMOUNT });
      this.generalconfigform.get('maxDepositAmount').reset();
      this.recurringDepositProductDefinitionModel.maxDepositAmount = null;
    }
    setTimeout(() => {
      this.msgs = [];
    }, 1500);
  }
}
this.updateData();
  }

  tenureValidation(box: any) {
    if (this.recurringDepositProductDefinitionModel.minTenure != null && this.recurringDepositProductDefinitionModel.minTenure != undefined
      && this.recurringDepositProductDefinitionModel.maxTenure != null && this.recurringDepositProductDefinitionModel.maxTenure != undefined) {

  if (Number(this.recurringDepositProductDefinitionModel.minTenure) > Number(this.recurringDepositProductDefinitionModel.maxTenure)) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_TENURE_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_TENURE });
      this.generalconfigform.get('minTenure').reset();
      this.recurringDepositProductDefinitionModel.minTenure = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_TENURE_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_TENURE});
      this.generalconfigform.get('maxTenure').reset();
      this.recurringDepositProductDefinitionModel.maxTenure = null;
    }
    setTimeout(() => {
      this.msgs = [];
    }, 1500);
  }
}
this.updateData();
  }



  dateValidation(box: any) {
    if (this.recurringDepositProductDefinitionModel.effectiveStartDate != undefined && this.recurringDepositProductDefinitionModel.effectiveStartDate != undefined
      && this.recurringDepositProductDefinitionModel.effectiveEndDate != null && this.recurringDepositProductDefinitionModel.effectiveEndDate != null) {
      let startDate = new Date(this.recurringDepositProductDefinitionModel.effectiveStartDate);
      let endDate = new Date(this.recurringDepositProductDefinitionModel.effectiveEndDate);     

  if (startDate > endDate) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.EFFECTIVE_START_DATE_SHOULD_BE_LESS_THAN_EFFECTIVE_END_DATE });
      this.generalconfigform.get('effectiveStartDate').reset();
      this.recurringDepositProductDefinitionModel.effectiveStartDate = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.EFFECTIVE_END_DATE_SHOULD_BE_GREATER_THAN_EFFECTIVE_START_DATE });
      this.generalconfigform.get('effectiveEndDate').reset();
      this.recurringDepositProductDefinitionModel.effectiveEndDate = null;
    }
    setTimeout(() => {
      this.msgs = [];
    }, 1500);
  }
}
this.updateData();
  }
}
