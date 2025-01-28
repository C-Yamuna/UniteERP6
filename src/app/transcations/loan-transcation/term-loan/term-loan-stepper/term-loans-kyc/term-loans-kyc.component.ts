import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { InstitutionPromoterDetailsModel, MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel, promoterDetailsModel } from '../../../shared/si-loans/si-loan-membership-details.model';
import { TermApplication } from '../term-loan-application-details/shared/term-application.model';
import { TermLoanKyc } from './shared/term-loan-kyc.model';
import { Table } from 'primeng/table';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TermLoanNewMembershipService } from '../term-loan-new-membership/shared/term-loan-new-membership.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { TermLoanKycService } from './shared/term-loan-kyc.service';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-term-loans-kyc',
  templateUrl: './term-loans-kyc.component.html',
  styleUrls: ['./term-loans-kyc.component.css']
})
export class TermLoansKycComponent {
  kycForm: FormGroup;
  kyc: any;
  checked: any;
  loanAccId: any;
  accountType: any;
  applicationType: any;
  msgs: any[] = [];
  responseModel!: Responsemodel;
  minBalence: any;
  accountOpeningDateVal: any;
  documentTypeList: any[] = [];

  termLoanApplicationModel: TermApplication = new TermApplication();
  termLoanKycModel: TermLoanKyc = new TermLoanKyc();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  promoterDetailsModel: promoterDetailsModel = new promoterDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  fileName: any;
  kycModelList: any[] = [];
  adhaarFilesList: any[] = [];
  signFilesList: any[] = [];
  panFilesList: any[] = [];
  uploadFileData: any;
  isFileUploaded: boolean = false;
  uploadFlag: boolean = true;
  submitFlag: boolean = false;
  columns: any[] = [];

  documentsData: any[] = [];
  displayPosition: boolean = false;
  documentNameList: any[] = [];
  position: any;
  docFilesList: any[] = [];
  buttonDisabled: boolean = false;
  noKYCData: boolean = false;
  isEdit: any;

  filesList: any[] = [];
  orgnizationSetting: any;
  exerciseFileList: any[] = [];
  lastDot = applicationConstants.LAST_DOT;
  memberId: any;
  kycListByMemberId: any[] = [];
  typeFlag: boolean = false;
  addKycButton: boolean = false;

  addDocumentOfKycFalg: boolean = false;
  editDocumentOfKycFalg: boolean = false;
  veiwCardHide: boolean = false;

  @ViewChild('cv', { static: false })
  private cv!: Table;
  editIndex: any;
  afterEditCancleFalg: boolean = false;

  editButtonDisable: boolean = false;
  termLoanApplicationId: any;
  multipleFilesList: any[] = [];
  filesDTOList: any[] = [];
  productName: any;
  admissionNumber: any;
  isMemberCreation: any;
  memberTypeName: any;
  promoterDetails: any[] = [];
  institutionPromoter: any[] = [];
  memberName: any;
  mobileNumer: any;
  aadharNumber: any;
  qualificationName: any;
  panNumber: any;
  memberTypeId: any;
  createLoan: any;
  displayDialog: boolean = false;
  deleteId: any;
  isSaveAndNextDisable: boolean = true;
  individualFlag : boolean = false;
  groupFlag : boolean = false;
  institutionFlag : boolean = false;
  showForm: any;
  constructor(private formBuilder: FormBuilder,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe,
    private termLoanApplicationsService: TermApplicationService,private translate: TranslateService,
    private termLoanKycService: TermLoanKycService,  private membershipService: TermLoanNewMembershipService,
    private fileUploadService: FileUploadService) {
      this.kycForm = this.formBuilder.group({
        'docNumber': ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY), Validators.compose([Validators.required])]],
        'docTypeName': ['',  Validators.compose([Validators.required])],
        'fileUpload': ['', ],
      });
    }
  
    ngOnInit(): void {
      this.orgnizationSetting = this.commonComponent.orgnizationSettings();
      this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
      if (this.documentsData.length >= 1) {
        this.uploadFlag = true;
      }
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined ) {
          let queryParams = this.encryptDecryptService.decrypt(params['id']);
          this.termLoanApplicationId = Number(queryParams);
          this.getTermApplicationByTermAccId(this.termLoanApplicationId);
          this.isEdit = true;
          
        } else {
          this.isEdit = false;
        }
      });
      this.buttonDisabled = false;
      this.columns = [
        { field: 'docTypeName', header: 'MEMBERSHIP.KYC_DOCUMENT_NAME' },
        { field: 'docNumber', header: 'MEMBERSHIP.KYC_DOCUMENT_NUMBER' },
        { field: 'docPath', header: 'MEMBERSHIP.KYC_DOCUMENT' }
      ];
      this.getAllKycTypes();
      this.updateData();
    }
    
    //get all kyc types 
    getAllKycTypes() {
      this.termLoanKycService.getAllKYCTypes().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
            return { label: count.name, value: count.id }
          });
          let filteredObj = this.documentNameList.find((data: any) => null != data && this.termLoanKycModel.kycDocumentTypeId != null && data.value == this.termLoanKycModel.kycDocumentTypeId);
              if (filteredObj != null && undefined != filteredObj)
                this.termLoanKycModel.kycDocumentTypeName = filteredObj.label;
        }
      });
    }
  
   
  //image upload and document path save
    imageUploader(event: any, fileUpload: FileUpload) {
      this.isFileUploaded = applicationConstants.FALSE;
      this.multipleFilesList = [];
      this.termLoanKycModel.filesDTOList = [];
      this.termLoanKycModel.kycFilePath = null;
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
            this.termLoanKycModel.filesDTOList.push(files); // Add to filesDTOList array
          }
          let timeStamp = this.commonComponent.getTimeStamp();
          this.termLoanKycModel.filesDTOList[0].fileName = "TERM_LOAN_KYC_" + this.termLoanApplicationId + "_" +timeStamp+ "_"+ file.name ;
          this.termLoanKycModel.kycFilePath = "TERM_LOAN_KYC_" + this.termLoanApplicationId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
          let index1 = event.files.findIndex((x: any) => x === file);
          fileUpload.remove(event, index1);
          fileUpload.clear();
        }
        reader.readAsDataURL(file);
      }
    }
  
    //update save
    save() {
      this.updateData();
    }
    //update data to main stepper component
    updateData() {
      this.termLoanKycModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termLoanKycModel.admissionNumber = this.admissionNumber;
      this.termLoanKycModel.memberTypeName  = this.memberTypeName;
      this.termLoanKycModel.memberType  = this.memberTypeId;
      this.termLoanKycModel.memberId  = this.memberId;
      this.termLoanApplicationsService.changeData({
        formValid: !this.kycForm.valid ? true : false,
        data: this.termLoanKycModel,
        // isDisable: this.documentsData.length <= 0 ? true : false || this.uploadFlag,
        isDisable: this.buttonDisabled,
        stepperIndex: 1,
      });
    }
  
    //delete kyc 
    delete(rowDataId: any) {
      this.termLoanKycService.deleteTermLoanKYCDetails(rowDataId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.kycModelList = this.responseModel.data;
            this.getAllKycsDetailsFdKycDetails(this.termLoanApplicationId);
            this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
        else{
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
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
  
    //get all kyc details
    getAllKycsDetailsFdKycDetails(id: any) {
      this.termLoanKycService.getKycBytermAccId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.kycModelList = this.responseModel.data;
              if (this.kycModelList != null && this.kycModelList != undefined) {
                this.editDocumentOfKycFalg = true;
                for (let kyc of this.kycModelList) {
                  if(kyc.kycFilePath != null && kyc.kycFilePath != undefined){
                    if(kyc.kycFilePath != null && kyc.kycFilePath != undefined){
                      kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
  
                    }
                  }  
                }
                this.buttonDisabled = false;
                this.updateData();
              }
            }
            else{
              this.addDocumentOfKycFalg = true;
              this.buttonDisabled = true;
              this.updateData();
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
  
    //add save
    saveKyc(row: any) {
      this.termLoanKycModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termLoanKycModel.admissionNumber = this.admissionNumber;
      this.termLoanKycModel.memberTypeName  = this.memberTypeName;
      this.termLoanKycModel.memberType  = this.memberTypeId;
      this.termLoanKycModel.memberId  = this.memberId;
      if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
        let filteredObj = this.documentNameList.find((data: any) => null != data && this.termLoanKycModel.kycDocumentTypeId != null && data.value == this.termLoanKycModel.kycDocumentTypeId);
        if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
          this.termLoanKycModel.kycDocumentTypeName = filteredObj.label;
        }
      }
      this.termLoanKycModel.status  = applicationConstants.ACTIVE;
      this.termLoanKycService.addTermLoanKYCDetails(this.termLoanKycModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.termLoanKycModel = this.responseModel.data[0];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
        }else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
        this.addKycButton = false;
        this.buttonDisabled = false;
        this.getAllKycsDetailsFdKycDetails(this.termLoanApplicationId);
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
    //add kyc cancle
    cancelKyc() {
      this.kycModelList = [];
      this.addKycButton = false;
      this.editButtonDisable = false;
     
        this.getAllKycsDetailsFdKycDetails(this.termLoanApplicationId);
     
    } 
    
     //fd account details  
     getTermApplicationByTermAccId(id: any) {
      this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
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
              if(this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined){
                this.admissionNumber = this.responseModel.data[0].admissionNo;
              }
              if(this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined){
                this.memberTypeName = this.responseModel.data[0].memberTypeName;
                /**
                 * get required member details for kyc
                 */
                // this.membershipDataFromFdModule();
              }
                
              if(this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined)
                this.memberTypeId = this.responseModel.data[0].memberTypeId;
              this.getAllKycsDetailsFdKycDetails(this.termLoanApplicationId);
              this.updateData();
            }
          }else {
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
  
    //add kyc 
    addKyc(event: any) {
      this.getAllKycTypes();
      this.multipleFilesList = [];
      this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
      this.buttonDisabled = true;
      this.editButtonDisable = true;
      this.termLoanKycModel = new TermLoanKyc;
      this.updateData();
    }
  
     //add cancle 
  
    cancel() {
      this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
      this.buttonDisabled = false;
      this.editButtonDisable = false;
      this.getAllKycsDetailsFdKycDetails(this.termLoanApplicationId);
      this.updateData();
    }
    
    onClick() {
      this.addDocumentOfKycFalg = true;
    }
    //click on edit and populate data on form and save & next disable purpose
  
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
      this.getKycById(modelData.id);
      this.updateData();
  
    }
    //edit cancle
  
    editCancle() {
      this.editDocumentOfKycFalg = true;
      this.buttonDisabled = false;
      this.editButtonDisable = false;
        this.getAllKycsDetailsFdKycDetails(this.termLoanApplicationId);
      
      this.updateData();
    }
  
     //edit kyc save
  
    editsave(row: any) {
      this.termLoanKycModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termLoanKycModel.admissionNumber = this.admissionNumber;
      this.termLoanKycModel.memberTypeName  = this.memberTypeName;
      this.termLoanKycModel.memberType  = this.memberTypeId;
      this.termLoanKycModel.memberId  = this.memberId;
      if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
        let filteredObj = this.documentNameList.find((data: any) => null != data && this.termLoanKycModel.kycDocumentTypeId != null && data.value == this.termLoanKycModel.kycDocumentTypeId);
        if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
          this.termLoanKycModel.kycDocumentTypeName = filteredObj.label;
        }
      }
      this.editDocumentOfKycFalg = true;
      this.buttonDisabled = false;
      this.editButtonDisable = false;
      this.termLoanKycService.updateTermLoanKYCDetails(this.termLoanKycModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          // this.kycModelList = this.responseModel.data;
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
        this.getAllKycsDetailsFdKycDetails(this.termLoanApplicationId);
        this.updateData();
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
  
    }
  
    //get kyc details by kyc id for edit purpose
  
    getKycById(id: any) {
      this.termLoanKycService.getTermLoanKYCDetails(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.termLoanKycModel = this.responseModel.data[0];
                if (this.termLoanKycModel.kycFilePath != undefined) {
                  if(this.termLoanKycModel.kycFilePath != null && this.termLoanKycModel.kycFilePath != undefined){
                    this.termLoanKycModel.multipartFileList = this.fileUploadService.getFile(this.termLoanKycModel.kycFilePath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanKycModel.kycFilePath);
  
                  }
                }
              }
            }
          }
        }
      });
    }
  
    getMemberDetailsByAdmissionNumber(admisionNumber: any) {
      this.termLoanApplicationsService.getMemberByAdmissionNumber(admisionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
              if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
                this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
              }
              if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
                this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              this.memberId = this.membershipBasicRequiredDetailsModel.id;
              
            }
          }
          else {
            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    }
    //get group details
    getGroupByAdmissionNumber(admissionNumber: any) {
      this.termLoanApplicationsService.getGroupByAdmissionNumber(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.memberGroupDetailsModel = this.responseModel.data[0];
              if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
                this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDateVal, this.orgnizationSetting.datePipe);
              }
              if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
                this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
                this.memberId = this.memberGroupDetailsModel.id;
            }
          }
          else {
            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    }
    //get institution details
    getInstitutionByAdmissionNumber(admissionNumber: any) {
      this.termLoanApplicationsService.getInstitutionDetails(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.membershipInstitutionDetailsModel = this.responseModel.data[0];
              if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
                this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDateVal, this.orgnizationSetting.datePipe);
              }
              if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
                this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0)
                this.institutionPromoter = this.membershipInstitutionDetailsModel.institutionPromoterList;
              this.memberId = this.membershipInstitutionDetailsModel.id;
            }
          } else {
            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    }
  
    membershipDataFromFdModule(){
      if (this.memberTypeName == "Individual") {
        this.individualFlag = true;
        this.getMemberDetailsByAdmissionNumber(this.admissionNumber);
      } else if (this.memberTypeName == "Group") {
        this.groupFlag = true;
        this.getGroupByAdmissionNumber(this.admissionNumber);
      } else if (this.memberTypeName == "Institution") {
        this.institutionFlag = true;
        this.getInstitutionByAdmissionNumber(this.admissionNumber);
      }
      
    }
  
    
    kycModelDuplicateCheck(kycDocTypeId:any){
      if(this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0){
      let duplicate = this.kycModelList.find((obj:any) => obj && obj.kycDocumentTypeId === kycDocTypeId );
      if (duplicate != null && duplicate != undefined) {
        this.kycForm.reset();
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types"}];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      } 
    }
    }
  
     /**
     * @implements on click delete
     */
     deletDilogBox(rowData:any){
      this.displayDialog = true;
      if(rowData.id != null && rowData.id != undefined){
        this.deleteId = rowData.id;
      }
     
    }
  
    /**
     * @implements cancle delete dialog box
     */
    cancelForDialogBox() {
      this.displayDialog = false;
    }
  
    /**
     * @implements submit delete diloge 
     */
    submitDelete(){
      if(this.deleteId != null && this.deleteId != undefined){
        this.delete(this.deleteId);
      }
        this.displayDialog = false;
    }
  
    /**
     * @implements onFile remove
     */
    fileRemoeEvent(){
      if(this.termLoanKycModel.filesDTOList != null && this.termLoanKycModel.filesDTOList != undefined && this.termLoanKycModel.filesDTOList.length > 0){
       let removeFileIndex = this.termLoanKycModel.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.termLoanKycModel.kycFilePath);
       if(removeFileIndex != null && removeFileIndex != undefined){
         this.termLoanKycModel.filesDTOList[removeFileIndex] = null;
         this.termLoanKycModel.kycFilePath = null;
       }
      }
     }
}
