import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import * as moment from 'moment';

export class calendarHelper {

  constructor() { }

  static MY_DATE_FORMATS: any = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'DD/MMM/YYYY',
      monthYearA11yLabel: 'MMMM YYYY'
    },
  };

  static myFilter(d: Moment | null): boolean {
    const habil: boolean = false;
    const date = (d || moment());
    const hoy = moment();
      if (hoy.format('YYYY-MM-DD') >= date.format('YYYY-MM-DD')) {
        return true;
      }
    return habil;
  }

}

export class CustomDateAdapter extends MomentDateAdapter {
  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
    return ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  }
}
