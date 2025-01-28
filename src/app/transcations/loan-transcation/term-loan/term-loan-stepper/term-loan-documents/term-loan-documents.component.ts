import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermLoanDocuments } from './shared/term-loan-documents.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { Table } from 'primeng/table';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { TermLoanDocumentsService } from './shared/term-loan-documents.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { TermRequiredDocuments } from 'src/app/transcations/borrowing-transaction/term-borrowing/term-borrowing-product-definition/term-borrowing-product-definition-stepper/term-required-documents/shared/term-required-documents.model';
import { TermApplication } from '../term-loan-application-details/shared/term-application.model';

@Component({
  selector: 'app-term-loan-documents',
  templateUrl: './term-loan-documents.component.html',
  styleUrls: ['./term-loan-documents.component.css']
})
export class TermLoanDocumentsComponent {
  termLoanDocumentsList: any[] = [];
  termDocumentDetailsForm: FormGroup;

  carrats: any[] = [];
  gender: any[] | undefined;
  maritalstatus: any[] | undefined;
  checked: boolean = false;
  responseModel!: Responsemodel;
  productsList: any[] = [];
  operationTypesList: any[] = [];
  schemeTypesList: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  insuranceVendorDetailsList: any[] = [];
  occupationTypesList: any[] = [];
  gendersList: any[] = [];
  relationshipTypesList: any[] = [];
  isMemberCreation: boolean = false;
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanDocumentsModel: TermLoanDocuments = new TermLoanDocuments();
  termLoanApplicationModel: TermApplication = new TermApplication();
  memberTypeName: any;
  loanAccId: any;
  isEdit: boolean = false;
  admissionNumber: any;
  termLoanDocumentsModelList: any[] = [];
  institutionPromoter: any[] = [];
  visible: boolean = false;
  isFormValid: Boolean = false;

  @ViewChild('document', { static: false }) private document!: Table;

  addButton: boolean = false;
  newRow: any;
  EditDeleteDisable: boolean = false;
  documentDetails: any[] = [];
  collateralType: any;
  tempDocumentDetailsList: any[] = [];
  mainDocumentDetailsList: any[] = [];
  updatedDocumentDetailsList: any[] = [];
  documentsList: any[] = [];
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
  adhaarFilesList: any[] = [];
  signFilesList: any[] = [];
  panFilesList: any[] = [];
  uploadFileData: any;
  isFileUploaded: boolean = false;
  submitFlag: boolean = false;
  displayPosition: boolean = false;
  documentNameList: any[] = [];
  position: any;
  docFilesList: any[] = [];
  filesList: any[] = [];
  exerciseFileList: any[] = [];
  lastDot = applicationConstants.LAST_DOT;
  memberId: any;
  kycListByMemberId: any[] = [];
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
  promoterDetails: any[] = [];
  memberName: any;
  mobileNumer: any;
  aadharNumber: any;
  qualificationName: any;
  panNumber: any;
  memberTypeId: any;
  displayDialog: boolean = false;
  constructor(private router: Router, private formBuilder: FormBuilder,
    private translate: TranslateService, private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private commonFunction: CommonFunctionsService,
    private activateRoute: ActivatedRoute,
    private termLoanApplicationsService: TermApplicationService,
    private termLoanDocumentsService: TermLoanDocumentsService,
    private fileUploadService: FileUploadService) {

      this.termDocumentDetailsForm = this.formBuilder.group({
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
          this.loanAccId = Number(queryParams);
          this.getTermApplicationByTermAccId(this.loanAccId);
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
      this.termLoanDocumentsService.getAllDocuments().subscribe((res: any) => {
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
      this.termLoanDocumentsModel.multipartFileList = [];
      this.termLoanDocumentsModel.filesDTOList = [];
      this.termLoanDocumentsModel.filePath = null;
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
            this.termLoanDocumentsModel.filesDTOList.push(files); // Add to filesDTOList array
          }
          let timeStamp = this.commonComponent.getTimeStamp();
          this.termLoanDocumentsModel.filesDTOList[0].fileName = "TERM_LOAN_DOCUMENT_" + this.loanAccId + "_" + timeStamp + "_" + file.name;
          this.termLoanDocumentsModel.filePath = "TERM_LOAN_DOCUMENT_" + this.loanAccId + "_" + timeStamp + "_" + file.name; // This will set the last file's name as filePath
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
      this.termLoanDocumentsModel.termLoanApplicationId = this.loanAccId;
      this.termLoanDocumentsModel.admissionNumber = this.admissionNumber;
      this.termLoanDocumentsModel.memberTypeName = this.memberTypeName;
      this.termLoanDocumentsModel.memberType = this.memberTypeId;
      this.termLoanDocumentsModel.memberId = this.memberId;
      this.termLoanApplicationsService.changeData({
        formValid: this.termDocumentDetailsForm.valid,
        data: this.termLoanDocumentsModel,
        isDisable: this.buttonDisabled,
        stepperIndex: 8,
      });
    }
  
    delete(rowDataId: any) {
      this.termLoanDocumentsService.deleteTermLoanDocumentsDetails(rowDataId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.documentModelList = this.responseModel.data;
          this.getTermLoanDocumentsDetailsByLoanAccId(this.loanAccId);
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
  
    getTermLoanDocumentsDetailsByLoanAccId(loanAccId: any) {
      this.termLoanDocumentsService.getTermLoanDocumentsDetailsByLoanAccId(this.loanAccId).subscribe((response: any) => {
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
      this.termLoanDocumentsModel.termLoanApplicationId = this.loanAccId;
      this.termLoanDocumentsModel.admissionNumber = this.admissionNumber;
      this.termLoanDocumentsModel.memberTypeName = this.memberTypeName;
      this.termLoanDocumentsModel.memberType = this.memberTypeId;
      this.termLoanDocumentsModel.memberId = this.memberId;
      this.termLoanDocumentsModel.status = applicationConstants.ACTIVE;
      if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
        let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.termLoanDocumentsModel.documentType);
        if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
          this.termLoanDocumentsModel.documentName = filteredObj.label;
        }
      }
      // this.documentNameList.filter((state: any) => state != null && state.value == this.termLoanDocumentsModel.documentType).map((act: { label: any; }) => {
      //   this.termLoanDocumentsModel.documentName = act.label;
      // });
      this.termLoanDocumentsService.addTermLoanDocumentsDetails(this.termLoanDocumentsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.termLoanDocumentsModel = this.responseModel.data[0];
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
        this.getTermLoanDocumentsDetailsByLoanAccId(this.loanAccId);
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
  
    getTermApplicationByTermAccId(id: any) {
      this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLoanApplicationModel = this.responseModel.data[0];
             
              if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
                this.admissionNumber = this.responseModel.data[0].admissionNo;
              }
              if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined)
                this.memberTypeName = this.responseModel.data[0].memberTypeName;
              if (this.responseModel.data[0].termLoanDocumentsDetailsDTOList != null && this.responseModel.data[0].termLoanDocumentsDetailsDTOList != undefined) {
                this.documentModelList = this.responseModel.data[0].termLoanDocumentsDetailsDTOList;
  
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
      this.termLoanDocumentsModel = new TermRequiredDocuments();
      this.updateData();
    }
  
    cancel() {
      this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
      this.buttonDisabled = false;
      this.editButtonDisable = false;
      this.getTermLoanDocumentsDetailsByLoanAccId(this.loanAccId);
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
      this.getTermLoanDocumentsDetailsByLoanAccId(this.loanAccId);
      this.updateData();
    }
  
    editsave(row: any) {
      this.getAllDocumentTypes();
      this.termLoanDocumentsModel.termLoanApplicationId = this.loanAccId;
      this.termLoanDocumentsModel.admissionNumber = this.admissionNumber;
      this.termLoanDocumentsModel.memberTypeName = this.memberTypeName;
      this.termLoanDocumentsModel.memberType = this.memberTypeId;
      this.termLoanDocumentsModel.memberId = this.memberId;
      this.editDocumentOfKycFalg = true;
      if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
        let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.termLoanDocumentsModel.documentType);
        if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
          this.termLoanDocumentsModel.documentName = filteredObj.label;
        }
      }
      this.buttonDisabled = false;
      this.editButtonDisable = false;
      this.termLoanDocumentsService.updateTermLoanDocumentsDetails(this.termLoanDocumentsModel).subscribe((response: any) => {
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
        this.getTermLoanDocumentsDetailsByLoanAccId(this.loanAccId);
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
      this.termLoanDocumentsService.getTermLoanDocumentsDetailsById(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.termLoanDocumentsModel = this.responseModel.data[0];
                if (this.termLoanDocumentsModel.filePath != undefined && this.termLoanDocumentsModel.filePath != null) {
                  this.termLoanDocumentsModel.multipartFileList = this.fileUploadService.getFile(this.termLoanDocumentsModel.filePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanDocumentsModel.filePath);
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
      if (this.termLoanDocumentsModel.filesDTOList != null && this.termLoanDocumentsModel.filesDTOList != undefined && this.termLoanDocumentsModel.filesDTOList.length > 0) {
        let removeFileIndex = this.termLoanDocumentsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.termLoanDocumentsModel.filePath);
        if (removeFileIndex != null && removeFileIndex != undefined) {
          this.termLoanDocumentsModel.filesDTOList[removeFileIndex] = null;
          this.termLoanDocumentsModel.filePath = null;
        }
      }
    }

}
