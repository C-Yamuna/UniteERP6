import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FdCumulativeApplication } from 'src/app/transcations/term-deposits-transcation/fd-cumulative/fd-cumulative-stepper/fd-cumulative-application/shared/fd-cumulative-application.model';
import { FdCumulativeApplicationService } from 'src/app/transcations/term-deposits-transcation/fd-cumulative/fd-cumulative-stepper/fd-cumulative-application/shared/fd-cumulative-application.service';
import { FdCumulativeCommunication } from 'src/app/transcations/term-deposits-transcation/fd-cumulative/fd-cumulative-stepper/fd-cumulative-communication/shared/fd-cumulative-communication.model';
import { FdCumulativeKyc } from 'src/app/transcations/term-deposits-transcation/fd-cumulative/fd-cumulative-stepper/fd-cumulative-kyc/shared/fd-cumulative-kyc.model';
import { FdCumulativeNominee, MemberGuardianDetailsModelDetails } from 'src/app/transcations/term-deposits-transcation/fd-cumulative/fd-cumulative-stepper/fd-cumulative-nominee/shared/fd-cumulative-nominee.model';
import { MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from 'src/app/transcations/term-deposits-transcation/fd-cumulative/fd-cumulative-stepper/new-membership-add/shared/new-membership-add.model';
import { termdeposittransactionconstant } from 'src/app/transcations/term-deposits-transcation/term-deposit-transaction-constant';
import { approvaltransactionsconstant } from '../../../approval-transactions-constant';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { CommonCategoryService } from 'src/app/configurations/loan-config/common-category/shared/common-category.service';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-fd-cummulative-approval',
  templateUrl: './fd-cummulative-approval.component.html',
  styleUrls: ['./fd-cummulative-approval.component.css']
})
export class FdCummulativeApprovalComponent {
  responseModel!: Responsemodel;
  admissionNumber: any;
  msgs: any[] = [];
  id: any;
  fdCummulativeAccId: any;
  isView: any;
  kycGridList: any[] = [];
  orgnizationSetting: any;
  veiwFalg: boolean = false;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  addressOne: any;
  addressTwo: any;
  fdCumulativeApplicationModel: FdCumulativeApplication = new FdCumulativeApplication();
  fdCumulativeCommunicationModel: FdCumulativeCommunication = new FdCumulativeCommunication();
  kycDetailsModel: FdCumulativeKyc = new FdCumulativeKyc();
  nomineeDetailsModel: FdCumulativeNominee = new FdCumulativeNominee();
  memberGuardianDetailsModel: MemberGuardianDetailsModelDetails = new MemberGuardianDetailsModelDetails();
  membershipBasicRequiredDetailsModel: NewMembershipAdd = new NewMembershipAdd();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();

  kycDetailsColumns: any[] = [];
  serviceTypesColumns: any[] = [];
  serviceTypesGridList: any[] = [];
  nomineeMemberFullName: any;
  editOption: boolean = false;
  memberTypeName: any;
  preveiwFalg: any;
  flag: boolean = false;
  gardianFullName: any;
  promoterDetails: any;
  institutionPromoter: any;
  memberBasicDetailsFalg: boolean = false;
  memberGroupFlag: boolean = false;
  memberIntitutionFlag: boolean = false;
  memberPromoterDetails: any
  groupPromoterList: any[] = [];
  isNewMember: boolean = false;
  institutionPromoterFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  requiredDocumentsList: any[] = [];
  jointHolderDetailsList: any;
  jointHoldersFlag: boolean = false;

  groupPrmotersList: any[] = [];
  institutionPrmotersList: any[] = [];
  institutionPrmoters: any[] = [];
  groupPrmoters: any[] = [];
  photoCopyFlag: boolean = true;
  signatureCopyFlag: boolean = true;
  memberPhotoCopyZoom: boolean = false;
  membreIndividualFlag: boolean = false;
  isKycApproved: any;
  guardainFormEnable: boolean = false;
  isShowSubmit: boolean = applicationConstants.FALSE;
  amountblock: any[] = [];
  age: any;
  memberTypeList: any[] = [];
  editOpt: boolean = applicationConstants.FALSE;
  // approvalForm: FormGroup;
  statusList: any[] = [];
  isStaff: any;
  isFileUploaded: any;
  multipleFilesList: any;
  uploadFileData: any;
  isEdit: any;
  isDisableSubmit: boolean = false;
  viewButton: boolean = false;
  editFlag: boolean = false;
  APPROVED: any= CommonStatusData.APPROVED;
  REQUEST_FOR_RESUBMISSION: any= CommonStatusData.REQUEST_FOR_RESUBMISSION;
  REJECTED: any= CommonStatusData.REJECTED;


  constructor(private router: Router,
    private fdCumulativeApplicationService: FdCumulativeApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private encryptDecryptService: EncryptDecryptService,
    private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    private formBuilder: FormBuilder,
    private commonStatusService: CommonCategoryService,
    private fileUploadService: FileUploadService) {
    this.amountblock = [
      { field: 'Service Type', header: 'SERVICE TYPE' },
      { field: 'Service Charges', header: 'SERVICE CHARGES' },
      { field: 'Requested Date', header: 'REQUESTED DATE' },
    ];
    this.kycDetailsColumns = [
      { field: 'effStartDate', header: 'Approved Date' },
      { field: 'statusName', header: 'Status Name' },
      { field: 'docPath', header: 'Documents' },
    ];
    this.institutionPrmoters = [
      { field: 'surname', header: 'surname' },
      { field: 'name', header: 'name' },
      { field: 'operatorTypeName', header: 'operation type name' },
      { field: 'memDobVal', header: 'member Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderTypeName', header: 'gender name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile number' },
      { field: 'emailId', header: 'email' },
      { field: 'aadharNumber', header: 'aadhar' },
      { field: 'startDateVal', header: 'start date' },
    ];
    this.groupPrmoters = [
      { field: 'surname', header: 'surname' },
      { field: 'name', header: 'name' },
      { field: 'operatorTypeName', header: 'operation type name' },
      { field: 'memDobVal', header: 'member Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderName', header: 'gender name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile number' },
      { field: 'emailId', header: 'email' },
      { field: 'aadharNumber', header: 'aadhar' },
      { field: 'startDateVal', header: 'start date' },
    ];

    // this.statusList = [
    //   { label: 'Approved', value: 'Approved' },
    //   { label: 'Rejected', value: 'Rejected' },
    //   { label: 'Inprogress', value: 'Inprogress' },
    //   { label: 'Request for Resubmission', value: 'Request for Resubmission' },
    //   { label: 'Closed', value: 'Closed' }
    // ]
  }

  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();

    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined && params['editbutton'] != undefined) {
        let id = this.encryptDecryptService.decrypt(params['id']);
        let idEdit = this.encryptDecryptService.decrypt(params['editbutton']);
        this.fdCummulativeAccId = Number(id);

        if (idEdit == "1")
          this.preveiwFalg = true
        else {
          this.preveiwFalg = false;
        }
        if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
          let isGrid = this.encryptDecryptService.decrypt(params['isGridPage']);
          if (isGrid === "0") {
            this.isShowSubmit = applicationConstants.FALSE;
            this.viewButton = false;
            this.editFlag = true;
          } else {
            this.isShowSubmit = applicationConstants.TRUE;
          }
        }
        this.getFdCummApplicationById();
      }
    })
    this.getAllStatusList();
  }
  backbutton() {
    this.router.navigate([approvaltransactionsconstant.FD_CUMMULATIVE_APPROVAL_TRANSACTION_DETAILS]);
  }
  submit() {
    // Determine the status name before submission
    if (this.fdCumulativeApplicationModel.status != null && this.fdCumulativeApplicationModel.status != undefined) {
      const statusName = this.statusList.find((data: any) => data != null && data.value === this.fdCumulativeApplicationModel.statusName);
      if (statusName != null && statusName != undefined) {
        this.fdCumulativeApplicationModel.statusName = statusName.label;
      }
    } else {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
    if (this.fdCumulativeApplicationModel.depositDate != null && this.fdCumulativeApplicationModel.depositDate != undefined) {
      this.fdCumulativeApplicationModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdCumulativeApplicationModel.depositDate));
    }
    this.fdCumulativeApplicationService.updateFdCummApplication(this.fdCumulativeApplicationModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
          this.router.navigate([approvaltransactionsconstant.FD_CUMMULATIVE_APPROVAL_TRANSACTION_DETAILS]);
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
  getFdCummApplicationById() {
    this.fdCumulativeApplicationService.getFdCummApplicationById(this.fdCummulativeAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {


        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.fdCumulativeApplicationModel = this.responseModel.data[0];
          if (this.fdCumulativeApplicationModel.depositDate != null && this.fdCumulativeApplicationModel.depositDate != undefined) {
            this.fdCumulativeApplicationModel.depositDate = this.datePipe.transform(this.fdCumulativeApplicationModel.depositDate, this.orgnizationSetting.datePipe);
          }
          if (this.fdCumulativeApplicationModel.memberTypeName != null && this.fdCumulativeApplicationModel.memberTypeName != undefined) {
            this.memberTypeName = this.fdCumulativeApplicationModel.memberTypeName;
          }
          if (this.fdCumulativeApplicationModel.signedCopyPath != null && this.fdCumulativeApplicationModel.signedCopyPath != undefined) {
            this.fdCumulativeApplicationModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.fdCumulativeApplicationModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.fdCumulativeApplicationModel.signedCopyPath);
            this.isDisableSubmit = false;
          }
          else {
            this.isDisableSubmit = true;
          }
          if (this.fdCumulativeApplicationModel != null && this.fdCumulativeApplicationModel != undefined) {
            if (this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO != undefined && this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO != null) {
              this.membershipBasicRequiredDetailsModel = this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO;
              if (this.membershipBasicRequiredDetailsModel.isNewMember != null && this.membershipBasicRequiredDetailsModel.isNewMember != undefined) {
                this.isNewMember = this.membershipBasicRequiredDetailsModel.isNewMember;
              }
              if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
                this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
              }
              if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
                this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.membershipBasicRequiredDetailsModel.photoPath != null && this.membershipBasicRequiredDetailsModel.photoPath != undefined) {
                this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoPath);
              }
              else {
                this.photoCopyFlag = false;
              }
              if (this.membershipBasicRequiredDetailsModel.signaturePath != null && this.membershipBasicRequiredDetailsModel.signaturePath != undefined) {
                this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signaturePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signaturePath);
              }
              else {
                this.signatureCopyFlag = false;
              }
              if (this.membershipBasicRequiredDetailsModel.isStaff != null && this.membershipBasicRequiredDetailsModel.isStaff != undefined && this.membershipBasicRequiredDetailsModel.isStaff) {
                // this.membershipBasicRequiredDetailsModel.isStaff = applicationConstants.YES;
                this.isStaff = true;
              }
              else {
                // this.membershipBasicRequiredDetailsModel.isStaff = applicationConstants.NO;
                this.isStaff = false;
              }
              if (this.membershipBasicRequiredDetailsModel.isKycApproved != null && this.membershipBasicRequiredDetailsModel.isKycApproved != undefined && this.membershipBasicRequiredDetailsModel.isKycApproved) {
                this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
              }
              else {
                this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
              }
              if (this.responseModel.data[0].memberShipBasicDetailsDTO.age != null && this.responseModel.data[0].memberShipBasicDetailsDTO.age != undefined) {
                this.age = this.responseModel.data[0].memberShipBasicDetailsDTO.age;
                if (this.age < 18) {
                  this.guardainFormEnable = true;
                }
              }
            }
            if (this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO != undefined && this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO != null) {
              this.memberGroupDetailsModel = this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO;
              if (this.memberGroupDetailsModel.isNewMember != null && this.memberGroupDetailsModel.isNewMember != undefined) {
                this.isNewMember = this.memberGroupDetailsModel.isNewMember;
              }
              if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0) {
                this.groupPrmotersList = this.memberGroupDetailsModel.groupPromoterList;
              }
              if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
                this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
              }
              if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
                this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0) {
                this.groupPrmotersList = this.memberGroupDetailsModel.groupPromoterList.map((member: any) => {
                  if (member != null && member != undefined) {
                    if (member.dob != null && member.dob != undefined) {
                      member.memDobVal = this.datePipe.transform(member.dob, this.orgnizationSetting.datePipe);
                    }
                    if (member.startDate != null && member.startDate != undefined) {
                      member.startDateVal = this.datePipe.transform(member.startDate, this.orgnizationSetting.datePipe);
                    }
                  }
                  return member;
                });
                if (this.memberGroupDetailsModel.memberTypeName != null && this.memberGroupDetailsModel.memberTypeName != undefined) {
                  this.fdCumulativeApplicationModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
                }
                if (this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined) {
                  this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO = this.memberGroupDetailsModel;
                }
              }
              if (this.memberGroupDetailsModel.isKycApproved != null && this.memberGroupDetailsModel.isKycApproved != undefined) {
                this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
              }
              else {
                this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
              }
            }
          }
          if (this.fdCumulativeApplicationModel.memInstitutionDTO != undefined && this.fdCumulativeApplicationModel.memInstitutionDTO != null) {
            this.membershipInstitutionDetailsModel = this.fdCumulativeApplicationModel.memInstitutionDTO;
            if (this.membershipInstitutionDetailsModel.isNewMember != null && this.membershipInstitutionDetailsModel.isNewMember != undefined) {
              this.isNewMember = this.membershipInstitutionDetailsModel.isNewMember;
            }
            if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
              this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
              this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0) {
              this.institutionPrmotersList = this.membershipInstitutionDetailsModel.institutionPromoterList;
            }
            if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0) {
              this.institutionPrmotersList = this.membershipInstitutionDetailsModel.institutionPromoterList.map((member: any) => {
                if (member != null && member != undefined) {
                  if (member.dob != null && member.dob != undefined) {
                    member.memDobVal = this.datePipe.transform(member.dob, this.orgnizationSetting.datePipe);
                  }
                  if (member.startDate != null && member.startDate != undefined) {
                    member.startDateVal = this.datePipe.transform(member.startDate, this.orgnizationSetting.datePipe);
                  }
                }
                return member;
              });
              if (this.memberGroupDetailsModel.memberTypeName != null && this.memberGroupDetailsModel.memberTypeName != undefined) {
                this.fdCumulativeApplicationModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
              }
              if (this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined) {
                this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO = this.memberGroupDetailsModel;
              }
            }
            if (this.membershipInstitutionDetailsModel.isKycApproved != null && this.membershipInstitutionDetailsModel.isKycApproved != undefined) {
              this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
            }
            else {
              this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
            }
          }
          if (this.fdCumulativeApplicationModel.fdCummulativeAccountCommunicationList != null && this.fdCumulativeApplicationModel.fdCummulativeAccountCommunicationList != undefined &&
            this.fdCumulativeApplicationModel.fdCummulativeAccountCommunicationList[0] != null && this.fdCumulativeApplicationModel.fdCummulativeAccountCommunicationList[0] != undefined)
            this.fdCumulativeCommunicationModel = this.fdCumulativeApplicationModel.fdCummulativeAccountCommunicationList[0];

          if (this.fdCumulativeApplicationModel.fdCummulativeAccountKycList != null && this.fdCumulativeApplicationModel.fdCummulativeAccountKycList != undefined) {
            this.kycGridList = this.fdCumulativeApplicationModel.fdCummulativeAccountKycList;
            for (let kyc of this.kycGridList) {
              kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              if (kyc.multipartFileList != null && kyc.multipartFileList != undefined) {
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              }
            }
          }

          if (this.fdCumulativeApplicationModel.fdCummulativeAccountNomineeList != null && this.fdCumulativeApplicationModel.fdCummulativeAccountNomineeList != undefined &&
            this.fdCumulativeApplicationModel.fdCummulativeAccountNomineeList[0] != null && this.fdCumulativeApplicationModel.fdCummulativeAccountNomineeList[0] != undefined)
            this.nomineeDetailsModel = this.fdCumulativeApplicationModel.fdCummulativeAccountNomineeList[0];
          if (this.nomineeDetailsModel.signedCopyPath != null && this.nomineeDetailsModel.signedCopyPath != undefined) {
            this.nomineeDetailsModel.nomineeSighnedFormMultiPartList = this.fileUploadService.getFile(this.nomineeDetailsModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.nomineeDetailsModel.signedCopyPath);
          }

          if (this.fdCumulativeApplicationModel.fdCummulativeAccountGaurdianList != null && this.fdCumulativeApplicationModel.fdCummulativeAccountGaurdianList != undefined &&
            this.fdCumulativeApplicationModel.fdCummulativeAccountGaurdianList[0] != null && this.fdCumulativeApplicationModel.fdCummulativeAccountGaurdianList[0] != undefined)
            this.memberGuardianDetailsModel = this.fdCumulativeApplicationModel.fdCummulativeAccountGaurdianList[0];
          if (this.memberGuardianDetailsModel.signedCopyPath != null && this.memberGuardianDetailsModel.signedCopyPath != undefined) {
            this.memberGuardianDetailsModel.guardainSighnedMultipartFiles = this.fileUploadService.getFile(this.memberGuardianDetailsModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGuardianDetailsModel.signedCopyPath);
          }
          if (this.fdCumulativeApplicationModel.accountTypeName != null && this.fdCumulativeApplicationModel.accountTypeName != undefined && this.fdCumulativeApplicationModel.accountTypeName === "Joint") {
            this.jointHoldersFlag = true;
          }
          if (this.fdCumulativeApplicationModel.fdCummulativeJointAccHolderDetailsDTOList != null && this.fdCumulativeApplicationModel.fdCummulativeJointAccHolderDetailsDTOList != undefined && this.fdCumulativeApplicationModel.fdCummulativeJointAccHolderDetailsDTOList.length > 0) {
            this.jointHoldersFlag = true;
            this.jointHolderDetailsList = this.fdCumulativeApplicationModel.fdCummulativeJointAccHolderDetailsDTOList;
          }
        }
      } else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, (error: any) => {
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });

  }


  fileUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if (this.isEdit && this.fdCumulativeApplicationModel.filesDTOList == null || this.fdCumulativeApplicationModel.filesDTOList == undefined) {
      this.fdCumulativeApplicationModel.filesDTOList = [];
    }
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
        this.multipleFilesList.push(files);
        let timeStamp = this.commonComponent.getTimeStamp();
        this.fdCumulativeApplicationModel.multipartFileListsignedCopyPath = [];
        this.fdCumulativeApplicationModel.filesDTOList.push(files);
        this.fdCumulativeApplicationModel.signedCopyPath = null;
        this.fdCumulativeApplicationModel.filesDTOList[this.fdCumulativeApplicationModel.filesDTOList.length - 1].fileName = "FD_Signed_Copy" + "_" + timeStamp + "_" + file.name;
        this.fdCumulativeApplicationModel.signedCopyPath = "FD_Signed_Copy" + "_" + timeStamp + "_" + file.name;
      }
      reader.readAsDataURL(file);
    }
  }
  fileRemoveEvent() {
    if (this.fdCumulativeApplicationModel.filesDTOList != null && this.fdCumulativeApplicationModel.filesDTOList != undefined && this.fdCumulativeApplicationModel.filesDTOList.length > 0) {
      let removeFileIndex = this.fdCumulativeApplicationModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.fdCumulativeApplicationModel.signedCopyPath);
      this.fdCumulativeApplicationModel.filesDTOList.splice(removeFileIndex, 1);
      this.fdCumulativeApplicationModel.signedCopyPath = null;
    }
  }

  // for submit button validation based on status
  onStatusChange(event: any) {
    if (this.fdCumulativeApplicationModel.statusName != null && this.fdCumulativeApplicationModel.statusName != undefined) {
      this.isDisableSubmit = false;
    }
    else {
      this.isDisableSubmit = true;
    }
  }

  getAllStatusList() {
    this.commonStatusService.getAllCommonStatus().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.statusList = this.responseModel.data;
            this.statusList = this.statusList.filter((obj: any) => obj != null && obj.name === CommonStatusData.REJECTED || obj.name === CommonStatusData.APPROVED ||
              obj.name === CommonStatusData.REQUEST_FOR_RESUBMISSION).map((status: { name: any; id: any; }) => {
            return { label: status.name, value: status.id };
            });
          }else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }
    },
      error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }

  onClick() {
    this.institutionPromoterFlag = true;

  }
  onClickOfGroupPromotes() {
    this.groupPromotersPopUpFlag = true;
  }

  close() {
    this.institutionPromoterFlag = false;
    this.groupPromotersPopUpFlag = false;
    this.membreIndividualFlag = false;
  }

  /**
   * @implement onclose popup
   */
  closePhotoCopy() {
    this.memberPhotoCopyZoom = false;
  }

  /**
   * @implement Image Zoom POp up
   */
  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }

  /**
   * @implements close photo dialogue
   */
  closePhoto() {
    this.memberPhotoCopyZoom = false;
  }

  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }
}
