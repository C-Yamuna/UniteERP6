import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Table } from "primeng/table";
import { applicationConstants } from "src/app/shared/applicationConstants";
import { CommonComponent } from "src/app/shared/common.component";
import { EncryptDecryptService } from "src/app/shared/encrypt-decrypt.service";
import { Responsemodel } from "src/app/shared/responsemodel";
import { AgentDetailsTransactionService } from "../../shared/agent-details-transaction.service";
import { AgentDetails } from "../basic-details/shared/basic-details.model";
import { Security, Surity } from "./shared/security-surety.model";
import { SecuritySuretyService } from "./shared/security-surety.service";
import { ERP_TRANSACTION_CONSTANTS } from "src/app/transcations/erp-transaction-constants";
import { FileUpload } from "primeng/fileupload";
import { AgentDetailsTransactionConstant } from "../../agent-details-transaction-constants";
import { MembershipBasicDetailsService } from "../membership-basic-details/shared/membership-basic-details.service";
import { MembershipBasicDetails } from "../membership-basic-details/shared/membership-basic-details";
import { DatePipe } from "@angular/common";
import { FileUploadService } from "src/app/shared/file-upload.service";
import { FileUploadModel } from "src/app/layout/mainmenu/shared/file-upload-model.model";


@Component({
  selector: 'app-security-surety',
  templateUrl: './security-surety.component.html',
  styleUrls: ['./security-surety.component.css']
})
export class SecuritySuretyComponent implements OnInit {
  @ViewChild('dt', { static: false })
  private dt!: Table;

  securityForm: FormGroup;
  surityForm: FormGroup;
  securityDetails: any;
  tempSecurity: any;
  checked: any;
  addButton: boolean = false;
  security: any;
  securityModel: Security = new Security();
  surityModel: Surity = new Surity();
  agentDetailsModel: AgentDetails = new AgentDetails();
  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  responseModel!: Responsemodel;
  msgs: any[] = [];
  isEdit: boolean = false;
  buttonDisabled: boolean = false;
  agentId: any;
  securityDetailsList: any[] = [];
  surityDetailsList: any[] =[];
  tempSurityDetailsList: any[] = [];
  row: any;
  columns: any[] = [];
  showForm: boolean = false;
  docFilesList: any[] = [];
  uploadFileData: any;
  securityType: any[] = [];
  depositMembersList: any[] = [];
  orgnizationSetting: any;
  showSurityList: boolean = false;
  selectedAdmissionNumbers: any[] = [];
  admissionNumber: any;
  isFileUploaded: boolean = false;
  multipleFilesList: any[] = [];
  showSecurityDetailsList: boolean = false;
  newRow: any= null;
  editDeleteDisable: boolean = false;
  editDisable:boolean = false;
  deleteId: any;
  displayDialog: boolean = false;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private encryptDecryptService: EncryptDecryptService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private membershipBasicDetailsService: MembershipBasicDetailsService,
    private agentDetailsService: AgentDetailsTransactionService,
    private fileUploadService :FileUploadService,
    private securitySuretyService: SecuritySuretyService) {

    this.securityForm = this.formBuilder.group({
      'securityType': new FormControl(''),
      'securityDepositAccountNumber': new FormControl(''),
      'securityValue': new FormControl(''),
      'securityAssetDocCopyPath': new FormControl('')
    });

    this.surityForm = this.formBuilder.group({
      'surityPersonAdminssionNumber': new FormControl(''),
      'surityCopyPath': new FormControl(''),
      'status': new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        this.agentId = Number(this.encryptDecryptService.decrypt(params['id']));
        this.isEdit = true;
        // this.getAgentDetailsById();
        this.getSecurityDetailsByAgentId(this.agentId);
        this.getSurityDetailsByAgentId(this.agentId);
      } else {
        this.isEdit = false;
      }
    })
    this.securityForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.securityForm.valid) {
        this.save();
      }
    });
    this.getAgentDetailsById();
    this.getDepositAccountMembers();

    this.securityType = [
      { label: 'FD', value: 1 },
      { label: 'FD Non-Cummaltive', value: 2 },
      { label: 'RD', value: 3 },
    ];
  }
  updateData() {
    this.surityModel.surityDetailsList = this.surityDetailsList;
    this.agentDetailsService.changeData({
      formValid: this.surityForm.valid ? true : false,
      data: this.surityModel,
      isDisable: (!this.surityForm.valid),
      stepperIndex: 4,
      // isDisable: this.uploadFilePathRequire,
    });
  }

  save() {
    this.updateData();
  }

  getAgentDetailsById() {
    this.securityDetailsList = [];
    this.agentDetailsService.getAgentDetailsById(this.agentId).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.agentDetailsModel = this.responseModel.data[0];
        if (this.agentDetailsModel != null && this.agentDetailsModel.agentSecurityList != null && this.agentDetailsModel.agentSecurityList.length > 0) {
          this.securityDetailsList = this.agentDetailsModel.agentSecurityList;
        }
        this.securityDetailsList = this.securityDetailsList.map((agent:any) =>{
          if(agent.securityAssetDocCopyPath != null && agent.securityAssetDocCopyPath != undefined)
            agent.multipleFilesList = this.fileUploadService.getFile(agent.securityAssetDocCopyPath ,ERP_TRANSACTION_CONSTANTS.AGENTDETAILS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + agent.securityAssetDocCopyPath);
          return agent;
        });
        
        // this.getTermDepositMemberDetailsByAdmissionNumber(this.agentDetailsModel.admissionNumber);
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      } else {
        this.commonComponent.stopSpinner();
        this.buttonDisabled = applicationConstants.FALSE;
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    });
  }
  getSecurityDetailsByAgentId(agentId: any) {
    this.securitySuretyService.getSecurityDetailsByAgentId(agentId).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.agentDetailsModel = this.responseModel.data;
        this.addButton = false;
        this.editDeleteDisable = false;
        this.editDisable = false;
        this.securityDetailsList = this.agentDetailsModel.agentSecurityList.map((agent:any) =>{
          if(agent.securityAssetDocCopyPath != null && agent.securityAssetDocCopyPath != undefined)
            agent.multipleFilesList = this.fileUploadService.getFile(agent.securityAssetDocCopyPath ,ERP_TRANSACTION_CONSTANTS.AGENTDETAILS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + agent.securityAssetDocCopyPath);
          return agent;
        });
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      } else {
        this.commonComponent.stopSpinner();
        this.buttonDisabled = applicationConstants.FALSE;
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
    }
    });
  }

  addOrUpdateSecurityDetails(securityModel: any) {
    securityModel.agentId = this.agentId;
    if (securityModel.id != undefined) {
      this.securitySuretyService.updateSecurityDetails(securityModel).subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.addButton = false;
          this.editDeleteDisable = false;
          this.editDisable = false;
          this.getAgentDetailsById();
          // this.securityDetailsList.unshift(this.responseModel.data[0]);
          // this.securityDetailsList.splice(1, 1);
          this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        } else {
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }, error => {
        this.msgs = [{ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      })
    } else {
      this.securitySuretyService.addSecurityDetails(securityModel).subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.addButton = false;
          this.editDeleteDisable = false;
          this.editDisable = false;
          this.getAgentDetailsById();
          this.securityDetailsList.unshift(this.responseModel.data[0]);
          this.securityDetailsList.splice(1, 1);
          this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        } else {
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }, error => {
        this.msgs = [({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST })];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      })
    }
  }

  addSecurity() {
    this.addNewEntry();
    this.addButton = true;
    this.editDeleteDisable = applicationConstants.TRUE;
    this.editDisable = applicationConstants.TRUE;
    this.dt._first = 0;
    this.dt.value.unshift({ securityType: '', });
    this.dt.initRowEdit(this.dt.value[0]);
  
  }
  
  addNewEntry() {
    this.newRow = {securityType: '' }
  }

  editSecurity(row: any) {
    this.editDeleteDisable = true;
    this.editDisable = true;
    this.addButton = true;
  }

  submit() {
    this.securitySuretyService.deleteSecurityDetails(this.deleteId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.displayDialog = false;
        this.addButton = false;
        this.editDeleteDisable = false;
        this.editDisable = false;  
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
          //this.getSecurityDetailsByAgentId(this.agentId);
          this.getAgentDetailsById()
        }, 1000);
      }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });

  }
  deleteSecurityDetails(rowData: any) {
    this.displayDialog = true;
    this.deleteId = rowData.id;
    this.updateData();
    
  }
  
  cancel() {
    this.displayDialog = false;
  }

  cancelSecurityDetails() {
    this.addButton=applicationConstants.FALSE;
    this.editDeleteDisable = applicationConstants.FALSE;
    this.editDisable = applicationConstants.FALSE;
    this.getAgentDetailsById()
    const index = this.dt.value.indexOf(this.newRow);
    if (index > -1) {
      this.dt.value.splice(index, 1);
    }
    this.addNewEntry();
    this.updateData();
  }

  onChange() {
    this.showForm = !this.showForm;
  }

  fileUploader(event: any, fileUpload: FileUpload,rowData: any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.securityModel.multipleFilesList = [];
    this.multipleFilesList = [];
    this.securityModel.filesDTO = null; // Initialize as a single object
    this.securityModel.securityAssetDocCopyPath = null;
    let file = event.files[0]; // Only one file
    let reader = new FileReader();
    reader.onloadend = (e) => {
      let filesDTO = new FileUploadModel();
      this.uploadFileData = e.target as FileReader;
      filesDTO.fileName = "AGENT_DETAILS" + this.agentId + "_" + this.commonComponent.getTimeStamp() + "_" + file.name;
      filesDTO.fileType = file.type.split('/')[1];
      filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
      filesDTO.imageValue = this.uploadFileData.result as string;
      rowData.multipleFilesList = this.multipleFilesList;
      rowData.filesDTO = filesDTO;
      rowData.securityAssetDocCopyPath = filesDTO.fileName;
      let index1 = event.files.indexOf(file);
      if (index1 > -1) {
        fileUpload.remove(event, index1);
      }
      fileUpload.clear();
    };
    reader.readAsDataURL(file);
  }

  fileRemoveEvent() {
    this.securityModel.securityAssetDocCopyPath = null;
    this.securityModel.filesDTO = null;
    this.securityModel.multipleFilesList = [];
  }

  getSurityDetailsByAgentId(agentId: any) {
    this.securitySuretyService.getSurityDetailsByAgentId(agentId).subscribe(res => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined &&
        this.responseModel.data != null && this.responseModel.data != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.agentDetailsModel = this.responseModel.data[0];
            if (this.agentDetailsModel.admissionNumber != null && this.agentDetailsModel.admissionNumber != undefined)
              this.admissionNumber = this.agentDetailsModel.admissionNumber;
            if (this.agentDetailsModel.agentSurityDetailsList != null &&
              this.agentDetailsModel.agentSurityDetailsList != undefined) {
              this.surityDetailsList = this.agentDetailsModel.agentSurityDetailsList;
              this.surityDetailsList = this.surityDetailsList.map((agent:any) =>{
                if(agent.securityAssetDocCopyPath != null && agent.securityAssetDocCopyPath != undefined)
                  agent.multipleFilesList = this.fileUploadService.getFile(agent.securityAssetDocCopyPath ,ERP_TRANSACTION_CONSTANTS.AGENTDETAILS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + agent.securityAssetDocCopyPath);
                return agent;
              });
              
              this.showSurityList = true;
            }
            else{
              this.showSurityList = false;
            }
          }
        } else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }
    });
  }

  OnChangeAdmissionNumber(event: any) {
    this.selectedAdmissionNumbers;
    let admissionNumber = event.itemValue.value;
    if (event.originalEvent.selected) {
      this.surityDetailsList = this.surityDetailsList.filter((obj: any) => obj.admissionNumber != admissionNumber).map(obj => {
        return obj;
      });
    } else {
      this.getMemberDetailsByAdmissionNumber(admissionNumber);
    }
  }

  onRemoveItem(event: any) {
    this.OnChangeAdmissionNumber(event);
  }

  //method for list of deposit members @bhargavi
  getDepositAccountMembers() {
    // this.commonComponent.startSpinner();
    this.membershipBasicDetailsService.getAllDepositAccountMembers().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.depositMembersList = this.responseModel.data;
        this.depositMembersList = this.depositMembersList.filter((MembersData: any) => MembersData != null).map((Members: { admissionNumber: any; id: any; }) => {
          return { label: Members.admissionNumber, value: Members.admissionNumber };
        });
        //this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1000);
      } else {
        // this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      //this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }

  //method for deposit members details by admission number @bhargavi
  getMemberDetailsByAdmissionNumber(admissionNumber: any) {
    this.membershipBasicDetailsService.getMemberDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicDetailsModel = this.responseModel.data[0];
          this.membershipBasicDetailsModel.id = null;
          this.showSurityList = true;
          this.surityDetailsList.push(this.membershipBasicDetailsModel);
          this.updateData();
        }
      } else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

}