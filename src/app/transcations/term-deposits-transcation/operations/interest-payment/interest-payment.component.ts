import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { termdeposittransactionconstant } from '../../term-deposit-transaction-constant';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SelectItem } from 'primeng/api';
import { MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from '../../fd-cumulative/fd-cumulative-stepper/new-membership-add/shared/new-membership-add.model';
import { FdNonCumulativeApplication } from '../../fd-non-cumulative/fd-non-cumulative-stepper/fd-non-cumulative-application/shared/fd-non-cumulative-application.model';
import { FdNonCumulativeApplicationService } from '../../fd-non-cumulative/fd-non-cumulative-stepper/fd-non-cumulative-application/shared/fd-non-cumulative-application.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { InterestPayment } from './shared/interest-payment.model';
import { InterestPaymentService } from './shared/interest-payment.service';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-interest-payment',
  templateUrl: './interest-payment.component.html',
  styleUrls: ['./interest-payment.component.css']
})
export class InterestPaymentComponent {
    statuses!: SelectItem[];
    data: any;
    id: any;
    membershipBasicRequiredDetailsModel: NewMembershipAdd = new NewMembershipAdd();
    memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
    membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
    fdNonCumulativeApplicationModel: FdNonCumulativeApplication = new FdNonCumulativeApplication();
    interestPaymentModel: InterestPayment =new InterestPayment();
    fdNonCummulativeAccId: any;
    transactionModelist: any[] = [];
    savingsbank: any[] = [];
    isHistory: boolean = false;
    operations:any;
    operationslist:any;
    responseModel!: Responsemodel;
    orgnizationSetting: any;
    msgs: any[] = [];
    pacsId : any;
    branchId : any;
    gridList: any [] = [];   
    memberTypeName: any;
    admissionNumber: any;
    photoCopyFlag: boolean = true;
    signatureCopyFlag: boolean = true;
    isKycApproved: any;
    institionPromotersList: any[] = [];
    groupPrmotersList: any[]=[];
  
    membreIndividualFlag: boolean = false;
    groupPromotersPopUpFlag: boolean = false;
    institutionPromoterFlag: boolean = false;
    memberPhotoCopyZoom: boolean = false;
    groupPrmoters: any[] =[];
    showSbAccountNumber: boolean = false;
    accountNumber :any;
    productId: any;
    serviceCofigDetailsList: any;
    multipleFilesList: any[] = [];
    uploadFileData: any;
    options: any;
    isEditDeleteButtonEnable : boolean = false;
    isEdit: any;
    isBasicDetails: boolean = false;
    position: string = 'center';
    paymentOptions = [
        { label: 'Cash', value: 'cash' },
        { label: 'To SB Account', value: 'sbAccount' },
      ];
    
    constructor(private router: Router, private formBuilder: FormBuilder, private IinterestPaymentService :InterestPaymentService,
        private fdNonCumulativeApplicationService: FdNonCumulativeApplicationService,
         private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, 
         private encryptDecryptService: EncryptDecryptService,
          private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe,
           private translate: TranslateService,private fileUploadService :FileUploadService,) {
      { 
     
      this.groupPrmoters = [
        { field: 'surname', header: 'TERMDEPOSITSTRANSACTION.SUR_NAME' },
        { field: 'name', header: 'TERMDEPOSITSTRANSACTION.NAME' },
        { field: 'operatorTypeName', header: 'TERMDEPOSITSTRANSACTION.OPEARION_TYPE' },
        { field: 'memDobVal', header: 'TERMDEPOSITSTRANSACTION.MEMBER_DOB' },
        { field: 'age', header: 'TERMDEPOSITSTRANSACTION.AGE' },
        { field: 'genderName', header: 'TERMDEPOSITSTRANSACTION.GENDER_NAME' },
        { field: 'maritalStatusName', header: 'TERMDEPOSITSTRANSACTION.MARITAL_STATUS' },
        { field: 'mobileNumber', header: 'TERMDEPOSITSTRANSACTION.MOBILE_NUMBER' },
        { field: 'emailId', header: 'TERMDEPOSITSTRANSACTION.EMAIL' },
        { field: 'aadharNumber', header: 'TERMDEPOSITSTRANSACTION.AADHAR_NUMBER' },
        { field: 'startDate', header: 'TERMDEPOSITSTRANSACTION.START_DATE' },
      ];
    }
  }
  ngOnInit() {
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.fdNonCummulativeAccId = this.encryptDecryptService.decrypt(params['id']);
        this.isEdit = true;
        if (this.fdNonCummulativeAccId != null && this.fdNonCummulativeAccId != undefined) {

        }
      } else {
        this.isEdit = false;
      }
    })

    this.getFdNonCummApplicationById(this.fdNonCummulativeAccId);
    // this.getInterestPayment(this.id);
    this.getAllTransactionModes();
    
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'First Dataset',
              data: [65, 59, 80, 81, 56, 55, 40],
              fill: false,
              borderColor: documentStyle.getPropertyValue('--blue-500'),
              tension: 0.4
          },
          {
              label: 'Second Dataset',
              data: [28, 48, 40, 19, 86, 27, 90],
              fill: false,
              borderColor: documentStyle.getPropertyValue('--pink-500'),
              tension: 0.4
          }
      ]
  };

  this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          },
          y: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          }
      }
  };
  }
  showHistoryDialog(position: string) {
    this.position = position;
    this.isHistory = true;
    if(this.isBasicDetails)
        this.isBasicDetails = false;
}
  backbutton(){
    this.router.navigate([termdeposittransactionconstant.FD_NON_CUMMULATIVE]);
  }
  onPaymentTypeChange(element: any): void {
    // const selectedValue = event.target.value;
    if(element.value.value === 'sbAccount') {
        this.showSbAccountNumber = true;
    } else {
        this.showSbAccountNumber = false;
    }
  }
  getFdNonCummApplicationById(id:any) {
    this.fdNonCumulativeApplicationService.getFdNonCummApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
          if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
  
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.fdNonCumulativeApplicationModel = this.responseModel.data[0];
              if (this.fdNonCumulativeApplicationModel.depositDate != null && this.fdNonCumulativeApplicationModel.depositDate != undefined) {
                this.fdNonCumulativeApplicationModel.depositDate = this.datePipe.transform(this.fdNonCumulativeApplicationModel.depositDate, this.orgnizationSetting.datePipe);
              }
              if (this.fdNonCumulativeApplicationModel.memberTypeName != null && this.fdNonCumulativeApplicationModel.memberTypeName != undefined) {
                this.memberTypeName = this.fdNonCumulativeApplicationModel.memberTypeName;
              }
              if (this.fdNonCumulativeApplicationModel.admissionNumber != null && this.fdNonCumulativeApplicationModel.admissionNumber != undefined) {
                this.admissionNumber = this.fdNonCumulativeApplicationModel.admissionNumber;
              }
              if (this.fdNonCumulativeApplicationModel.accountNumber != null && this.fdNonCumulativeApplicationModel.accountNumber != undefined) {
                this.interestPaymentModel.accountNumber = this.fdNonCumulativeApplicationModel.accountNumber;
                this.accountNumber = this.fdNonCumulativeApplicationModel.accountNumber;
                this.getInterestPayment(this.accountNumber);
              }
              if (this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId != undefined) {
                this.productId = this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId;
              }
              //member individual
              if (this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO != null && this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO != undefined) {
                this.membershipBasicRequiredDetailsModel = this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO;
                if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
                  this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
                }
                if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
                  this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                }
                if (this.membershipBasicRequiredDetailsModel.photoPath != null && this.membershipBasicRequiredDetailsModel.photoPath != undefined) {
                  this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoPath ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoPath  );
                  
                }
                else{
                  this.photoCopyFlag = false;
                }
                if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                    this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath  );
                }
                else{
                  this.signatureCopyFlag = false;
                }
                if (this.membershipBasicRequiredDetailsModel.isStaff != null && this.membershipBasicRequiredDetailsModel.isStaff != undefined && this.membershipBasicRequiredDetailsModel.isStaff) {
                  this.membershipBasicRequiredDetailsModel.isStaff = applicationConstants.YES;
                }
                else{
                  this.membershipBasicRequiredDetailsModel.isStaff = applicationConstants.NO;
                }
                if (this.membershipBasicRequiredDetailsModel.isKycApproved != null && this.membershipBasicRequiredDetailsModel.isKycApproved != undefined && this.membershipBasicRequiredDetailsModel.isKycApproved) {
                  this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                }
                else {
                  this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
                }
              }
              //group
              if (this.fdNonCumulativeApplicationModel.memberShipGroupDetailsDTO != null && this.fdNonCumulativeApplicationModel.memberShipGroupDetailsDTO != undefined) {
                this.memberGroupDetailsModel = this.fdNonCumulativeApplicationModel.memberShipGroupDetailsDTO;
                if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
                  this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
                }
                if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
                  this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                }
                if (this.memberGroupDetailsModel.isKycApproved != null && this.memberGroupDetailsModel.isKycApproved != undefined && this.memberGroupDetailsModel.isKycApproved ) {
                  this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                }
                else {
                  this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
                }
                if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0) {
                  this.groupPrmotersList=this.memberGroupDetailsModel.groupPromoterList ;
                }
              }
              //institution
              if (this.fdNonCumulativeApplicationModel.memInstitutionDTO != null && this.fdNonCumulativeApplicationModel.memInstitutionDTO != undefined) {
                this.membershipInstitutionDetailsModel = this.fdNonCumulativeApplicationModel.memInstitutionDTO;
                if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
                  this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
                }
                if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
                  this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                }
                if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0) {
                  this.institionPromotersList=this.membershipInstitutionDetailsModel.institutionPromoterList ;
                }
                if (this.membershipInstitutionDetailsModel.isKycApproved != null && this.membershipInstitutionDetailsModel.isKycApproved != undefined && this.membershipInstitutionDetailsModel.isKycApproved) {
                  this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                }
                else {
                  this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
                }
              }
          }
        }
      }
          else{
            this.msgs = [];
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
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
  
   close(){
    this.memberPhotoCopyZoom = false;
    this.membreIndividualFlag = false;
  }
  
  onClickMemberIndividualMoreDetails(){
  this.membreIndividualFlag = true;
  }
  
  onClick(){
  this.institutionPromoterFlag = true;
  
  }
  onClickOfGroupPromotes(){
  this.groupPromotersPopUpFlag = true;
  }
  
  closePhotoCopy() {
  this.memberPhotoCopyZoom = false;
  }
  
  onClickMemberPhotoCopy(){
  this.memberPhotoCopyZoom = true;
  }
  
  
  closePhoto(){
  this.memberPhotoCopyZoom = false;
  }
  showBasicDetailsDialog(position: string) {
    this.position = position;
    this.isBasicDetails = true;
  }
  getAllTransactionModes() {
    this.IinterestPaymentService.getAllTransactionModes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.transactionModelist = this.responseModel.data;
        this.transactionModelist = this.transactionModelist.filter((obj: any) => obj.status == applicationConstants.ACTIVE).map((transactionMode: { name: any; id: any; }) => {
          return { label: transactionMode.name, value: transactionMode.id };
        });

      }
    });
  }

  saveInterestPayments(obj: any) {
    if (obj.interestPostingDateVal != null && obj.interestPostingDateVal != undefined) {
      obj.interestPostingDate = this.commonFunctionsService.getUTCEpoch(new Date(obj.interestPostingDateVal));
    }
    if (obj.id != null && obj.id != undefined) {
      this.IinterestPaymentService.updateInterestPayment(obj).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined && this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.msgs = [];
              this.commonComponent.stopSpinner();
              this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
             
             
                this.getInterestPayment(this.accountNumber);
            }
          }
        }
        else {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
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
    else {
      obj.status = applicationConstants.ACTIVE;
      this.IinterestPaymentService.addInterestPayment(obj).subscribe((data: any) => {//create or save
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined && this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.msgs = [];
              this.commonComponent.stopSpinner();
              this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
             
                this.getInterestPayment(this.accountNumber);
            }
          }
        }
        else {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
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
  }
  getInterestPayment(accountNumber: any) {
    this.IinterestPaymentService.getInterestPaymentByAccountNumber(this.accountNumber).subscribe((data: any) => {
        this.responseModel = data;
            if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
    
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.interestPaymentModel = this.responseModel.data[0];
                if (this.interestPaymentModel.interestPostingDate != null && this.interestPaymentModel.interestPostingDate != undefined) {
                  this.interestPaymentModel.interestPostingDateVal = this.datePipe.transform(this.interestPaymentModel.interestPostingDate, this.orgnizationSetting.datePipe);
                }
            }
          }
        }
            else{
              this.msgs = [];
              this.commonComponent.stopSpinner();
              this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
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
  
  fileUploader(event: any, fileUpload: FileUpload) {
    // this.multipleFilesList = [];
    // this.standingInstruction.filesDTOList = [];
    // this.standingInstruction.signedCopyPath = null;
    // let files: FileUploadModel = new FileUploadModel();
    // for (let file of event.files) {
    //   let reader = new FileReader();
    //   reader.onloadend = (e) => {
    //     let files = new FileUploadModel();
    //     this.uploadFileData = e.currentTarget;
    //     files.fileName = file.name;
    //     files.fileType = file.type.split('/')[1];
    //     files.value = this.uploadFileData.result.split(',')[1];
    //     files.imageValue = this.uploadFileData.result;
    //     let index = this.multipleFilesList.findIndex(x => x.fileName == files.fileName);
    //     if (index === -1) {
    //       this.multipleFilesList.push(files);
    //       this.standingInstruction.filesDTOList.push(files); // Add to filesDTOList array
    //     }
    //     let timeStamp = this.commonComponent.getTimeStamp();
    //     this.standingInstruction.filesDTOList[0].fileName = "SB_STANADERED_INSTRUCTIONS" + this.sbAccId + "_" +timeStamp+ "_"+ file.name ;
    //     this.standingInstruction.signedCopyPath = "SB_STANADERED_INSTRUCTIONS" + this.sbAccId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
    //     let index1 = event.files.findIndex((x: any) => x === file);
    //     fileUpload.remove(event, index1);
    //     fileUpload.clear();
    //   }
    //   reader.readAsDataURL(file);
    // }
  }


fileRemoeEvent() {
//   let removeFileIndex = this.interestPaymentModel.fil.findIndex((obj: any) => obj && obj.fileName === this.interestPaymentModel.signedCopyPath);
//   let obj = this.interestPaymentModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.interestPaymentModel.signedCopyPath);
//   this.interestPaymentModel.filesDTOList.splice(removeFileIndex, 1);
//   this.interestPaymentModel.signedCopyPath = null;
}
}