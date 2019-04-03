import {animate, animateChild, group, query, state, style, transition, trigger} from "@angular/animations";

export const slideInAnimation =
  trigger('loadDetails', [
      state('open', style({
        color : 'yellow'
      })),
      state('close', style({
        color: 'red'
      })),
    ]
  );
