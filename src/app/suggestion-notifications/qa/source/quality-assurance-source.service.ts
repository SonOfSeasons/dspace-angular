import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  QualityAssuranceSourceRestService
} from '../../../core/suggestion-notifications/qa/source/quality-assurance-source-rest.service';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import {
  QualityAssuranceSourceObject
} from '../../../core/suggestion-notifications/qa/models/quality-assurance-source.model';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';

/**
 * The service handling all Quality Assurance source requests to the REST service.
 */
@Injectable()
export class QualityAssuranceSourceService {

  /**
   * Initialize the service variables.
   * @param {QualityAssuranceSourceRestService} qualityAssuranceSourceRestService
   */
  constructor(
    private qualityAssuranceSourceRestService: QualityAssuranceSourceRestService
  ) {
  }

  /**
   * Return the list of Quality Assurance source managing pagination and errors.
   *
   * @param elementsPerPage
   *    The number of the source per page
   * @param currentPage
   *    The page number to retrieve
   * @return Observable<PaginatedList<QualityAssuranceSourceObject>>
   *    The list of Quality Assurance source.
   */
  public getSources(elementsPerPage, currentPage): Observable<PaginatedList<QualityAssuranceSourceObject>> {
    const sortOptions = new SortOptions('name', SortDirection.ASC);

    const findListOptions: FindListOptions = {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      sort: sortOptions
    };

    return this.qualityAssuranceSourceRestService.getSources(findListOptions).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<PaginatedList<QualityAssuranceSourceObject>>) => {
        if (rd.hasSucceeded) {
          return rd.payload;
        } else {
          throw new Error('Can\'t retrieve Quality Assurance source from the Broker source REST service');
        }
      })
    );
  }
}