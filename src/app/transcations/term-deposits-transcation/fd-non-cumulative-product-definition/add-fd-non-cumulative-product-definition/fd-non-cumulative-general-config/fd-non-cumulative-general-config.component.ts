import { Component } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FdNonCumulativeProductDefinition } from '../../shared/fd-non-cumulative-product-definition.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FdNonCumulativeProductDefinitionService } from '../../shared/fd-non-cumulative-product-definition.service';
import { DatePipe } from '@angular/common';
import { BoxNumber } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-fd-non-cumulative-general-config',
  templateUrl: './fd-non-cumulative-general-config.component.html',
  styleUrls: ['./fd-non-cumulative-general-config.component.css']
})
export class FdNonCumulativeGeneralConfigComponent {
  generalconfigform: any;
  fdNonCumulativeProductDefinitionModel :FdNonCumulativeProductDefinition = new FdNonCumulativeProductDefinition();
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
    private fdNonCumulativeProductDefinitionService:FdNonCumulativeProductDefinitionService
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
      'effectiveEndDate': new FormControl('', Validators.required),
     })
   }
   /**
    @author vinitha
     @implements Fd Cummulative Configuration details 
     @argument ProductId
    @returns Fd Cummulative Configuration details  if already exist
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
          this.fdNonCumulativeProductDefinitionService.getFdNonCumulativeProductDefinitionOverviewDetailsById(id).subscribe(res => {
             this.responseModel = res;
             if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
               this.fdNonCumulativeProductDefinitionModel = this.responseModel.data[0];
               if (this.fdNonCumulativeProductDefinitionModel != null && this.fdNonCumulativeProductDefinitionModel != undefined) {
                 if(this.fdNonCumulativeProductDefinitionModel.effectiveStartDate != null && this.fdNonCumulativeProductDefinitionModel.effectiveStartDate != undefined &&this.fdNonCumulativeProductDefinitionModel.effectiveStartDate!=null&&this.fdNonCumulativeProductDefinitionModel.effectiveStartDate!= undefined){
                   this.fdNonCumulativeProductDefinitionModel.effectiveStartDate=this.datePipe.transform(this.fdNonCumulativeProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
                  
                 }
                 if(this.fdNonCumulativeProductDefinitionModel.effectiveEndDate != null && this.fdNonCumulativeProductDefinitionModel.effectiveEndDate != undefined &&this.fdNonCumulativeProductDefinitionModel.effectiveEndDate!=null&&this.fdNonCumulativeProductDefinitionModel.effectiveEndDate!= undefined){
                   this.fdNonCumulativeProductDefinitionModel.effectiveEndDate=this.datePipe.transform(this.fdNonCumulativeProductDefinitionModel.effectiveEndDate, this.orgnizationSetting.datePipe);
                  
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
     @implements Integrating Fd Cummulative Configuration details To Main Stepper Component
     @argument fdNonCumulativeProductDefinitionModel, generalconfigform.valid
    */
   updateData() {
     this.fdNonCumulativeProductDefinitionService.changeData({
       formValid: this.generalconfigform.valid && this.amountAndTenureFlag,
       data: this.fdNonCumulativeProductDefinitionModel,
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
    if (this.fdNonCumulativeProductDefinitionModel.minDepositAmount != null && this.fdNonCumulativeProductDefinitionModel.minDepositAmount != undefined
      && this.fdNonCumulativeProductDefinitionModel.maxDepositAmount != null && this.fdNonCumulativeProductDefinitionModel.maxDepositAmount != undefined) {

  if (this.fdNonCumulativeProductDefinitionModel.minDepositAmount > this.fdNonCumulativeProductDefinitionModel.maxDepositAmount) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_DEPOSIT_AMOUNT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_DEPOSIT_AMOUNT });
      this.generalconfigform.get('minDepositAmount').reset();
      this.fdNonCumulativeProductDefinitionModel.minDepositAmount = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_DEPOSIT_AMOUNT_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_DEPOSIT_AMOUNT });
      this.generalconfigform.get('maxDepositAmount').reset();
      this.fdNonCumulativeProductDefinitionModel.maxDepositAmount = null;
    }
    setTimeout(() => {
      this.msgs = [];
    }, 1500);
  }
}
this.updateData();
  }

  tenureValidation(box: any) {
    if (this.fdNonCumulativeProductDefinitionModel.minTenure != null && this.fdNonCumulativeProductDefinitionModel.minTenure != undefined
      && this.fdNonCumulativeProductDefinitionModel.maxTenure != null && this.fdNonCumulativeProductDefinitionModel.maxTenure != undefined) {

  if (Number(this.fdNonCumulativeProductDefinitionModel.minTenure)> Number(this.fdNonCumulativeProductDefinitionModel.maxTenure)) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_TENURE_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_TENURE });
      this.generalconfigform.get('minTenure').reset();
      this.fdNonCumulativeProductDefinitionModel.minTenure = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_TENURE_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_TENURE});
      this.generalconfigform.get('maxTenure').reset();
      this.fdNonCumulativeProductDefinitionModel.maxTenure = null;
    }
    setTimeout(() => {
      this.msgs = [];
    }, 1500);
  }
}
this.updateData();
  }



  dateValidation(box: any) {
    if (this.fdNonCumulativeProductDefinitionModel.effectiveStartDate != undefined && this.fdNonCumulativeProductDefinitionModel.effectiveStartDate != undefined
      && this.fdNonCumulativeProductDefinitionModel.effectiveEndDate != null && this.fdNonCumulativeProductDefinitionModel.effectiveEndDate != null) {
      let startDate = new Date(this.fdNonCumulativeProductDefinitionModel.effectiveStartDate);
      let endDate = new Date(this.fdNonCumulativeProductDefinitionModel.effectiveEndDate);     

  if (startDate > endDate) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.EFFECTIVE_START_DATE_SHOULD_BE_LESS_THAN_EFFECTIVE_END_DATE });
      this.generalconfigform.get('effectiveStartDate').reset();
      this.fdNonCumulativeProductDefinitionModel.effectiveStartDate = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.EFFECTIVE_END_DATE_SHOULD_BE_GREATER_THAN_EFFECTIVE_START_DATE });
      this.generalconfigform.get('effectiveEndDate').reset();
      this.fdNonCumulativeProductDefinitionModel.effectiveEndDate = null;
    }
    setTimeout(() => {
      this.msgs = [];
    }, 1500);
  }
}
this.updateData();
  }

}
