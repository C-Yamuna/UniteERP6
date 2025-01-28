import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { AgentSecurityConfig } from '../shared/agent-security-config.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentSecurityConfigService } from '../shared/agent-security-config.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { AGENTDETAILSCONFIGCONSTANTS } from '../../agent-details-config-constants';

@Component({
  selector: 'app-add-agent-security-config',
  templateUrl: './add-agent-security-config.component.html',
  styleUrls: ['./add-agent-security-config.component.css']
})
export class AddAgentSecurityConfigComponent implements OnInit {

  agentSecurityConfigForm: FormGroup;
  statusList: any[] = [];
  isEdit: any;
  responseModel !: Responsemodel;
  agentSecurityConfigModel: AgentSecurityConfig = new AgentSecurityConfig();
  msgs: any[] = [];
  buttonDisabled: any;
  showHideDropdown: boolean = true;
  isSecurityDepositRequire: boolean = false;
  agentList: any[] = [];
  securityTypeList: any[]=[];
  pacsId = 1;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private agentSecurityConfigService: AgentSecurityConfigService,
    private activateRoute: ActivatedRoute,
    private commonComponent: CommonComponent,
    private encryptService: EncryptDecryptService) {

    this.agentSecurityConfigForm = this.formBuilder.group({
      'agentTypeName': new FormControl('', [Validators.required]),
      'isSecurityDepositRequire': new FormControl(''),
      'securityType': new FormControl('', [Validators.required]),
      'securityValueRequire': new FormControl(''),
      'noOfSuritiesRequire': new FormControl(''),
      'statusName': new FormControl('', [Validators.required]),
    })
  }
  ngOnInit() {
    // this.pacsId = 1;
    this.agentSecurityConfigForm.get('securityType')?.clearValidators(); 
    this.securityTypeList = this.commonComponent.securityType();
    this.agentList = this.commonComponent.agentType();
    this.statusList = this.commonComponent.status();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptService.decrypt(params['id']);
        this.isEdit = true;
        this.agentSecurityConfigService.getAgentSecurityConfigDetailsById(id).subscribe(res => {
          this.responseModel = res;
          this.commonComponent.stopSpinner();
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.agentSecurityConfigModel = this.responseModel.data[0];
            this.agentSecurityConfigForm.get('isSecurityDepositRequire')?.disable();

            if (this.agentSecurityConfigModel.isSecurityDepositRequire) {
              this.isSecurityDepositRequire = true;
              this.showHideDropdown = false;
              this.agentSecurityConfigForm.get('securityType')?.setValidators([Validators.required]);
            } else {
              this.isSecurityDepositRequire = false;
              this.showHideDropdown = true;
              this.agentSecurityConfigForm.get('securityType')?.clearValidators();
            }
            this.agentSecurityConfigForm.get('securityType')?.updateValueAndValidity();
          } else {
            this.commonComponent.stopSpinner();
            this.buttonDisabled = applicationConstants.FALSE;
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        });
      } else {
        this.isEdit = false;
        this.agentSecurityConfigModel.status = this.statusList[0].value;
      }
    });
  }

  addOrUpdate() {
    this.agentSecurityConfigModel.pacsId =this.pacsId;
    // this.pacsId = 1;
    this.commonComponent.startSpinner();
    if (this.agentSecurityConfigModel.isSecurityDepositRequire == null && this.agentSecurityConfigModel.isSecurityDepositRequire == undefined)
      this.agentSecurityConfigModel.isSecurityDepositRequire = false;
    if (this.isEdit) {
      this.agentSecurityConfigService.updateAgentSecurityConfigDetails(this.agentSecurityConfigModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.navigateToBack();
          }, 2000);
        } else {
          this.buttonDisabled = applicationConstants.FALSE;
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }, error => {
        this.buttonDisabled = applicationConstants.FALSE;
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
    } else {
      this.agentSecurityConfigService.addAgentSecurityConfigDetails(this.agentSecurityConfigModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.navigateToBack();
          }, 2000);
        } else {
          this.commonComponent.stopSpinner();
          this.buttonDisabled = applicationConstants.FALSE;
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.buttonDisabled = applicationConstants.FALSE;
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
        this.buttonDisabled = applicationConstants.FALSE;
      });
    }
  }

  onSelectCheckBox(event: any): void {
    this.isSecurityDepositRequire = event.checked;
    if (this.isSecurityDepositRequire) {
      this.agentSecurityConfigForm.get('securityType')?.setValidators([Validators.required]);
      this.showHideDropdown = false;
    } else {
      this.agentSecurityConfigForm.get('securityType')?.clearValidators();
      this.showHideDropdown = true;
    }
    this.agentSecurityConfigForm.get('securityType')?.updateValueAndValidity();
  }

  navigateToBack() {
    this.router.navigate([AGENTDETAILSCONFIGCONSTANTS.AGENT_SECURITY_CONFIG]);
  }
}
