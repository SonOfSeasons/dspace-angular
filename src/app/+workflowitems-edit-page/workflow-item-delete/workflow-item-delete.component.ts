import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkflowItemActionPageComponent } from '../workflow-item-action-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowItemDataService } from '../../core/submission/workflowitem-data.service';
import { RouteService } from '../../core/services/route.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-workflow-item-delete',
  templateUrl: '../workflow-item-action-page.component.html'
})
export class WorkflowItemDeleteComponent extends WorkflowItemActionPageComponent {
  constructor(protected route: ActivatedRoute,
              protected workflowItemService: WorkflowItemDataService,
              protected router: Router,
              protected routeService: RouteService,
              protected notificationsService: NotificationsService,
              protected translationService: TranslateService) {
    super(route, workflowItemService, router, routeService, notificationsService, translationService);
  }

  getType(): string {
    return 'delete';
  }

  sendRequest(id: string): Observable<boolean> {
    return this.workflowItemService.delete(id);
  }
}
