import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { MainMenuService } from './shared/main-menu.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { environment } from 'src/environments/environment';
import { savingsbanktransactionconstant } from 'src/app/transcations/savings-bank-transcation/savingsbank-transaction-constant';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainmenuComponent implements OnInit {

  items: any[] = [];
  selectedIndex: number = 0;
  menus: any;
  roleName: any;
  userName: any;
  visibleSidebar: boolean = false;
  societyCode: any;
  societyName: any;
  issuesList: any[] = [];
  responseModel: Responsemodel = new Responsemodel();
  msgs: any[] = [];
  // issuesModel: Isssues = new Isssues();
  filesList: any[] = [];
  files: any;
  fileData: any;
  societyId: any;
  userId: any;
  // @ViewChild('screen', { static: true }) screen: any;
  file: any;
  // actionStep: string = "";
  issuePacsId: any;
  uploadFilesList: any[] = [];
  uploadFileData: any;
  uploadFile: any;
  image: any;
  imageURL: any;
  screenshot: boolean = false;
  displayAddIssue: boolean = false;
  // pacs: PacsDetails = new PacsDetails();
  // pacsScreenCaptureModel: PacsScreenCaptureModel = new PacsScreenCaptureModel();
  pacsName: any;
  lastDot = /\.(?=[^\.]+$)/;
  translate: MenuItem[] = [];
  Translates: any[] = [];
  languageLabel: any;
  translateLang;
  TranslatesResponsive = [];
  profilesList: any[] = [];
  userProfile: any;
  menuItems: any[] = [];
  defaultMenu: any;
  returnUrl: any;
  isAdminRole: boolean = false;
  itemsHeader: any;
  tooltipItems: MenuItem[] = [];
  isDarkCeruleanTheme = false;
  isGreenTheme = false;
  position: string = 'center';
  display: boolean = false;
  isSidebarOpen = false;

  constructor(private router: Router,
    private authenticationService: AuthenticationService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService,
    private _translate: TranslateService, private commonComponent: CommonComponent,
    private commonService: CommonFunctionsService, private mainmenuService: MainMenuService,
    private commonHttpService: CommonHttpService,
    private route: ActivatedRoute, private messageService: MessageService, private renderer: Renderer2) {

    this._translate.setDefaultLang(this.commonService.getStorageValue('language'));
    this._translate.use(this.commonService.getStorageValue('language'));

    if (this.commonService.getStorageValue('language') == 'en') {
      this.translateLang = 'en';
      this.commonService.languageSelection('en');
    } else if (this.commonService.getStorageValue('language') == 'te') {
      this.translateLang = 'te';
      this.commonService.languageSelection('te');
    } else {
      this.translateLang = 'hi';
      this.commonService.languageSelection('hi');
    }

  }

  ngOnInit() {
    this.tooltipItems = [
      {
        tooltipOptions: {
          tooltipLabel: 'Add'
        },
        icon: 'pi pi-pencil',
        command: () => {
          this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Update'
        },
        icon: 'pi pi-refresh',
        command: () => {
          this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Delete'
        },
        icon: 'pi pi-trash',
        command: () => {
          this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
        }
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Upload'
        },
        icon: 'pi pi-upload'
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Angular Website'
        },
        icon: 'pi pi-external-link',
        url: 'http://angular.io'
      }
    ];

    this.commonService.data.subscribe((res: any) => {
      if (res) {
        this._translate.use(res);
      } else {
        this._translate.use(this.commonService.getStorageValue('language'));
      }
    });

    this.Translates = [
      { label: 'English', value: 'en', icon: 'fa fa-globe' },
      { label: 'తెలుగు', value: 'te', icon: 'fa fa-globe' },
      { label: 'हिंदी', value: 'hi', icon: 'fa fa-globe' }
    ];
    // icon: 'fa fa-globe'
    this.roleName = this.commonService.getStorageValue(applicationConstants.roleName);
    this.userName = this.commonService.getStorageValue(applicationConstants.userName);
    this.userId = this.commonService.getStorageValue(applicationConstants.userId);
    this.profilesList = [
      { label: this.userName, value: 'userName', icon: 'fa fa-envelope' },
      { label: 'Profile', value: 'profile', icon: 'fa fa-user' },
      { label: 'Settings', value: 'settings', icon: 'fa fa-cog' },
      { label: 'Logout', value: 'logout', icon: 'fa fa-sign-out' },
      { label: 'Product Definition', value: 'productDefinition', icon: 'fa fa-product-hunt' }
    ]
    this.itemsHeader = [
      {
        styleClass: 'responsive-notification',
        icon: 'fa fa-bell',
        badge: '5'
      },
      {
        styleClass: 'responsive-laguage-dropdown',
        icon: 'fa fa-globe',
        items: [
          { label: 'English', command: (event: Event) => { this.languageChange(event); } },
          { label: 'తెలుగు', command: (event: Event) => { this.languageChange(event); } },
          { label: 'हिंदी', command: (event: Event) => { this.languageChange(event); } },
        ]
      },
      {
        styleClass: 'responsive-profile-dropdown',
        icon: 'fa fa-envelope',
        items: [
          { label: this.userName, value: 'userName', icon: 'fa fa-envelope', command: () => { this.profileChange('userName') } },
          { label: 'Profile', value: 'profile', icon: 'fa fa-user', command: () => { this.profileChange('profile') } },
          { label: 'Settings', value: 'settings', icon: 'fa fa-cog', command: () => { this.profileChange('settings') } },
          { label: 'Change password', value: 'changePassword', icon: 'fa fa-key', command: () => { this.profileChange('changePassword') } },
          { label: 'Logout', value: 'logout', icon: 'fa fa-sign-out', command: () => { this.profileChange('logout') } },
          { label: 'Product Definition', value: 'productDefinition', icon: 'fa fa-product-hunt', command: () => { this.profileChange('productDefinition') } }
        ]
      }
    ]

    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    this.returnUrl = snapshot.url || 'menu';

    this.getItems();

    if (this.roleName == "Admin") {
      this.isAdminRole = applicationConstants.TRUE;
    } else {
      this.isAdminRole = applicationConstants.FALSE;
    }
  }

  // Old Method
  // getItems() {
  //   let url = environment.rbac +
  //     applicationConstants.GET_DYNAMIC_MENUS
  //   this.commonHttpService.getAll(url).subscribe((response: any) => {
  //     if (response != null && response.data != null && response.data != undefined && response.data.length > 0 && response.data[0]['level0'] && response.data[0].level0.length > 0) {
  //       this.items = [];
  //       response.data[0].level0.forEach((x: any) => {
  //         let level2Menus: any[] = [];
  //         x.level1.forEach((y: any) => {
  //           y.level2.forEach((z: any) => {
  //             let level2Menu = {
  //               label: z.featureName,
  //               icon: z.icon,
  //               routerLink: z.featurePath.toLowerCase(),
  //               command: (event: Event) => { this.clickmenu(event); },
  //             }
  //             level2Menus.push(level2Menu);
  //           })
  //         })
  //         let level0Menus = {
  //           label: x.menuName,
  //           items: level2Menus,
  //           icon: "fa fa-address-book-o",
  //         }
  //         this.items.push(level0Menus);
  //       })
  //     }
  //   })
  // }

  // New Method
  getItems() {
    let url = environment.rbac + applicationConstants.GET_DYNAMIC_MENUS;
    this.commonHttpService.getAll(url).subscribe((response: any) => {
      if (response != null && response.data != null && response.data != undefined && response.data.length > 0 && response.data[0]['level0'] && response.data[0].level0.length > 0) {
        this.items = [];
        response.data[0].level0.forEach((x: any) => {
          let level2Menus: any[] = [];
          x.level1.forEach((y: any) => {
            y.level2.forEach((z: any) => {
              let level2Menu = {
                label: z.featureName,
                icon: z.icon,
                routerLink: z.featurePath.toLowerCase(),
                command: (event: Event) => {
                  this.clickmenu(event);
                  this.closeSidebar();
                },
              };
              level2Menus.push(level2Menu);
            });
          });

          let level0Menus = {
            label: x.menuName,
            items: level2Menus,
            icon: "fa fa-address-book-o",
          };
          this.items.push(level0Menus);
        });

        const activeMenu = sessionStorage.getItem('activeMenu');
        if (activeMenu) {
          // If a stored menu exists, navigate to that route
          this.router.navigate([activeMenu]);
        } else if (this.items.length > 0 && this.items[0].items.length > 0) {
          // Set the first sub-menu as selected by default
          const firstSubMenu = this.items[0].items[0];
          this.clickFirstMenu({ item: firstSubMenu });
        }
      }
    });
  }

  clickFirstMenu(event: any) {
    this.router.navigate([event.item.routerLink])
  }

  clickmenu(event: any) {
    // Check if the route is different
    if (this.router.url !== event.item.routerLink) {
      this.commonComponent.startSpinner();
      // Store the active menu in localStorage/sessionStorage
      sessionStorage.setItem('activeMenu', event.item.routerLink); // Save active menu
    }
  }

  profileChange(profileValue: any) {
    if (profileValue === 'logout') {
      this.logOut();
    }
    else if (profileValue === 'productDefinition') {
      this.productDefinition();
    }
  }

  onSearchClick() { }

  toggleTopMenu(event: any) { }

  languageChange(lang: any) {
    if (lang === 'en') {
      this.commonService.languageSelection('en');
      this.translateLang = 'en';
      this.commonService.setStorageValue('language', 'en');
      this._translate.use('en');
    } else if (lang === 'hi') {
      this.translateLang = 'hi';
      this.commonService.languageSelection('hi');
      this.commonService.setStorageValue('language', 'hi');
      this._translate.use('hi');
    }
    else {
      this.translateLang = 'te';
      this.commonService.languageSelection('te');
      this.commonService.setStorageValue('language', 'te');
      this._translate.use('te');
    }
  }

  select(index: number) {
    this.selectedIndex = index;
    this.hideBar();
  }

  defultNavigation() {
    this.items.filter((each, index) => {
      if (this.router.url.includes('/' + each.url)) {
        this.selectedIndex = index;
        return each;
      }
    });
  }

  hideBar() {
    this.visibleSidebar = false;
  }

  showBar() {
    this.visibleSidebar = true;
  }

  logOut() {
    this.authenticationService.logout();
    sessionStorage.clear();
    this.commonService.setStorageValue('language', 'en');
    this.router.navigate(['']);
  }

  productDefinition() {
    this.router.navigate([savingsbanktransactionconstant.SB_PRODUCT_DEFINITION]);
  }

  generateName(): string {
    const date: number = new Date().valueOf();
    let text: string = "";
    const possibleText: string =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(
        Math.floor(Math.random() * possibleText.length)
      );
    }
    // Replace extension according to your media type like this
    return 'Issue_' + date + ".png";
  }

  getPacsDetails() {
    // this.commonComponent.startSpinner();
    // this.mainmenuService.getPacsDetailsById(this.societyId).subscribe((data: any) => {
    //   this.responseModel = data;
    //   if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
    //     this.pacs = this.responseModel.data[0];
    //     this.issuePacsId = this.pacs.id;
    //     this.pacsName = this.pacs.name;
    //     this.commonComponent.stopSpinner();
    //   } else {
    //     this.commonComponent.stopSpinner();
    //     this.msgs = [];
    //     this.msgs = [{ severity: "error", detail: data.statusMsg });
    //   }
    // }, error => {
    //   this.commonComponent.stopSpinner();
    //   this.msgs = [];
    //   this.msgs = [{ severity: "error", summary: 'Failed', detail: this.commonComponent.errorHandling(error) });
    //   this.commonComponent.stopSpinner();
    // });
  }

  toggleTheme(color: any) {
    this.removeTheme();
    this.isDarkCeruleanTheme = !this.isDarkCeruleanTheme;
    if (color == 'darkcerulean') {
      this.renderer.addClass(document.body, 'darkcerulean-theme');
    } else if (color == 'dark') {
      this.renderer.addClass(document.body, 'dark-theme');
    } else if (color == 'orange') {
      this.renderer.addClass(document.body, 'orange-theme');
    } else if (color == 'yellow') {
      this.renderer.addClass(document.body, 'yellow-theme');
    } else if (color == 'green') {
      this.renderer.addClass(document.body, 'green-theme');
    } else if (color == 'blue') {
      this.renderer.addClass(document.body, 'blue-theme');
    } else if (color == 'indigo') {
      this.renderer.addClass(document.body, 'indigo-theme');
    } else if (color == 'violet') {
      this.renderer.addClass(document.body, 'violet-theme');
    }
  }

  removeTheme() {
    this.renderer.removeClass(document.body, 'darkcerulean-theme');
    this.renderer.removeClass(document.body, 'dark-theme');
    this.renderer.removeClass(document.body, 'orange-theme');
    this.renderer.removeClass(document.body, 'yellow-theme');
    this.renderer.removeClass(document.body, 'green-theme');
    this.renderer.removeClass(document.body, 'blue-theme');
    this.renderer.removeClass(document.body, 'indigo-theme');
    this.renderer.removeClass(document.body, 'violet-theme');
  }

  showTheam() {
    this.display = true;
  }
  // Sidemenu
   // Toggle sidebar visibility
   toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Close sidebar
  closeSidebar(event?: any) {
    this.isSidebarOpen = false;
  }

}
