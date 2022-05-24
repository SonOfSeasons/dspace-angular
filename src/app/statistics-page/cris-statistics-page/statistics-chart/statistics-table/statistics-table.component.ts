import { EntityTypeEnum } from './../../../../cris-layout/enums/entity-type.enum';
import { Component, OnInit } from '@angular/core';
import { StatisticsType } from '../../statistics-type.model';
import { renderChartFor } from '../../cris-statistics-element-decorator';
import { StatisticsChartDataComponent } from '../statistics-chart-data/statistics-chart-data.component';

@Component({
  selector: 'ds-statistics-table',
  templateUrl: './statistics-table.component.html',
  styleUrls: ['./statistics-table.component.scss'],
})
/**
 * Component that represents a table for report
 */
@renderChartFor(StatisticsType.table)
export class StatisticsTableComponent extends StatisticsChartDataComponent implements OnInit {
  /**
   * Boolean indicating whether the usage report has data
   */
  hasData: boolean;

  /**
   * The table headers
   */
  headers: string[];

  /**
   * Array to store entity types that need to be converted to link,
   * in order to check from the template if point's label it should be a simple label or a link
   * @memberof StatisticsTableComponent
   */
  entityTypesToConvertToLink = [
    EntityTypeEnum.Item,
    EntityTypeEnum.Bitstream,
    EntityTypeEnum.Collection,
    EntityTypeEnum.Community,
  ];

  /**
   * Check if report has information and if data is present to show in the view
   * Insert table headers
   */
  ngOnInit() {
    this.hasData = !!this.report && this.report.points.length > 0;
    if (this.hasData) {
      this.headers = [
        this.report.points[0].type,
        Object.keys(this.report.points[0].values)[0],
      ];
    }
  }
}
