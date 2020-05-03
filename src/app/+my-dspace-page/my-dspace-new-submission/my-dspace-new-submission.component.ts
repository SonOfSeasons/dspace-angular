import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { SubmissionState } from '../../submission/submission.reducers';
import { AuthService } from '../../core/auth/auth.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { UploaderOptions } from '../../shared/uploader/uploader-options.model';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { NotificationType } from '../../shared/notifications/models/notification-type';
import { hasValue } from '../../shared/empty.util';
import { SearchResult } from '../../shared/search/search-result.model';
import { RemoteData } from "../../core/data/remote-data";
import { PaginatedList } from "../../core/data/paginated-list";
import { Router } from "@angular/router";
import { EntityTypeService } from "../../core/data/entity-type.service";
import { ItemType } from "../../core/shared/item-relationships/item-type.model";

/**
 * This component represents the whole mydspace page header
 */
@Component({
  selector: 'ds-my-dspace-new-submission',
  styleUrls: ['./my-dspace-new-submission.component.scss'],
  templateUrl: './my-dspace-new-submission.component.html'
})
export class MyDSpaceNewSubmissionComponent implements OnDestroy, OnInit {
  /**
   * Output that emits the workspace item when the upload has completed
   */
  @Output() uploadEnd = new EventEmitter<Array<SearchResult<DSpaceObject>>>();

  /**
   * The UploaderOptions object
   */
  public uploadFilesOptions: UploaderOptions = new UploaderOptions();

  /**
   * Subscription to unsubscribe from
   */
  private sub: Subscription;

  initialized: boolean = false;
  private entityTypeSelected: string;
  availableEntyTypeList: Set<string>;
  /**
   * Initialize instance variables
   *
   * @param {AuthService} authService
   * @param {ChangeDetectorRef} changeDetectorRef
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {Store<SubmissionState>} store
   * @param {TranslateService} translate
   */
  constructor(private authService: AuthService,
              private changeDetectorRef: ChangeDetectorRef,
              private halService: HALEndpointService,
              private notificationsService: NotificationsService,
              private entityTypeService: EntityTypeService,
              private router: Router,
              private store: Store<SubmissionState>,
              private translate: TranslateService) {
    this.availableEntyTypeList = new Set<string>();
  }

  /**
   * Initialize url and Bearer token
   */
  ngOnInit() {
    this.sub = this.halService.getEndpoint('workspaceitems').pipe(first()).subscribe((url) => {
        this.uploadFilesOptions.url = url;
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
        this.changeDetectorRef.detectChanges();
      }
    );
    this.entityTypeService.getAllAuthorizedRelationshipType().subscribe((x: RemoteData<PaginatedList<ItemType>>) => {
      this.initialized = true;
      if (!x || !x.payload || !x.payload.page) {
        return;
      }
      x.payload.page.forEach(type => this.availableEntyTypeList.add(type.label));
    }, () => {
      this.initialized = true;
    });
  }

  /**
   * Method called when file upload is completed to notify upload status
   */
  public onCompleteItem(res) {
    if (res && res._embedded && res._embedded.workspaceitems && res._embedded.workspaceitems.length > 0) {
      const workspaceitems = res._embedded.workspaceitems;
      this.uploadEnd.emit(workspaceitems);

      if (workspaceitems.length === 1) {
        const options = new NotificationOptions();
        options.timeOut = 0;
        const link = '/workspaceitems/' + workspaceitems[0].id + '/edit';
        this.notificationsService.notificationWithAnchor(
          NotificationType.Success,
          options,
          link,
          'mydspace.general.text-here',
          'mydspace.upload.upload-successful',
          'here');
      } else if (workspaceitems.length > 1) {
        this.notificationsService.success(null, this.translate.get('mydspace.upload.upload-multiple-successful', {qty: workspaceitems.length}));
      }

    } else {
      this.notificationsService.error(null, this.translate.get('mydspace.upload.upload-failed'));
    }
  }

  /**
   * Method called on file upload error
   */
  public onUploadError() {
    this.notificationsService.error(null, this.translate.get('mydspace.upload.upload-failed'));
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

  newSubmission() {
    if(!this.entityTypeSelected) {
      this.router.navigate(['/submit']);
    } else {

    }
  }
}
