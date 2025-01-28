import { MemberGroupBasicDetails } from './shared/member-group-details-model';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem, MenuItem } from 'primeng/api';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { Membershiptransactionconstant } from './membership-transaction-constant';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicDetailsService } from './shared/membership-basic-details.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';
import { MembershipGroupDetailsService } from './shared/membership-group-details.service';
import { MemInstitutionService } from './shared/mem-institution.service';
import { TieredMenu } from 'primeng/tieredmenu';
import { ERP_TRANSACTION_CONSTANTS } from '../erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonStatusData, MemberShipTypesData } from '../common-status-data.json';
import { MemberBasicDetails } from './shared/member-basic-details.model';


@Component({
  selector: 'app-membership-transcation',
  templateUrl: './membership-transcation.component.html',
  styleUrls: ['./membership-transcation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MembershipTranscationComponent {
  columns: any[] = [];
  statuses!: SelectItem[];
  addmembership: any;
  membershiplist: any;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  value: number = 0;
  editViewButton: boolean = false;
  responseModel!: Responsemodel;
  gridListData: any[] = [];
  gridListDataFGroup: any[] = [];
  gridListDataIntsitute: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  tempGridListData: any[] = [];
  societyCode: any;
  branchId: number = 1;
  membershipId: any;
  pacsId: number = 1;
  gridListLenght: Number | undefined;
  columnsGroup: any[] = [];
  columnsInstitution: any[] = [];
  groupDetailsGridList: any[] = [];
  institutionDetailsList: any[] = [];
  selection: number = 0;
  tempInstituListData: any[] = [];
  tempGroupListData: any[] = [];
  operations: any;
  activeIndex: any;
  //dynamic pagination field
  subColumns: any;
  casteList: any[] = []
  id: any;
  page = 0;
  size = 5;
  lastPage: any;
  // isLastPage:false;
  preButton: boolean = false;
  casteDTOList: any[] = [];
  sizeList: any[] = [];
  statusNameList: any[] = [];
  totalIndividualProfileCount: any;
  totalGroupProfileCount: any;
  totalInstitutionProfileCount: any;
  tempStatusNameList: any[] = [];
  productTypeList: any[] = [];
  isRejected :Boolean = false;
  showDialog: boolean= false;
  showDialogs: boolean= false;

  showForm: boolean = false;

  membershiplists: MenuItem[] | undefined;

  activeStatusCount: number = 0;
  inactiveStatusCount: number = 0;

  groupActive: number = 0;
  groupInActive: number = 0;

  institutionActive: number = 0;
  institutionInActive: number = 0;
  memberPhotoCopyZoom: boolean = false;
  memberphotCopyMultipartFileList: any[] = [];
  operationslist: any[] = [];
  memberBasicDetailsModel: MemberBasicDetails = new MemberBasicDetails();
  multipartFileListForsignatureCopyPath: any;
  multipartFileListForPhotoCopy: any;
  memberIndividual:  boolean = false;
  createdCount: any;
  submissionForApprovalCount: any;
  approvedCount: any;
  requestForResubmmissionCount: any;
  rejectCount: any;

  constructor(private router: Router, private translate: TranslateService, private datePipe: DatePipe, private commonComponent: CommonComponent,
    private commonFunctionsService: CommonFunctionsService, private membershipBasicDetailsService: MembershipBasicDetailsService, private encryptDecryptService: EncryptDecryptService,
    private fileUploadService: FileUploadService,) {
    this.operationslist = [
      { label: "Closure ", value: 1 },
      { label: " A-class to B-class and Vice versa", value: 2 },
    ]
  }

  ngOnInit(): void {
    // this.productTypeList = this.commonComponent.individualProductTypeList();
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });

    this.membershiplists = [
      {
        label: MemberShipTypesData.INDIVIDUAL, icon: 'fa fa-user', routerLink: Membershiptransactionconstant.INDIVIDUAL_BASIC_DETAILS,

      },
      {
        label: MemberShipTypesData.GROUP, icon: 'fa fa-group', routerLink: Membershiptransactionconstant.GROUP_BASIC_DETAILS,

      },
      {
        label: MemberShipTypesData.INSTITUTION, icon: 'fa fa-building', routerLink: Membershiptransactionconstant.INSTITUTION_BASIC_DETAILS,

      },
    ]
    this.columns = [
      { field: 'admissionNumber', header: 'ERP.ADMISSION_NO' },
      { field: 'name', header: 'ERP.NAME' },
      { field: 'memberTypeName', header: 'ERP.MEMBER_TYPE' },
      { field: 'subProductName', header: 'ERP.CLASS' },
      { field: 'admissionDate', header: 'ERP.ADMISSION_DATE' },
      { field: 'aadharNumber', header: 'ERP.AADHAR_NO' },
      { field: 'panNumber', header: 'ERP.PAN_NO' },
      { field: 'mobileNumber', header: 'ERP.MOBILE_NO' },
      // { field: 'KYC', header: 'KYC' },
      { field:'statusName', header: 'Status' },
      // { field: 'Action', header: 'ACTION' },
    ];

    let tabLabels = [
      'Total Members',
      'No Of Individuals',
      'No Of Group Members',
      'No Of Institution Numbers',
      'KYC Approved',
      'KYC Pending',
    ];
    this.items = tabLabels.map((label, index) => ({ label: label, value: `${index + 1}` }));
    //  tabLabels = Array.from({length: 100000}).map((_, i) => `Item #${i}`);

    this.gridList();
  }

  createaccount() { }
  view(rowData: any) {
    this.router.navigate([Membershiptransactionconstant.VIEW_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), type: this.encryptDecryptService.encrypt(rowData.memberTypeName), editbtn: this.encryptDecryptService.encrypt(3) } });
  }
  navigateToInfoDetails(event: any) {
    if (event.value === 1)
      this.router.navigate([Membershiptransactionconstant.INDIVIDUAL_BASIC_DETAILS]);
    else if (event.value === 2)
      this.router.navigate([Membershiptransactionconstant.GROUP_BASIC_DETAILS]);
    else if (event.value === 3)
      this.router.navigate([Membershiptransactionconstant.INSTITUTION_BASIC_DETAILS]);

  }
  gridList() {
    this.commonComponent.startSpinner();
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.membershipBasicDetailsService.getAllGridList(this.pacsId, this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != undefined && this.responseModel != null) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          // this.memberBasicDetailsModel = this.responseModel.data[0];
          this.gridListData = this.responseModel.data;
          this.gridListData = this.gridListData.map(membership => {
            membership.admissionDate = this.datePipe.transform(membership.admissionDate, this.orgnizationSetting.datePipe) || '';
            membership.dob = this.datePipe.transform(membership.dob, this.orgnizationSetting.datePipe) || '';
            
            if(membership.memberTypeName == 'Individual'){
              this.memberIndividual = true;
            }
            this.memberIndividual = false;
            if (membership.photoCopyPath != null && membership.photoCopyPath != undefined ) {
            this.multipartFileListForPhotoCopy = membership.multipartFileListForPhotoCopy
            this.multipartFileListForPhotoCopy = this.fileUploadService.getFile(membership.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + membership.photoCopyPath);
             this.showDialog = true;
            }
            else{
              this.showDialog = false;
            }
            if (membership.signatureCopyPath != null && membership.signatureCopyPath != undefined ) {
              this.multipartFileListForsignatureCopyPath = membership.multipartFileListForsignatureCopyPath;
              this.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(membership.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + membership.signatureCopyPath);
              this.showDialogs = true;
            }
            else{
              this.showDialogs = false;
            }
            membership.isRejected = false;
            if (membership.statusName == CommonStatusData.APPROVED || membership.statusName == CommonStatusData.REJECTED) {
              if (membership.statusName == CommonStatusData.REJECTED) {
                membership.isRejected = true;
              }
              membership.viewButton = true;
            } else {
              membership.viewButton = false;
            }

            this.createdCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.IN_PROGRESS).length;
            this.submissionForApprovalCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL).length;
            this.approvedCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.APPROVED).length;
            this.requestForResubmmissionCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.REQUEST_FOR_RESUBMISSION).length;
            this.rejectCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.REJECTED).length;

            return membership
          });
         

        }
        this.commonComponent.stopSpinner();
      }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      this.commonComponent.stopSpinner();
    });
  }

  editMemberDetails(rowData: any) {
    this.router.navigate([Membershiptransactionconstant.VIEW_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), type: this.encryptDecryptService.encrypt(rowData.memberTypeName), editbtn: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE) } });
    this.editViewButton = true;
  }
  onChange() {
    this.showForm = !this.showForm;
  }
  onClickMemberPhotoCopy(rowData: any) {
    this.memberPhotoCopyZoom = true;
    this.memberphotCopyMultipartFileList = [];
    this.memberphotCopyMultipartFileList = rowData.multipartFileListForPhotoCopy;
  }
  closePhoto() {
    this.memberPhotoCopyZoom = false;
  }

 
  navigateToClosure(rowData: any) {
    this.router.navigate([Membershiptransactionconstant.CLOSURE_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), type: this.encryptDecryptService.encrypt(rowData.memberTypeName)}});
  }
}
