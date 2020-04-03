import { Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { getListableObjectComponent, listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../core/shared/context.model';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { getItemEditPath } from '../../../../../+item-page/item-page-routing.module';
import { URLCombiner } from '../../../../../core/url-combiner/url-combiner';
import {
  ITEM_EDIT_DELETE_PATH,
  ITEM_EDIT_MOVE_PATH,
  ITEM_EDIT_PRIVATE_PATH,
  ITEM_EDIT_PUBLIC_PATH,
  ITEM_EDIT_REINSTATE_PATH,
  ITEM_EDIT_WITHDRAW_PATH
} from '../../../../../+item-page/edit-item-page/edit-item-page.routing.module';
import { SearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/search-result-grid-element.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { GenericConstructor } from '../../../../../core/shared/generic-constructor';
import { ListableObjectDirective } from '../../../../../shared/object-collection/shared/listable-object/listable-object.directive';
import { WorkflowItemSearchResult } from '../../../../../shared/object-collection/shared/workflow-item-search-result.model';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { AbstractListableElementComponent } from '../../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Observable } from 'rxjs';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { followLink } from '../../../../../shared/utils/follow-link-config.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../../../../../core/shared/operators';
import { take } from 'rxjs/operators';

@listableObjectComponent(ItemSearchResult, ViewMode.GridElement, Context.AdminWorkflowSearch)
@Component({
  selector: 'ds-workflow-item-admin-workflow-grid-element',
  styleUrls: ['./workflow-item-admin-workflow-grid-element.component.scss'],
  templateUrl: './workflow-item-admin-workflow-grid-element.component.html'
})
/**
 * The component for displaying a list element for an workflow item on the admin search page
 */
export class WorkflowItemAdminWorkflowGridElementComponent extends AbstractListableElementComponent<WorkflowItem> {
  @ViewChild(ListableObjectDirective, { static: true }) listableObjectDirective: ListableObjectDirective;
  @ViewChild('badges', { static: true }) badges: ElementRef;
  @ViewChild('buttons', { static: true }) buttons: ElementRef;
  public item$: Observable<Item>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private linkService: LinkService) {
    super();
  }

  /**
   * Setup the dynamic child component
   */
  ngOnInit(): void {
    this.object = this.linkService.resolveLink(this.object, followLink('item'));
    this.item$ = (this.object.item as Observable<RemoteData<Item>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload());
    this.item$.pipe(take(1)).subscribe((item: Item) => {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.getComponent(item));

        const viewContainerRef = this.listableObjectDirective.viewContainerRef;
        viewContainerRef.clear();

        const componentRef = viewContainerRef.createComponent(
          componentFactory,
          0,
          undefined,
          [
            [this.badges.nativeElement],
            [this.buttons.nativeElement]
          ]);
        (componentRef.instance as any).object = item;
        (componentRef.instance as any).index = this.index;
        (componentRef.instance as any).linkType = this.linkType;
        (componentRef.instance as any).listID = this.listID;
        componentRef.changeDetectorRef.detectChanges();
      }
    )
  }

  /**
   * Fetch the component depending on the item's relationship type, view mode and context
   * @returns {GenericConstructor<Component>}
   */
  private getComponent(item: Item): GenericConstructor<Component> {
    return getListableObjectComponent(item.getRenderTypes(), ViewMode.GridElement, undefined)
  }

}
