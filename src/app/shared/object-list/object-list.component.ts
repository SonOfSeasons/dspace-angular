import {
  Component,
  EventEmitter,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  Output
} from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { PageInfo } from '../../core/shared/page-info.model';

import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';

import { SortOptions, SortDirection } from '../../core/cache/models/sort-options.model';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-object-list',
  styleUrls: ['../../object-list/object-list.component.scss'],
  templateUrl: '../../object-list/object-list.component.html'
})
export class ObjectListComponent implements OnInit {

  @Input() objects: RemoteData<DSpaceObject[]>;
  @Input() config: PaginationComponentOptions;
  @Input() sortConfig: SortOptions;
  @Input() hideGear = false;
  @Input() hidePagerWhenSinglePage = true;
  pageInfo: Observable<PageInfo>;

  /**
   * An event fired when the page is changed.
   * Event's payload equals to the newly selected page.
   */
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * An event fired when the page wsize is changed.
   * Event's payload equals to the newly selected page size.
   */
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * An event fired when the sort direction is changed.
   * Event's payload equals to the newly selected sort direction.
   */
  @Output() sortDirectionChange: EventEmitter<SortDirection> = new EventEmitter<SortDirection>();

  /**
   * An event fired when the sort field is changed.
   * Event's payload equals to the newly selected sort field.
   */
  @Output() sortFieldChange: EventEmitter<string> = new EventEmitter<string>();
  data: any = {};

  ngOnInit(): void {
    this.pageInfo = this.objects.pageInfo;
  }

  onPageChange(event) {
    this.pageChange.emit(event);
  }

  onPageSizeChange(event) {
    this.pageSizeChange.emit(event);
  }

  onSortDirectionChange(event) {
    this.sortDirectionChange.emit(event);
  }

  onSortFieldChange(event) {
    this.sortFieldChange.emit(event);
  }

}
