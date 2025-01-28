import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { MembershipBasicDetailsService } from '../../shared/membership-basic-details.service';
import { MemberBasicDetailsStepperService } from '../shared/membership-individual-stepper.service';
import { RequiredDocumentModel } from '../../shared/required-document-details.model';
import { RequiredDocumentDetailsService } from '../../shared/required-documents-details.service';
import { DocumentTypesService } from 'src/app/configurations/membership-config/document-types/shared/document-types.service';
import { MemberBasicDetails } from '../../shared/member-basic-details.model';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.css']
})
export class DocumentDetailsComponent {
  documentForm: FormGroup;
  requiredDocumentsList: any[] = [];
  uploadFileData: any;
  isFileUploaded: boolean = false;
  uploadFlag: boolean = true;
  submitFlag: boolean = false;
  responseModel!: Responsemodel;
  documentsData: any[] = [];
  displayPosition: boolean = false;
  buttonDisabled: boolean = false;
  isEdit: any;
  msgs: any[] = [];
  exerciseFileList: any[] = [];
  memberId: any;
  pacsId = 1;
  branchId = 1;
  memberModel: MemberBasicDetails = new MemberBasicDetails();
  editIndex: any;
  editButtonDisable: boolean = false;
  addDocumentOfKycFalg: boolean = false;
  editDocumentOfKycFalg: boolean = false;
  veiwCardHide: boolean = false;
  addKycButton: boolean = false;
  fileName: any;
  docTypeList: any[] = [];
  multipleFilesList: any[] = [];
  landFlag: boolean = false;
  buttonsFlag: boolean = true;
  displayDialog: boolean = false;
  id: any;
  deleteId: any;
  showAddButton: boolean = false;
  requiredDocumentModel: RequiredDocumentModel = new RequiredDocumentModel();


  constructor(private formBuilder: FormBuilder,
    private requiredDocumentDetailsService: RequiredDocumentDetailsService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptService: EncryptDecryptService,
    private documentTypeService: DocumentTypesService,
    private membershipBasicDetailsService: MembershipBasicDetailsService,
    private memberBasicDetailsStepperService: MemberBasicDetailsStepperService,
    private fileUploadService: FileUploadService) {

    this.documentForm = this.formBuilder.group({
      'requiredDocumentTypeId': new FormControl('', Validators.required),
      'documentNumber': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'requiredDocumentFilePath': new FormControl(''),
    });

  }
  ngOnInit(): void {
    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    this.activateRoute.queryParams.subscribe(params => {
      let encrypted = params['id'];

      if (encrypted != undefined) {
        if (encrypted) {
          this.isEdit = true;
          this.memberId = Number(this.encryptService.decrypt(encrypted));
          this.getMembershipDetailsById(this.memberId);
          this.uploadFlag = false;
        } else {
          this.isEdit = false;
        }
      }
      this.updateData();
    });

    this.buttonDisabled = false;

    this.getAllDocumnetsTypes();
    this.updateData();

  }
  getMembershipDetailsById(id: any) {
    this.isEdit = true;
    this.membershipBasicDetailsService.getMembershipBasicDetailsById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.showAddButton = false;
        this.memberModel = this.responseModel.data[0];
        if (this.memberModel && this.memberModel.requiredDocumentDetailsDTOList != null && this.memberModel.requiredDocumentDetailsDTOList != undefined &&
          this.memberModel.requiredDocumentDetailsDTOList.length > 0) {
          this.requiredDocumentsList = this.memberModel.requiredDocumentDetailsDTOList;
          this.requiredDocumentsList = this.requiredDocumentsList.filter(obj => null != obj && null != obj.status && obj.status === applicationConstants.ACTIVE).map((document: any) => {
            document.multipleFilesList = this.fileUploadService.getFile(document.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.requiredDocumentFilePath);
            this.showAddButton = true;
            return document;
          });
        }
        else {
          this.documentForm.reset();
          this.requiredDocumentModel = new RequiredDocumentModel()
          this.addDocumentOfKycFalg = true;
          this.showAddButton = false;
          this.buttonDisabled = true;
          this.landFlag = false
        }

      } else {
        this.showAddButton = false;
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  //get all document documnet types 
  getAllDocumnetsTypes() {
    this.documentTypeService.getAllDocumentType().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.docTypeList = this.responseModel.data;
            this.docTypeList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: any) => {
              return { label: state.name, value: state.id };
            });
          }else{
            if (this.docTypeList == null || (this.docTypeList != null && this.docTypeList.length == 0)) {

              this.msgs = [];
              this.msgs = [{ severity: 'error', detail: applicationConstants.DOCUMENT_TYPE_NO_DATA_MESSAGE }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
        }else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    });
  }
  updateData() {
    if (this.requiredDocumentsList != null && this.requiredDocumentsList != undefined &&
      this.requiredDocumentsList.length > 0 && this.buttonsFlag) {
      this.landFlag = true;
    }
    this.requiredDocumentModel.memberId = this.memberId;
    this.memberBasicDetailsStepperService.changeData({
      formValid: this.documentForm.valid,
      data: this.requiredDocumentModel,
      savedId: this.memberId,
      stepperIndex: 4,
      isDisable: !this.landFlag ? true : false,
    });
  }
  saveKyc(row: any) {
    let documnetTypes = this.docTypeList.find((data: any) => null != data && row.requiredDocumentTypeId != null && data.value == row.requiredDocumentTypeId);
    if (documnetTypes != null && undefined != documnetTypes)
      row.requiredDocumentTypeName = documnetTypes.label;
    if (this.requiredDocumentModel.status == null && this.requiredDocumentModel.status == undefined)
      this.requiredDocumentModel.status = applicationConstants.ACTIVE;
    this.requiredDocumentModel.memberId = this.memberId;
    this.requiredDocumentModel.memberType = this.memberModel.memberTypeId;
    this.requiredDocumentModel.admissionNumber = this.memberModel.admissionNumber;
    this.requiredDocumentDetailsService.addRequiredDocumentsDetails(row).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {

        this.requiredDocumentModel = this.responseModel.data[0];
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
      this.buttonsFlag = true;
      this.landFlag = true;;
      this.addKycButton = false;
      this.buttonDisabled = false;
      this.getMembershipDetailsById(this.memberId);
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
    this.updateData();
  }
  editsave(row: any) {
    let documnetTypes = this.docTypeList.find((data: any) => null != data && row.requiredDocumentTypeId != null && data.value == row.requiredDocumentTypeId);
    if (documnetTypes != null && undefined != documnetTypes)
      row.requiredDocumentTypeName = documnetTypes.label;
    if (this.requiredDocumentModel.status == null && this.requiredDocumentModel.status == undefined)
      this.requiredDocumentModel.status = applicationConstants.ACTIVE;
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.requiredDocumentDetailsService.updateRequiredDocumentsDetails(row).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.buttonsFlag = true;
        this.landFlag = true;;
        this.updateData();
        this.requiredDocumentModel = this.responseModel.data;
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
      this.getMembershipDetailsById(this.memberId);
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  addKyc(event: any) {
    // this.getAllDocumnetsTypes();
    this.documentForm.reset();
    this.multipleFilesList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.buttonsFlag = false;
    this.landFlag = false;
    this.updateData();
    this.editButtonDisable = true;
    this.requiredDocumentModel = new RequiredDocumentModel;
  }


  toggleEditForm(index: number, modelData: any): void {
    if (this.editIndex === index) {
      this.editIndex = index;
    } else {
      this.editIndex = index;
    }
    this.editButtonDisable = true;
    this.buttonDisabled = true;
    this.buttonsFlag = false;
    this.landFlag = false;
    this.updateData();
    this.veiwCardHide = false;
    this.editDocumentOfKycFalg = false;
    this.addDocumentOfKycFalg = false;
    this.getKycById(modelData.id);
  }
  getKycById(id: any) {
    this.requiredDocumentDetailsService.getRequiredDocumentsDetailsById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.requiredDocumentModel = this.responseModel.data[0];
          if (this.requiredDocumentModel.requiredDocumentFilePath != null && this.requiredDocumentModel.requiredDocumentFilePath != undefined) {
            this.requiredDocumentModel.multipleFilesList = this.fileUploadService.getFile(this.requiredDocumentModel.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.requiredDocumentModel.requiredDocumentFilePath);

          }
        }
      }
    });
  }
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileName = file.name;
    }
  }
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileName = file.name;
    }
  }
  cancel() {
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.buttonsFlag = true;
    this.landFlag = true;
    this.updateData();
    this.getMembershipDetailsById(this.memberId);
  }
  editCancle() {
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.buttonsFlag = true;
    this.landFlag = true;
    this.updateData();
    this.getMembershipDetailsById(this.memberId);
  }
  backToKyc() {
    this.displayPosition = false;
    this.uploadFlag = false;
    this.submitFlag = false;
    this.updateData();
  }
  fileUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.requiredDocumentModel.multipleFilesList = [];
    this.multipleFilesList = [];
    this.requiredDocumentModel.filesDTO = null; // Initialize as a single object
    this.requiredDocumentModel.requiredDocumentFilePath = null;
    if (event.files.length !== 1) {
      console.error('Exactly one file must be selected.');
      return;
    }
    let file = event.files[0]; // Only one file
    let reader = new FileReader();
    reader.onloadend = (e) => {
      if (!e.target || !e.target.result) {
        console.error('FileReader failed to read file:', file.name);
        return;
      }
      let filesDTO = new FileUploadModel();
      this.uploadFileData = e.target as FileReader;
      filesDTO.fileName = "MEMBER_KYC_" + this.memberId + "_" + this.commonComponent.getTimeStamp() + "_" + file.name;
      filesDTO.fileType = file.type.split('/')[1];
      filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
      filesDTO.imageValue = this.uploadFileData.result as string;
      this.requiredDocumentModel.filesDTO = filesDTO;
      this.requiredDocumentModel.requiredDocumentFilePath = filesDTO.fileName;
      let index1 = event.files.indexOf(file);
      if (index1 > -1) {
        fileUpload.remove(event, index1);
      }
      fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }

  RemoveEvent() {
    this.requiredDocumentModel.multipleFilesList = [];
    if (this.requiredDocumentModel.filesDTO != null && this.requiredDocumentModel.filesDTO != undefined) {
      this.requiredDocumentModel.requiredDocumentFilePath = null;
      this.requiredDocumentModel.filesDTO = null;
    }
  }

  kycModelDuplicateCheck(requiredDocumentsList: any) {
    let duplicate = false;
    const uniqueIds = new Set<number>();
    const duplicateIds = new Set<number>();
    if (this.requiredDocumentsList != null && this.requiredDocumentsList != undefined && this.requiredDocumentsList.length > 0) {
      for (let item of this.requiredDocumentsList) {
        if (item != null && item != undefined && item.requiredDocumentTypeId != null && item.requiredDocumentTypeId != undefined) {
          if (uniqueIds.has(item.requiredDocumentTypeId)) {
            duplicateIds.add(item.requiredDocumentTypeId);
          } else {
            uniqueIds.add(item.requiredDocumentTypeId);
          }
        }
        if (duplicateIds.size > 0) {
          duplicate = true;
          this.documentForm.reset();
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types" }];
          setTimeout(() => {
            this.msgs = [];
          }, 1500);
        }
      }
    }
    return duplicate;
  }
  delete(rowDataId: any) {
    this.requiredDocumentDetailsService.deleteRequiredDocumentsDetails(rowDataId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.requiredDocumentsList = this.responseModel.data;
        this.getMembershipDetailsById(this.memberId);
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
}
