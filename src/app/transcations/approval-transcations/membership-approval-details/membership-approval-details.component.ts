import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';
import { Membershiptransactionconstant } from '../../membership-transcation/membership-transaction-constant';
import { MemInstitutionService } from '../../membership-transcation/shared/mem-institution.service';
import { MembershipBasicDetailsService } from '../../membership-transcation/shared/membership-basic-details.service';
import { MembershipGroupDetailsService } from '../../membership-transcation/shared/membership-group-details.service';
import { CommonStatusData } from '../../common-status-data.json';

@Component({
  selector: 'app-membership-approval-details',
  templateUrl: './membership-approval-details.component.html',
  styleUrls: ['./membership-approval-details.component.css']
})
export class MembershipApprovalDetailsComponent {
  columns: any[] = [];
 
  addmembership: any;
  membershiplist: any;
  value: number = 0;
  editViewButton:boolean=false;
  responseModel!: Responsemodel;
  gridListData: any[] = [];
  gridListDataFGroup: any[] = [];
  gridListDataIntsitute: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  tempGridListData: any[] = [];
  societyCode: any;
  branchId:number =1;
  membershipId: any;
  pacsId:number =1;
  gridListLenght: Number | undefined;
  columnsGroup: any[] = [];
  columnsInstitution: any[] = [];
  groupDetailsGridList: any[] = [];
  institutionDetailsList: any[] = [];
  selection: number = 0;
  tempInstituListData: any[] = [];
  tempGroupListData: any[] = [];
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
  productTypeList: any[]=[];

  showForm: boolean=false;

  membershiplists: MenuItem[] | undefined;

  activeStatusCount: number = 0;
  inactiveStatusCount: number = 0;

  groupActive: number = 0;
  groupInActive: number = 0;

  institutionActive: number = 0;
  institutionInActive: number = 0;
  memberPhotoCopyZoom: boolean =false;
  memberphotCopyMultipartFileList: any[]=[];
  viewButton:  boolean =false;
  approveButton: boolean =false;

  constructor(private router: Router, private translate: TranslateService, private datePipe: DatePipe, private commonComponent: CommonComponent,
    private commonFunctionsService: CommonFunctionsService, private membershipBasicDetailsService: MembershipBasicDetailsService, private encryptDecryptService: EncryptDecryptService,
    private membershipGroupDetailsService: MembershipGroupDetailsService, private memInstitutionService: MemInstitutionService,private fileUploadService :FileUploadService,) { }

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
      { field: 'statusName', header: 'Status' },
      // { field: 'Action', header: 'ACTION' },
    ];

    this.gridList();
  }
  createaccount() { }
  view(rowData: any) {
    this.router.navigate([Membershiptransactionconstant.VIEW_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) , type: this.encryptDecryptService.encrypt(rowData.memberTypeName),editbtn:this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE),isGridPage:this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE)}});
  }
  approve(rowData: any) {
    this.router.navigate([Membershiptransactionconstant.MEMBERSHIP_APPROVAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) , type: this.encryptDecryptService.encrypt(rowData.memberTypeName),isGridPage:this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE)}});
  }
  gridList() {
     this.commonComponent.startSpinner();
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.membershipBasicDetailsService.getAllGridList(this.pacsId,this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.gridListData = this.responseModel.data;
        this.gridListData = this.gridListData.filter(obj=>obj !=  null && obj.statusName != CommonStatusData.IN_PROGRESS).map(membership => {
          membership.admissionDate = this.datePipe.transform(membership.admissionDate, this.orgnizationSetting.datePipe) || '';
          membership.dob = this.datePipe.transform(membership.dob, this.orgnizationSetting.datePipe) || '';

          if (membership.photoCopyPath != null && membership.photoCopyPath != undefined) {
            membership.multipartFileListForPhotoCopy = this.fileUploadService.getFile(membership.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + membership.photoCopyPath  );
          }
          if(membership.statusName == CommonStatusData.APPROVED || membership.statusName == CommonStatusData.REJECTED){
            membership.viewButton = true;
          }else{
            membership.viewButton = false;
          }
          return membership
        });
          this.activeStatusCount = this.gridListData.filter(membership => membership.memStatus === applicationConstants.ACTIVE).length;
          this.inactiveStatusCount = this.gridListData.filter(membership => membership.memStatus === applicationConstants.IN_ACTIVE).length;
      }
       this.commonComponent.stopSpinner();
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail:  applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      this.commonComponent.stopSpinner();
    });
  }
 
  onChange(){
    this.showForm = !this.showForm;
  }

  onClickMemberPhotoCopy(rowData : any){
    this.memberPhotoCopyZoom = true;
    this.memberphotCopyMultipartFileList = [];
    this.memberphotCopyMultipartFileList = rowData.multipartFileListForPhotoCopy ;
  }
  closePhoto(){
    this.memberPhotoCopyZoom = false;
  }
  


}

