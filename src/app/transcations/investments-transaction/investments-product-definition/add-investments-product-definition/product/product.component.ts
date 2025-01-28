import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { InvestmentsProductDefinition } from '../../shared/investments-product-definition.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TranslateService } from '@ngx-translate/core';
import { InvestmentsProductDefinitionService } from '../../shared/investments-product-definition.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { applicationConstants } from 'src/app/shared/applicationConstants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productform: any;
  investmentsProductDefinitionModel: InvestmentsProductDefinition = new InvestmentsProductDefinition();
  orgnizationSetting: any;
  isEdit: any;
  maxDate = new Date();
  minDate = new Date();
  responseModel!: Responsemodel;
  savedID: any;
  msgs: any[] = [];
  isAutoRenualList: any[] = [];

  constructor(public messageService: MessageService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonComponent: CommonComponent,
    private commonFunctionService: CommonFunctionsService,
    private translate: TranslateService,
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private investmentsProductDefinitionService: InvestmentsProductDefinitionService,
    private datePipe: DatePipe) {
    this.productform = this.formBuilder.group({
      'name': new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.required]),
      'minDepositAmount': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS), Validators.required]),
      'maxDepositAmount': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS), Validators.required]),
      'minTenure': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NEW_NUMBERS), Validators.required]),
      'maxTenure': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NEW_NUMBERS), Validators.required]),
      'isAutoRenual': new FormControl('', Validators.required),
      'effectiveStartDate': new FormControl('', Validators.required),
      'effectiveEndDate': new FormControl('', Validators.required)
    })
  }
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isAutoRenualList = this.commonComponent.requiredlist();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let queryParams = params['id'].split('#');
        let id = this.encryptDecryptService.decrypt(params['id']);

        if (id != "" && id != null && id != undefined) {
          this.isEdit = applicationConstants.TRUE;
          this.investmentsProductDefinitionService.getProductById(id).subscribe(res => {
            this.responseModel = res;
            if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
              this.investmentsProductDefinitionModel = this.responseModel.data[0];
              if (this.investmentsProductDefinitionModel != null && this.investmentsProductDefinitionModel != undefined) {
                if (this.investmentsProductDefinitionModel.effectiveStartDate != null && this.investmentsProductDefinitionModel.effectiveStartDate != undefined) {
                  this.investmentsProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.investmentsProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
                }
                if (this.investmentsProductDefinitionModel.effectiveEndDate != null && this.investmentsProductDefinitionModel.effectiveEndDate != undefined) {
                  this.investmentsProductDefinitionModel.effectiveEndDate = this.datePipe.transform(this.investmentsProductDefinitionModel.effectiveEndDate, this.orgnizationSetting.datePipe);
                }
              }
              this.commonComponent.stopSpinner();
            } else {
              this.commonComponent.stopSpinner();
              this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }

          }, error => {
            this.msgs = [];
            this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
            this.commonComponent.stopSpinner();
          });
        }
      }
    })
    this.productform.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.productform.valid) {
        this.save();
      }
    });
  }

  updateData() {
    this.investmentsProductDefinitionService.changeData({
      formValid: this.productform.valid,
      data: this.investmentsProductDefinitionModel,
      stepperIndex: 0,

    });
  }

  save() {
    this.updateData();
  }

  /**
    @author Bhargavi
    @implements effectiveStartDate and effectiveEndDate validation 
  */
  dateValidation(box: any) {
    if (this.investmentsProductDefinitionModel.effectiveStartDate != undefined && this.investmentsProductDefinitionModel.effectiveStartDate != undefined
      && this.investmentsProductDefinitionModel.effectiveEndDate != null && this.investmentsProductDefinitionModel.effectiveEndDate != null) {
      let startDate = new Date(this.investmentsProductDefinitionModel.effectiveStartDate);  
      let endDate = new Date(this.investmentsProductDefinitionModel.effectiveEndDate);     

      if (startDate > endDate) {
        this.msgs = [];
        if (box == this.investmentsProductDefinitionModel.effectiveStartDate) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.START_DATE_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_END_DATA });
          this.productform.get('effectiveStartDate').reset();
          this.investmentsProductDefinitionModel.effectiveStartDate = null;
        } else if (box == this.investmentsProductDefinitionModel.effectiveEndDate) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.END_DATE_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_START_DATE });
          this.productform.get('effectiveEndDate').reset();
          this.investmentsProductDefinitionModel.effectiveEndDate = null;
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
    @implements minDepositAmount and maxDepositAmount validation 
  */
  amountValidation(box: any) {
    if (this.investmentsProductDefinitionModel.minDepositAmount != null && this.investmentsProductDefinitionModel.minDepositAmount != undefined
      && this.investmentsProductDefinitionModel.maxDepositAmount != null && this.investmentsProductDefinitionModel.maxDepositAmount != undefined) {

      if (this.investmentsProductDefinitionModel.minDepositAmount > this.investmentsProductDefinitionModel.maxDepositAmount) {
        this.msgs = [];
        if (box == this.investmentsProductDefinitionModel.minDepositAmount) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_DEPOSIT_AMOUNT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_DEPOSIT_AMOUNT });
          this.productform.get('minDepositAmount').reset();
          this.investmentsProductDefinitionModel.minDepositAmount = null;
        } else if (box == this.investmentsProductDefinitionModel.maxDepositAmount) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_DEPOSIT_AMOUNT_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_DEPOSIT_AMOUNT });
          this.productform.get('maxDepositAmount').reset();
          this.investmentsProductDefinitionModel.maxDepositAmount = null;
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
    @implements minTenure and maxTenure validation 
  */
  tenureValidation(value:any) {
    if (this.investmentsProductDefinitionModel.minTenure != null && this.investmentsProductDefinitionModel.minTenure != undefined
      && this.investmentsProductDefinitionModel.maxTenure != null && this.investmentsProductDefinitionModel.maxTenure != undefined
      && this.investmentsProductDefinitionModel.minTenure != "" && this.investmentsProductDefinitionModel.maxTenure != "") {

      // if (this.investmentsProductDefinitionModel.minTenure > this.investmentsProductDefinitionModel.maxTenure) {
        this.msgs = [];
        if (Number(this.investmentsProductDefinitionModel.minTenure) > Number(this.investmentsProductDefinitionModel.maxTenure) && value == 1) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_TENURE_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_TENURE });
          this.productform.get('minTenure').reset();
          this.investmentsProductDefinitionModel.minTenure = null;
        } else if (Number(this.investmentsProductDefinitionModel.maxTenure) < Number(this.investmentsProductDefinitionModel.minTenure) && value == 2) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_TENURE_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_TENURE });
          this.productform.get('maxTenure').reset();
          this.investmentsProductDefinitionModel.maxTenure = null;
        }
        setTimeout(() => {
          this.msgs = [];
        }, 1500);
      // }
    }
    this.updateData();
  }
}
