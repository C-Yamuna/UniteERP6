import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CiLoanApplicationService } from '../ci-product-details/shared/ci-loan-application.service';
import { CiLoanDocumentsDetailsService } from './shared/ci-loan-documents-details.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../ci-membership-details/shared/membership-details.model';
import { CiLoanDocumentsDetails } from './shared/ci-loan-documents-details.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CiLoanApplication } from '../ci-product-details/shared/ci-loan-application.model';

@Component({
  selector: 'app-ci-loan-documents',
  templateUrl: './ci-loan-documents.component.html',
  styleUrls: ['./ci-loan-documents.component.css']
})
export class CiLoanDocumentsComponent {
  @ViewChild('document', { static: false }) private document!: Table;

  ciDocumentDetailsForm: FormGroup;
  maritalstatus: any[] | undefined;
  checked: boolean = false;
  responseModel!: Responsemodel;
  productsList: any[] = [];
  operationTypesList: any[] = [];
  schemeTypesList: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  isMemberCreation: boolean = false;

  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication();
  ciLoanDocumentsDetailsModel: CiLoanDocumentsDetails = new CiLoanDocumentsDetails();

  memberTypeName: any;
  ciLoanApplicationId: any;
  isEdit: boolean = false;
  admissionNumber: any;
  visible: boolean = false;
  isFormValid: Boolean = false;
  addButton: boolean = false;
  newRow: any;
  EditDeleteDisable: boolean = false;
  documentDetails: any[] = [];
  addButtonService: boolean = false;
  editDeleteDisable: boolean = false;
  showForm: any;
  documentsData: any[] = [];
  buttonDisabled: boolean = false;
  uploadFlag: boolean = false;
  editIndex: any;
  deleteId: any;
  kyc: any;
  accountType: any;
  applicationType: any;
  minBalence: any;
  accountOpeningDateVal: any;
  documentTypeList: any[] = [];
  fileName: any;
  documentModelList: any[] = [];
  uploadFileData: any;
  isFileUploaded: boolean = false;
  submitFlag: boolean = false;
  displayPosition: boolean = false;
  documentNameList: any[] = [];
  position: any;
  filesList: any[] = [];
  memberId: any;
  typeFlag: boolean = false;
  addKycButton: boolean = false;
  addDocumentOfKycFalg: boolean = false;
  editDocumentOfKycFalg: boolean = false;
  veiwCardHide: boolean = false;
  afterEditCancleFalg: boolean = false;
  editButtonDisable: boolean = false;
  multipleFilesList: any[] = [];
  filesDTOList: any[] = [];
  productName: any;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  memberTypeId: any;
  displayDialog: boolean = false;

  constructor(private router: Router, 
    private formBuilder: FormBuilder,
    private translate: TranslateService, 
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, 
    private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private commonFunction: CommonFunctionsService,
    private activateRoute: ActivatedRoute,
    private ciLoanApplicationService: CiLoanApplicationService,
    private ciLoanDocumentsDetailsService: CiLoanDocumentsDetailsService,
    private fileUploadService: FileUploadService) {

    this.ciDocumentDetailsForm = this.formBuilder.group({
      documentType: new FormControl('', Validators.required),
      documentNo: new FormControl('', Validators.required),
      fileUpload: new FormControl(''),
    })
  }

  ngOnInit(): void {

    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');

    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    this.getAllDocumentTypes();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        let queryParams = this.encryptDecryptService.decrypt(params['id']);
        this.ciLoanApplicationId = Number(queryParams);
        this.getCiLoanApplicationsById(this.ciLoanApplicationId);
        this.isEdit = true;

      } else {
        this.isEdit = false;
      }
    });
    this.buttonDisabled = false;
    this.columns = [
      { field: 'documentType', header: 'MEMBERSHIP.DOCUMENT_NAME' },
      { field: 'documentNo', header: 'MEMBERSHIP.DOCUMENT_NUMBER' },
      { field: 'filePath', header: 'MEMBERSHIP.DOCUMENT' }
    ];

    this.updateData();
  }

  getAllDocumentTypes() {
    this.ciLoanDocumentsDetailsService.getAllDocuments().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.ciLoanDocumentsDetailsModel.multipartFileList = [];
    this.ciLoanDocumentsDetailsModel.filesDTOList = [];
    this.ciLoanDocumentsDetailsModel.filePath = null;
    let files: FileUploadModel = new FileUploadModel();
    for (let file of event.files) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileName = file.name;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;

        let index = this.multipleFilesList.findIndex(x => x.fileName == files.fileName);
        if (index === -1) {
          this.multipleFilesList.push(files);
          this.ciLoanDocumentsDetailsModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.ciLoanDocumentsDetailsModel.filesDTOList[0].fileName = "CI_LOAN_DOCUMENT_" + this.ciLoanApplicationId + "_" + timeStamp + "_" + file.name;
        this.ciLoanDocumentsDetailsModel.filePath = "CI_LOAN_DOCUMENT_" + this.ciLoanApplicationId + "_" + timeStamp + "_" + file.name; // This will set the last file's name as filePath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }


  save() {
    this.updateData();
  }

  updateData() {
    this.ciLoanDocumentsDetailsModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciLoanDocumentsDetailsModel.admissionNumber = this.admissionNumber;
    this.ciLoanDocumentsDetailsModel.memberTypeName = this.memberTypeName;
    this.ciLoanDocumentsDetailsModel.memberType = this.memberTypeId;
    this.ciLoanDocumentsDetailsModel.memberId = this.memberId;
    this.ciLoanApplicationService.changeData({
      formValid: this.ciDocumentDetailsForm.valid,
      data: this.ciLoanDocumentsDetailsModel,
      isDisable: this.buttonDisabled,
      stepperIndex: 8,
    });
  }

  delete(rowDataId: any) {
    this.ciLoanDocumentsDetailsService.deleteCiLoanDocumentsDetails(rowDataId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.documentModelList = this.responseModel.data;
        this.getCiLoanDocumentsDetailsByApplicationId(this.ciLoanApplicationId);
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.data.statusMsg }];
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

  getCiLoanDocumentsDetailsByApplicationId(ciLoanApplicationId: any) {
    this.ciLoanDocumentsDetailsService.getCiLoanDocumentsDetailsByApplicationId(ciLoanApplicationId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.documentModelList = this.responseModel.data;
            if (this.documentModelList != null && this.documentModelList != undefined) {
              this.editDocumentOfKycFalg = true;
              for (let document of this.documentModelList) {
                if (document.filePath != null && document.filePath != undefined) {
                  if (document.filePath != null && document.filePath != undefined) {
                    document.multipartFileList = this.fileUploadService.getFile(document.filePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.filePath);

                  }
                }
              }
            }
            this.buttonDisabled = false;
          }
        }
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  saveDocument(row: any) {
    this.ciLoanDocumentsDetailsModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciLoanDocumentsDetailsModel.admissionNumber = this.admissionNumber;
    this.ciLoanDocumentsDetailsModel.memberTypeName = this.memberTypeName;
    this.ciLoanDocumentsDetailsModel.memberType = this.memberTypeId;
    this.ciLoanDocumentsDetailsModel.memberId = this.memberId;
    this.ciLoanDocumentsDetailsModel.status = applicationConstants.ACTIVE;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.ciLoanDocumentsDetailsModel.documentType);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.ciLoanDocumentsDetailsModel.documentTypeName = filteredObj.label;
      }
    }
    this.ciLoanDocumentsDetailsService.addCiLoanDocumentsDetails(this.ciLoanDocumentsDetailsModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.ciLoanDocumentsDetailsModel = this.responseModel.data[0];
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
      } else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      this.addKycButton = false;
      this.buttonDisabled = false;
      this.getCiLoanDocumentsDetailsByApplicationId(this.ciLoanApplicationId);
      this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
    this.addDocumentOfKycFalg = false;
    this.editButtonDisable = false;
  }

  getCiLoanApplicationsById(id: any) {
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciLoanApplicationModel = this.responseModel.data[0];
            if (this.responseModel.data[0].accountOpenDate != null && this.responseModel.data[0].accountOpenDate != undefined) {
              this.accountOpeningDateVal = this.datePipe.transform(this.responseModel.data[0].accountOpenDate, this.orgnizationSetting.datePipe);
            }
            if (this.responseModel.data[0].productName != null && this.responseModel.data[0].productName != undefined) {
              this.productName = this.responseModel.data[0].productName;
            }
            if (this.responseModel.data[0].accountTypeName != null && this.responseModel.data[0].accountTypeName != undefined) {
              this.accountType = this.responseModel.data[0].accountTypeName;
            }
            if (this.responseModel.data[0].minBalance != null && this.responseModel.data[0].minBalance != undefined) {
              this.minBalence = this.responseModel.data[0].minBalance;
            }
            if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNo;
            }
            if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined)
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
            if (this.responseModel.data[0].ciLoanDocumentsDetailsDTOList != null && this.responseModel.data[0].ciLoanDocumentsDetailsDTOList != undefined) {
              this.documentModelList = this.responseModel.data[0].ciLoanDocumentsDetailsDTOList;

              if (this.documentModelList != null && this.documentModelList != undefined) {
                this.editDocumentOfKycFalg = true;
                for (let document of this.documentModelList) {
                  if (document.filePath != null && document.filePath != undefined) {
                    if (document.filePath != null && document.filePath != undefined) {
                      document.multipartFileList = this.fileUploadService.getFile(document.filePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.filePath);

                    }
                  }
                }
              }

            }
            else {
              this.addDocumentOfKycFalg = true;
              this.buttonDisabled = true;
            }
            this.updateData();

          }
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }


  addDocument(event: any) {
    this.getAllDocumentTypes();
    this.multipleFilesList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.editButtonDisable = true;
    this.ciLoanDocumentsDetailsModel = new CiLoanDocumentsDetails();
    this.updateData();
  }

  cancel() {
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.getCiLoanDocumentsDetailsByApplicationId(this.ciLoanApplicationId);
    this.updateData();
  }

  onClick() {
    this.addDocumentOfKycFalg = true;
  }

  toggleEditForm(index: number, modelData: any): void {
    if (this.editIndex === index) {
      this.editIndex = index;
    } else {
      this.editIndex = index;
    }
    this.editButtonDisable = true;
    this.buttonDisabled = true;
    this.veiwCardHide = false;
    this.editDocumentOfKycFalg = false;
    this.addDocumentOfKycFalg = false;
    this.getDocumentsById(modelData.id);
    this.updateData();
  }

  editCancle() {
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.getCiLoanDocumentsDetailsByApplicationId(this.ciLoanApplicationId);
    this.updateData();
  }

  editsave(row: any) {
    this.getAllDocumentTypes();
    this.ciLoanDocumentsDetailsModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciLoanDocumentsDetailsModel.admissionNumber = this.admissionNumber;
    this.ciLoanDocumentsDetailsModel.memberTypeName = this.memberTypeName;
    this.ciLoanDocumentsDetailsModel.memberType = this.memberTypeId;
    this.ciLoanDocumentsDetailsModel.memberId = this.memberId;
    this.editDocumentOfKycFalg = true;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.ciLoanDocumentsDetailsModel.documentType);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.ciLoanDocumentsDetailsModel.documentTypeName = filteredObj.label;
      }
    }
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.ciLoanDocumentsDetailsService.updateCiLoanDocumentsDetails(this.ciLoanDocumentsDetailsModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
      }
      else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      this.addKycButton = false;
      this.buttonDisabled = false;
      this.getCiLoanDocumentsDetailsByApplicationId(this.ciLoanApplicationId);
      this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  getDocumentsById(id: any) {
    this.ciLoanDocumentsDetailsService.getCiLoanDocumentsDetailsById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciLoanDocumentsDetailsModel = this.responseModel.data[0];
              if (this.ciLoanDocumentsDetailsModel.filePath != undefined && this.ciLoanDocumentsDetailsModel.filePath != null) {
                this.ciLoanDocumentsDetailsModel.multipartFileList = this.fileUploadService.getFile(this.ciLoanDocumentsDetailsModel.filePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciLoanDocumentsDetailsModel.filePath);
              }
            }
          }
        }
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  deletDilogBox(rowData: any) {
    this.displayDialog = true;
    if (rowData.id != null && rowData.id != undefined) {
      this.deleteId = rowData.id;
    }
  }

  cancelForDialogBox() {
    this.displayDialog = false;
  }

  submitDelete() {
    if (this.deleteId != null && this.deleteId != undefined) {
      this.delete(this.deleteId);
    }
    this.displayDialog = false;
  }

  fileRemoveEvent() {
    if (this.ciLoanDocumentsDetailsModel.filesDTOList != null && this.ciLoanDocumentsDetailsModel.filesDTOList != undefined && this.ciLoanDocumentsDetailsModel.filesDTOList.length > 0) {
      let removeFileIndex = this.ciLoanDocumentsDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.ciLoanDocumentsDetailsModel.filePath);
      if (removeFileIndex != null && removeFileIndex != undefined) {
        this.ciLoanDocumentsDetailsModel.filesDTOList[removeFileIndex] = null;
        this.ciLoanDocumentsDetailsModel.filePath = null;
      }
    }
  }
}
