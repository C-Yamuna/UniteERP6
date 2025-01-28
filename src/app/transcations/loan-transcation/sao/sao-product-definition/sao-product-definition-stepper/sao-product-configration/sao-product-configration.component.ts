import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SaoCollateralConfig, SaoProductDefinition } from '../../shared/sao-product-definition.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { SaoProductDefinitionsService } from '../../shared/sao-product-definitions.service';
import { CollateralTypesService } from 'src/app/configurations/loan-config/collateral-types/shared/collateral-types.service';
import { BoxNumber } from 'src/app/transcations/common-status-data.json';
@Component({
  selector: 'app-sao-product-configration',
  templateUrl: './sao-product-configration.component.html',
  styleUrls: ['./sao-product-configration.component.css']
})
export class SaoProductConfigrationComponent {
  productionDefinitionForm: any;
  saoProductDefinitionModel :SaoProductDefinition = new SaoProductDefinition();
  saoCollateralConfigModel:SaoCollateralConfig = new SaoCollateralConfig();
  orgnizationSetting:any;
  isEdit: any;
  maxDate = new Date();
  minDate = new Date();
  responseModel!: Responsemodel;
  savedID: any;
  msgs: any[] = [];
  isSpecialSchemelist: any[] = [];
  interestPostingFrequencyList: any[] = [];
  saoProdCollateralsConfigList: any[] = [];
  selectedList: any[]=[];
  saoProductId: any;
  collaterals:any;
  statusList: any[] = [];

  selectedCollateralIds: number[] = [];
  amountAndTenureFlag: boolean = applicationConstants.TRUE;
  constructor(private formBuilder: FormBuilder,private commonComponent: CommonComponent,private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,private encryptService: EncryptDecryptService,
    private saoProductDefinitionsService : SaoProductDefinitionsService, private collateralTypesService : CollateralTypesService,
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
     'endDate': new FormControl('', Validators.required),
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
    @implements Sao Loans Configuration details 
    @argument ProductId
    @returns Sao Loans Configuration details  if already exist
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
        this.saoProductId = Number(this.encryptService.decrypt(encrypted));
          this.getPreviewDetailsByProductId(this.saoProductId);
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
    this.saoProdCollateralsConfigList=[]
    this.saoProductDefinitionsService.getPreviewDetailsByProductId(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.saoProductDefinitionModel = this.responseModel.data[0];
        if (this.saoProductDefinitionModel != null && this.saoProductDefinitionModel != undefined) {

          if(null!=this.saoProductDefinitionModel.effectiveStartDate && undefined!=this.saoProductDefinitionModel.effectiveStartDate)
            this.saoProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.saoProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          if(null!=this.saoProductDefinitionModel.endDate && undefined!=this.saoProductDefinitionModel.endDate)
            this.saoProductDefinitionModel.endDate = this.datePipe.transform(this.saoProductDefinitionModel.endDate, this.orgnizationSetting.datePipe);
          this.initializeFormWithCollaterals(this.saoProductDefinitionModel.saoProdCollateralsConfigList);
          this.productionDefinitionForm.patchValue(this.saoProductDefinitionModel);

          

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
    @implements Integrating Sao Loans Configuration details To Main Stepper Component
    @argument SaoProductDefinitionModel, productionDefinitionform.valid
   */
  updateData() {
    this.saoProductDefinitionModel.saoProductId = this.saoProductId
    this.saoProductDefinitionsService.changeData({
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
  getAllCollaterals() {
    this.msgs = [];
    this.commonComponent.startSpinner();
    this.collateralTypesService.getAllCollateralTypes().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null&& this.responseModel.data!= undefined) {
        this.saoProdCollateralsConfigList = this.responseModel.data.filter((data: any) => data.status == applicationConstants.ACTIVE).map((collateral: any) => {
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
  
    this.saoProductDefinitionModel.saoProdCollateralsConfigList = this.selectedCollateralIds.map((id: any) => ({

      saoProductId: this.saoProductId,
      collateralType: id,
      status: this.statusList[0].value, 
      statusName: this.statusList[0].label,
      collateralTypeName: this.saoProdCollateralsConfigList.find(item => item.value === id)?.label
    }));
    this.updateData();
  }
  amountValidation(box: any) {
    if (this.saoProductDefinitionModel.eligibleMInAmount != null && this.saoProductDefinitionModel.eligibleMInAmount != undefined
      && this.saoProductDefinitionModel.eligibleMaxAmount != null && this.saoProductDefinitionModel.eligibleMaxAmount != undefined) {

  if (this.saoProductDefinitionModel.eligibleMInAmount > this.saoProductDefinitionModel.eligibleMaxAmount) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_DEPOSIT_AMOUNT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_DEPOSIT_AMOUNT });
      this.productionDefinitionForm.get('eligibleMInAmount').reset();
      this.saoProductDefinitionModel.eligibleMInAmount = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_DEPOSIT_AMOUNT_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_DEPOSIT_AMOUNT });
      this.productionDefinitionForm.get('eligibleMaxAmount').reset();
      this.saoProductDefinitionModel.eligibleMaxAmount = null;
    }
    setTimeout(() => {
      this.msgs = [];
    }, 1500);
  }
}
this.updateData();
  }

  tenureValidation(box: any) {
    if (this.saoProductDefinitionModel.minLoanPeriod != null && this.saoProductDefinitionModel.minLoanPeriod != undefined && this.saoProductDefinitionModel.minLoanPeriod !=""
      && this.saoProductDefinitionModel.maxLoanPeriod != null && this.saoProductDefinitionModel.maxLoanPeriod != undefined && this.saoProductDefinitionModel.maxLoanPeriod != "") {

  if (Number(this.saoProductDefinitionModel.minLoanPeriod)> Number(this.saoProductDefinitionModel.maxLoanPeriod)) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_TENURE_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_TENURE });
      this.productionDefinitionForm.get('minLoanPeriod').reset();
      this.saoProductDefinitionModel.minLoanPeriod = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_TENURE_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_TENURE});
      this.productionDefinitionForm.get('maxLoanPeriod').reset();
      this.saoProductDefinitionModel.maxLoanPeriod = null;
    }
    setTimeout(() => {
      this.msgs = [];
    }, 1500);
  }
}
this.updateData();
  }



  dateValidation(box: any) {
    if (this.saoProductDefinitionModel.effectiveStartDate != undefined && this.saoProductDefinitionModel.effectiveStartDate != undefined
      && this.saoProductDefinitionModel.endDate != null && this.saoProductDefinitionModel.endDate != null) {
      let startDate = new Date(this.saoProductDefinitionModel.effectiveStartDate);
      let endDate = new Date(this.saoProductDefinitionModel.endDate);     

  if (startDate > endDate) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.EFFECTIVE_START_DATE_SHOULD_BE_LESS_THAN_EFFECTIVE_END_DATE });
      this.productionDefinitionForm.get('effectiveStartDate').reset();
      this.saoProductDefinitionModel.effectiveStartDate = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.EFFECTIVE_END_DATE_SHOULD_BE_GREATER_THAN_EFFECTIVE_START_DATE });
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
}
