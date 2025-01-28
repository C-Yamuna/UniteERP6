import { ChangeDetectorRef, Component } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';

import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CollateralTypesService } from 'src/app/configurations/loan-config/collateral-types/shared/collateral-types.service';
import { TermLoanProductDefinitionService } from '../../shared/term-loan-product-definition.service';
import { TermLoanProductDefinition } from '../../shared/term-loan-product-definition.model';
import { BoxNumber } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-term-loan-product-configuration',
  templateUrl: './term-loan-product-configuration.component.html',
  styleUrls: ['./term-loan-product-configuration.component.css']
})
export class TermLoanProductConfigurationComponent {
  productionDefinitionForm: any;
  termLoanProductDefinitionModel :TermLoanProductDefinition = new TermLoanProductDefinition();
  orgnizationSetting:any;
  isEdit: any;
  maxDate = new Date();
  minDate = new Date();
  responseModel!: Responsemodel;
  savedID: any;
  msgs: any[] = [];
  isSpecialSchemelist: any[] = [];
  interestPostingFrequencyList: any[] = [];
  termProdCollateralsConfigList: any[] = [];
  selectedList: any[]=[];
  termProductId: any;
  collaterals:any;
  statusList: any[] = [];

  selectedCollateralIds: number[] = [];
  amountAndTenureFlag: boolean = applicationConstants.TRUE;
  constructor(private formBuilder: FormBuilder,private commonComponent: CommonComponent,private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,private encryptService: EncryptDecryptService,
    private termLoanProductDefinitionService : TermLoanProductDefinitionService, private collateralTypesService : CollateralTypesService,
    private changeDetectorRef: ChangeDetectorRef,
  )
  { 
    this.productionDefinitionForm = this.formBuilder.group({
     'name': new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS),Validators.required]),
     'eligibleMInAmount': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS),Validators.required]),
     'eligibleMaxAmount': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS),Validators.required]),
     'minLoanPeriod': new FormControl('',Validators.required),
     'maxLoanPeriod': new FormControl('', Validators.required),
     'effectiveStartDate': new FormControl('', Validators.required),
     'endDate':new FormControl('', Validators.required),
     'demandAlertDays': new FormControl('',),
     'defaulterAlertDays': new FormControl('', ),
     'maxLoanAccountsAllowed': new FormControl('', ),
     'loanLinkedshareCapitalApplicable': new FormControl('', Validators.required),
     'noOfGuarantorsRequired': new FormControl('', ),
     'isInsuranceAppicable': new FormControl('', Validators.required),
     'minDaysForRenewel': new FormControl('', Validators.required),
     'interestPostingFrequency': new FormControl('', Validators.required),
     'nomineeRequired': new FormControl('', Validators.required),
     'collateraltypes': new FormControl('',),
    })    
  }
  /**
    @author vinitha
    @implements Term Loans Configuration details 
    @argument ProductId
    @returns Term Loans Configuration details  if already exist
   */
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isSpecialSchemelist = this.commonComponent.requiredlist();
      this.interestPostingFrequencyList = this.commonComponent.rePaymentFrequency();
      this.statusList = this.commonComponent.status();
    this.activateRoute.queryParams.subscribe(params => {
      let encrypted = params['id'];
      if (encrypted!= undefined) {
        this.isEdit = applicationConstants.TRUE;
        this.termProductId = Number(this.encryptService.decrypt(encrypted));
          this.getPreviewDetailsByProductId(this.termProductId);
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
    this.getAllCollaterals();
  }
  getPreviewDetailsByProductId(id: any) {
    this.isEdit = applicationConstants.TRUE;
    this.termProdCollateralsConfigList=[]
    this.termLoanProductDefinitionService.getPreviewDetailsByProductId(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.termLoanProductDefinitionModel = this.responseModel.data[0];
        if (this.termLoanProductDefinitionModel != null && this.termLoanProductDefinitionModel != undefined) {

          if(null!=this.termLoanProductDefinitionModel.effectiveStartDate && undefined!=this.termLoanProductDefinitionModel.effectiveStartDate)
            this.termLoanProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.termLoanProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
          
          if(null!=this.termLoanProductDefinitionModel.endDate && undefined!=this.termLoanProductDefinitionModel.endDate)
            this.termLoanProductDefinitionModel.endDate = this.datePipe.transform(this.termLoanProductDefinitionModel.endDate, this.orgnizationSetting.datePipe);
          this.initializeFormWithCollaterals(this.termLoanProductDefinitionModel.termProdCollateralsConfigList);
          this.productionDefinitionForm.patchValue(this.termLoanProductDefinitionModel);
          


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
    @implements Integrating Term Loans Configuration details To Main Stepper Component
    @argument termLoanProductDefinitionModel, productionDefinitionform.valid
   */
  updateData() {
    this.termLoanProductDefinitionModel.termProductId = this.termProductId
    this.termLoanProductDefinitionService.changeData({
      formValid: this.productionDefinitionForm.valid&& this.amountAndTenureFlag,
      data: this.termLoanProductDefinitionModel,
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
  getAllCollaterals() {
    this.msgs = [];
    this.commonComponent.startSpinner();
    this.collateralTypesService.getAllCollateralTypes().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null&& this.responseModel.data!= undefined) {
        this.termProdCollateralsConfigList = this.responseModel.data.filter((data: any) => data.status == applicationConstants.ACTIVE).map((collateral: any) => {
          return { label: collateral.name, value: collateral.id }
      });
      this.commonComponent.stopSpinner();
    }
    else {
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
      this.commonComponent.stopSpinner();
    });
  }
  initializeFormWithCollaterals(collaterals: any[]) {
    this.selectedCollateralIds =collaterals.filter((data: any) => data.status == applicationConstants.ACTIVE).map((collateral: any) => collateral.collateralType);
  
    this.productionDefinitionForm.get('collateraltypes')?.setValue(this.selectedCollateralIds);
  }

  onCollateralChange(event: any) {
    const newlySelectedIds = event.value;
    this.selectedCollateralIds = newlySelectedIds;
    this.productionDefinitionForm.get('collateraltypes')?.setValue(this.selectedCollateralIds);
  
    this.termLoanProductDefinitionModel.termProdCollateralsConfigList = this.selectedCollateralIds.map((id: any) => ({
      termProductId: this.termProductId,
      collateralType: id,
      status: this.statusList[0].value, 
      statusName: this.statusList[0].label,
      collateralTypeName: this.termProdCollateralsConfigList.find(item => item.value === id)?.label
    }));
    this.updateData();
  }

 
  amountValidation(box: any) {
    if (this.termLoanProductDefinitionModel.eligibleMInAmount != null && this.termLoanProductDefinitionModel.eligibleMInAmount != undefined
      && this.termLoanProductDefinitionModel.eligibleMaxAmount != null && this.termLoanProductDefinitionModel.eligibleMaxAmount != undefined) {

  if (this.termLoanProductDefinitionModel.eligibleMInAmount > this.termLoanProductDefinitionModel.eligibleMaxAmount) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_DEPOSIT_AMOUNT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_DEPOSIT_AMOUNT });
      this.productionDefinitionForm.get('eligibleMInAmount').reset();
      this.termLoanProductDefinitionModel.eligibleMInAmount = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_DEPOSIT_AMOUNT_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_DEPOSIT_AMOUNT });
      this.productionDefinitionForm.get('eligibleMaxAmount').reset();
      this.termLoanProductDefinitionModel.eligibleMaxAmount = null;
    }
    setTimeout(() => {
      this.msgs = [];
    }, 1500);
  }
}
this.updateData();
  }

  tenureValidation(box: any) {
    if (this.termLoanProductDefinitionModel.minLoanPeriod != null && this.termLoanProductDefinitionModel.minLoanPeriod != undefined
      && this.termLoanProductDefinitionModel.maxLoanPeriod != null && this.termLoanProductDefinitionModel.maxLoanPeriod != undefined) {

  if (Number(this.termLoanProductDefinitionModel.minLoanPeriod) > Number(this.termLoanProductDefinitionModel.maxLoanPeriod)) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_TENURE_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_TENURE });
      this.productionDefinitionForm.get('minLoanPeriod').reset();
      this.termLoanProductDefinitionModel.minLoanPeriod = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_TENURE_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_TENURE});
      this.productionDefinitionForm.get('maxLoanPeriod').reset();
      this.termLoanProductDefinitionModel.maxLoanPeriod = null;
    }
    setTimeout(() => {
      this.msgs = [];
    }, 1500);
  }
}
this.updateData();
  }



  dateValidation(box: any) {
    if (this.termLoanProductDefinitionModel.effectiveStartDate != undefined && this.termLoanProductDefinitionModel.effectiveStartDate != undefined
      && this.termLoanProductDefinitionModel.endDate != null && this.termLoanProductDefinitionModel.endDate != null) {
      let startDate = new Date(this.termLoanProductDefinitionModel.effectiveStartDate);
      let endDate = new Date(this.termLoanProductDefinitionModel.endDate);     

  if (startDate > endDate) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.EFFECTIVE_START_DATE_SHOULD_BE_LESS_THAN_EFFECTIVE_END_DATE });
      this.productionDefinitionForm.get('effectiveStartDate').reset();
      this.termLoanProductDefinitionModel.effectiveStartDate = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.EFFECTIVE_END_DATE_SHOULD_BE_GREATER_THAN_EFFECTIVE_START_DATE });
      this.productionDefinitionForm.get('endDate').reset();
      this.termLoanProductDefinitionModel.endDate = null;
    }
    setTimeout(() => {
      this.msgs = [];
    }, 1500);
  }
}
this.updateData();
  }
}
