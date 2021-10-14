import { EventEmitter, ChangeDetectorRef, OnChanges, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { WeekDay, CalendarEvent, WeekViewAllDayEvent, WeekView, WeekViewHourColumn, WeekViewTimeEvent, WeekViewHourSegment, WeekViewHour, WeekViewAllDayEventRow } from 'calendar-utils';
import { ResizeEvent } from 'angular-resizable-element';
import { CalendarEventTimesChangedEvent } from '../common/calendar-event-times-changed-event.interface';
import { CalendarUtils } from '../common/calendar-utils.provider';
import { DateAdapter } from '../../date-adapters/date-adapter';
import { DragEndEvent, DropEvent, DragMoveEvent, ValidateDrag } from 'angular-draggable-droppable';
import { PlacementArray } from 'positioning';
import * as ɵngcc0 from '@angular/core';
export interface WeekViewAllDayEventResize {
    originalOffset: number;
    originalSpan: number;
    edge: string;
}
export interface CalendarWeekViewBeforeRenderEvent extends WeekView {
    header: WeekDay[];
}
/**
 * Shows all events on a given week. Example usage:
 *
 * ```typescript
 * <mwl-calendar-week-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-week-view>
 * ```
 */
export declare class CalendarWeekViewComponent implements OnChanges, OnInit, OnDestroy {
    protected cdr: ChangeDetectorRef;
    protected utils: CalendarUtils;
    protected dateAdapter: DateAdapter;
    /**
     * The current view date
     */
    viewDate: Date;
    /**
     * An array of events to display on view
     * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
     */
    events: CalendarEvent[];
    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
     */
    excludeDays: number[];
    /**
     * An observable that when emitted on will re-render the current view
     */
    refresh: Subject<any>;
    /**
     * The locale used to format dates
     */
    locale: string;
    /**
     * The placement of the event tooltip
     */
    tooltipPlacement: PlacementArray;
    /**
     * A custom template to use for the event tooltips
     */
    tooltipTemplate: TemplateRef<any>;
    /**
     * Whether to append tooltips to the body or next to the trigger element
     */
    tooltipAppendToBody: boolean;
    /**
     * The delay in milliseconds before the tooltip should be displayed. If not provided the tooltip
     * will be displayed immediately.
     */
    tooltipDelay: number | null;
    /**
     * The start number of the week.
     * This is ignored when the `daysInWeek` input is also set as the `viewDate` will be used as the start of the week instead.
     * Note, you should also pass this to the calendar title pipe so it shows the same days: {{ viewDate | calendarDate:(view + 'ViewTitle'):locale:weekStartsOn }}
     * If using the moment date adapter this option won't do anything and you'll need to set it globally like so:
     * ```
     * moment.updateLocale('en', {
     *   week: {
     *     dow: 1, // set start of week to monday instead
     *     doy: 0,
     *   },
     * });
     * ```
     */
    weekStartsOn: number;
    /**
     * A custom template to use to replace the header
     */
    headerTemplate: TemplateRef<any>;
    /**
     * A custom template to use for week view events
     */
    eventTemplate: TemplateRef<any>;
    /**
     * A custom template to use for event titles
     */
    eventTitleTemplate: TemplateRef<any>;
    /**
     * A custom template to use for event actions
     */
    eventActionsTemplate: TemplateRef<any>;
    /**
     * The precision to display events.
     * `days` will round event start and end dates to the nearest day and `minutes` will not do this rounding
     */
    precision: 'days' | 'minutes';
    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that indicate which days are weekends
     */
    weekendDays: number[];
    /**
     * Whether to snap events to a grid when dragging
     */
    snapDraggedEvents: boolean;
    /**
     * The number of segments in an hour. Must divide equally into 60.
     */
    hourSegments: number;
    /**
     * The height in pixels of each hour segment
     */
    hourSegmentHeight: number;
    /**
     * The day start hours in 24 hour time. Must be 0-23
     */
    dayStartHour: number;
    /**
     * The day start minutes. Must be 0-59
     */
    dayStartMinute: number;
    /**
     * The day end hours in 24 hour time. Must be 0-23
     */
    dayEndHour: number;
    /**
     * The day end minutes. Must be 0-59
     */
    dayEndMinute: number;
    /**
     * A custom template to use to replace the hour segment
     */
    hourSegmentTemplate: TemplateRef<any>;
    /**
     * The grid size to snap resizing and dragging of hourly events to
     */
    eventSnapSize: number;
    /**
     * A custom template to use for the all day events label text
     */
    allDayEventsLabelTemplate: TemplateRef<any>;
    /**
     * The number of days in a week. Can be used to create a shorter or longer week view.
     * The first day of the week will always be the `viewDate` and `weekStartsOn` if set will be ignored
     */
    daysInWeek: number;
    /**
     * A custom template to use for the current time marker
     */
    currentTimeMarkerTemplate: TemplateRef<any>;
    /**
     * Called when a header week day is clicked. Adding a `cssClass` property on `$event.day` will add that class to the header element
     */
    dayHeaderClicked: EventEmitter<{
        day: WeekDay;
        sourceEvent: MouseEvent;
    }>;
    /**
     * Called when the event title is clicked
     */
    eventClicked: EventEmitter<{
        event: CalendarEvent<any>;
        sourceEvent: any;
    }>;
    /**
     * Called when an event is resized or dragged and dropped
     */
    eventTimesChanged: EventEmitter<CalendarEventTimesChangedEvent<any>>;
    /**
     * An output that will be called before the view is rendered for the current week.
     * If you add the `cssClass` property to a day in the header it will add that class to the cell element in the template
     */
    beforeViewRender: EventEmitter<CalendarWeekViewBeforeRenderEvent>;
    /**
     * Called when an hour segment is clicked
     */
    hourSegmentClicked: EventEmitter<{
        date: Date;
        sourceEvent: MouseEvent;
    }>;
    /**
     * @hidden
     */
    days: WeekDay[];
    /**
     * @hidden
     */
    view: WeekView;
    /**
     * @hidden
     */
    refreshSubscription: Subscription;
    /**
     * @hidden
     */
    allDayEventResizes: Map<WeekViewAllDayEvent, WeekViewAllDayEventResize>;
    /**
     * @hidden
     */
    timeEventResizes: Map<CalendarEvent, ResizeEvent>;
    /**
     * @hidden
     */
    eventDragEnterByType: {
        allDay: number;
        time: number;
    };
    /**
     * @hidden
     */
    dragActive: boolean;
    /**
     * @hidden
     */
    dragAlreadyMoved: boolean;
    /**
     * @hidden
     */
    validateDrag: ValidateDrag;
    /**
     * @hidden
     */
    validateResize: (args: any) => boolean;
    /**
     * @hidden
     */
    dayColumnWidth: number;
    /**
     * @hidden
     */
    calendarId: symbol;
    /**
     * @hidden
     */
    lastDraggedEvent: CalendarEvent;
    /**
     * @hidden
     */
    trackByWeekDayHeaderDate: (index: number, day: WeekDay) => string;
    /**
     * @hidden
     */
    trackByHourSegment: (index: number, segment: WeekViewHourSegment) => string;
    /**
     * @hidden
     */
    trackByHour: (index: number, hour: WeekViewHour) => string;
    /**
     * @hidden
     */
    trackByWeekAllDayEvent: (index: number, weekEvent: WeekViewAllDayEvent) => string | number | CalendarEvent<any>;
    /**
     * @hidden
     */
    trackByWeekTimeEvent: (index: number, weekEvent: WeekViewTimeEvent) => string | number | CalendarEvent<any>;
    /**
     * @hidden
     */
    private lastDragEnterDate;
    /**
     * @hidden
     */
    constructor(cdr: ChangeDetectorRef, utils: CalendarUtils, locale: string, dateAdapter: DateAdapter);
    /**
     * @hidden
     */
    trackByHourColumn: (index: number, column: WeekViewHourColumn) => string | WeekViewHourColumn;
    /**
     * @hidden
     */
    trackById: (index: number, row: WeekViewAllDayEventRow) => string;
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngOnChanges(changes: any): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    timeEventResizeStarted(eventsContainer: HTMLElement, timeEvent: WeekViewTimeEvent, resizeEvent: ResizeEvent): void;
    /**
     * @hidden
     */
    timeEventResizing(timeEvent: WeekViewTimeEvent, resizeEvent: ResizeEvent): void;
    /**
     * @hidden
     */
    timeEventResizeEnded(timeEvent: WeekViewTimeEvent): void;
    /**
     * @hidden
     */
    allDayEventResizeStarted(allDayEventsContainer: HTMLElement, allDayEvent: WeekViewAllDayEvent, resizeEvent: ResizeEvent): void;
    /**
     * @hidden
     */
    allDayEventResizing(allDayEvent: WeekViewAllDayEvent, resizeEvent: ResizeEvent, dayWidth: number): void;
    /**
     * @hidden
     */
    allDayEventResizeEnded(allDayEvent: WeekViewAllDayEvent): void;
    /**
     * @hidden
     */
    getDayColumnWidth(eventRowContainer: HTMLElement): number;
    /**
     * @hidden
     */
    dateDragEnter(date: Date): void;
    /**
     * @hidden
     */
    eventDropped(dropEvent: DropEvent<{
        event?: CalendarEvent;
        calendarId?: symbol;
    }>, date: Date, allDay: boolean): void;
    /**
     * @hidden
     */
    dragEnter(type: 'allDay' | 'time'): void;
    /**
     * @hidden
     */
    dragLeave(type: 'allDay' | 'time'): void;
    /**
     * @hidden
     */
    dragStarted(eventsContainer: HTMLElement, event: HTMLElement, dayEvent?: WeekViewTimeEvent): void;
    /**
     * @hidden
     */
    dragMove(dayEvent: WeekViewTimeEvent, dragEvent: DragMoveEvent): void;
    /**
     * @hidden
     */
    allDayEventDragMove(): void;
    /**
     * @hidden
     */
    dragEnded(weekEvent: WeekViewAllDayEvent | WeekViewTimeEvent, dragEndEvent: DragEndEvent, dayWidth: number, useY?: boolean): void;
    protected refreshHeader(): void;
    protected refreshBody(): void;
    protected refreshAll(): void;
    protected emitBeforeViewRender(): void;
    protected getWeekView(events: CalendarEvent[]): WeekView;
    protected getDragMovedEventTimes(weekEvent: WeekViewAllDayEvent | WeekViewTimeEvent, dragEndEvent: DragEndEvent | DragMoveEvent, dayWidth: number, useY: boolean): {
        start: Date;
        end: Date;
    };
    protected restoreOriginalEvents(tempEvents: CalendarEvent[], adjustedEvents: Map<CalendarEvent, CalendarEvent>, snapDraggedEvents?: boolean): void;
    protected getTimeEventResizedDates(calendarEvent: CalendarEvent, resizeEvent: ResizeEvent): {
        start: Date;
        end: Date;
    };
    protected resizeStarted(eventsContainer: HTMLElement, minWidth?: number): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CalendarWeekViewComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<CalendarWeekViewComponent, "mwl-calendar-week-view", never, { "events": "events"; "excludeDays": "excludeDays"; "tooltipPlacement": "tooltipPlacement"; "tooltipAppendToBody": "tooltipAppendToBody"; "tooltipDelay": "tooltipDelay"; "precision": "precision"; "snapDraggedEvents": "snapDraggedEvents"; "hourSegments": "hourSegments"; "hourSegmentHeight": "hourSegmentHeight"; "dayStartHour": "dayStartHour"; "dayStartMinute": "dayStartMinute"; "dayEndHour": "dayEndHour"; "dayEndMinute": "dayEndMinute"; "locale": "locale"; "viewDate": "viewDate"; "refresh": "refresh"; "tooltipTemplate": "tooltipTemplate"; "weekStartsOn": "weekStartsOn"; "headerTemplate": "headerTemplate"; "eventTemplate": "eventTemplate"; "eventTitleTemplate": "eventTitleTemplate"; "eventActionsTemplate": "eventActionsTemplate"; "weekendDays": "weekendDays"; "hourSegmentTemplate": "hourSegmentTemplate"; "eventSnapSize": "eventSnapSize"; "allDayEventsLabelTemplate": "allDayEventsLabelTemplate"; "daysInWeek": "daysInWeek"; "currentTimeMarkerTemplate": "currentTimeMarkerTemplate"; }, { "dayHeaderClicked": "dayHeaderClicked"; "eventClicked": "eventClicked"; "eventTimesChanged": "eventTimesChanged"; "beforeViewRender": "beforeViewRender"; "hourSegmentClicked": "hourSegmentClicked"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2Vlay12aWV3LmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJjYWxlbmRhci13ZWVrLXZpZXcuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIENoYW5nZURldGVjdG9yUmVmLCBPbkNoYW5nZXMsIE9uSW5pdCwgT25EZXN0cm95LCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBXZWVrRGF5LCBDYWxlbmRhckV2ZW50LCBXZWVrVmlld0FsbERheUV2ZW50LCBXZWVrVmlldywgV2Vla1ZpZXdIb3VyQ29sdW1uLCBXZWVrVmlld1RpbWVFdmVudCwgV2Vla1ZpZXdIb3VyU2VnbWVudCwgV2Vla1ZpZXdIb3VyLCBXZWVrVmlld0FsbERheUV2ZW50Um93IH0gZnJvbSAnY2FsZW5kYXItdXRpbHMnO1xuaW1wb3J0IHsgUmVzaXplRXZlbnQgfSBmcm9tICdhbmd1bGFyLXJlc2l6YWJsZS1lbGVtZW50JztcbmltcG9ydCB7IENhbGVuZGFyRXZlbnRUaW1lc0NoYW5nZWRFdmVudCB9IGZyb20gJy4uL2NvbW1vbi9jYWxlbmRhci1ldmVudC10aW1lcy1jaGFuZ2VkLWV2ZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBDYWxlbmRhclV0aWxzIH0gZnJvbSAnLi4vY29tbW9uL2NhbGVuZGFyLXV0aWxzLnByb3ZpZGVyJztcbmltcG9ydCB7IERhdGVBZGFwdGVyIH0gZnJvbSAnLi4vLi4vZGF0ZS1hZGFwdGVycy9kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHsgRHJhZ0VuZEV2ZW50LCBEcm9wRXZlbnQsIERyYWdNb3ZlRXZlbnQsIFZhbGlkYXRlRHJhZyB9IGZyb20gJ2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZSc7XG5pbXBvcnQgeyBQbGFjZW1lbnRBcnJheSB9IGZyb20gJ3Bvc2l0aW9uaW5nJztcbmV4cG9ydCBpbnRlcmZhY2UgV2Vla1ZpZXdBbGxEYXlFdmVudFJlc2l6ZSB7XG4gICAgb3JpZ2luYWxPZmZzZXQ6IG51bWJlcjtcbiAgICBvcmlnaW5hbFNwYW46IG51bWJlcjtcbiAgICBlZGdlOiBzdHJpbmc7XG59XG5leHBvcnQgaW50ZXJmYWNlIENhbGVuZGFyV2Vla1ZpZXdCZWZvcmVSZW5kZXJFdmVudCBleHRlbmRzIFdlZWtWaWV3IHtcbiAgICBoZWFkZXI6IFdlZWtEYXlbXTtcbn1cbi8qKlxuICogU2hvd3MgYWxsIGV2ZW50cyBvbiBhIGdpdmVuIHdlZWsuIEV4YW1wbGUgdXNhZ2U6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogPG13bC1jYWxlbmRhci13ZWVrLXZpZXdcbiAqICBbdmlld0RhdGVdPVwidmlld0RhdGVcIlxuICogIFtldmVudHNdPVwiZXZlbnRzXCI+XG4gKiA8L213bC1jYWxlbmRhci13ZWVrLXZpZXc+XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgQ2FsZW5kYXJXZWVrVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHByb3RlY3RlZCBjZHI6IENoYW5nZURldGVjdG9yUmVmO1xuICAgIHByb3RlY3RlZCB1dGlsczogQ2FsZW5kYXJVdGlscztcbiAgICBwcm90ZWN0ZWQgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyO1xuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IHZpZXcgZGF0ZVxuICAgICAqL1xuICAgIHZpZXdEYXRlOiBEYXRlO1xuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIGV2ZW50cyB0byBkaXNwbGF5IG9uIHZpZXdcbiAgICAgKiBUaGUgc2NoZW1hIGlzIGF2YWlsYWJsZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vbWF0dGxld2lzOTIvY2FsZW5kYXItdXRpbHMvYmxvYi9jNTE2ODk5ODVmNTlhMjcxOTQwZTMwYmM0ZTJjNGUxZmVlM2ZjYjVjL3NyYy9jYWxlbmRhclV0aWxzLnRzI0w0OS1MNjNcbiAgICAgKi9cbiAgICBldmVudHM6IENhbGVuZGFyRXZlbnRbXTtcbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBkYXkgaW5kZXhlcyAoMCA9IHN1bmRheSwgMSA9IG1vbmRheSBldGMpIHRoYXQgd2lsbCBiZSBoaWRkZW4gb24gdGhlIHZpZXdcbiAgICAgKi9cbiAgICBleGNsdWRlRGF5czogbnVtYmVyW107XG4gICAgLyoqXG4gICAgICogQW4gb2JzZXJ2YWJsZSB0aGF0IHdoZW4gZW1pdHRlZCBvbiB3aWxsIHJlLXJlbmRlciB0aGUgY3VycmVudCB2aWV3XG4gICAgICovXG4gICAgcmVmcmVzaDogU3ViamVjdDxhbnk+O1xuICAgIC8qKlxuICAgICAqIFRoZSBsb2NhbGUgdXNlZCB0byBmb3JtYXQgZGF0ZXNcbiAgICAgKi9cbiAgICBsb2NhbGU6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBUaGUgcGxhY2VtZW50IG9mIHRoZSBldmVudCB0b29sdGlwXG4gICAgICovXG4gICAgdG9vbHRpcFBsYWNlbWVudDogUGxhY2VtZW50QXJyYXk7XG4gICAgLyoqXG4gICAgICogQSBjdXN0b20gdGVtcGxhdGUgdG8gdXNlIGZvciB0aGUgZXZlbnQgdG9vbHRpcHNcbiAgICAgKi9cbiAgICB0b29sdGlwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBhcHBlbmQgdG9vbHRpcHMgdG8gdGhlIGJvZHkgb3IgbmV4dCB0byB0aGUgdHJpZ2dlciBlbGVtZW50XG4gICAgICovXG4gICAgdG9vbHRpcEFwcGVuZFRvQm9keTogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBUaGUgZGVsYXkgaW4gbWlsbGlzZWNvbmRzIGJlZm9yZSB0aGUgdG9vbHRpcCBzaG91bGQgYmUgZGlzcGxheWVkLiBJZiBub3QgcHJvdmlkZWQgdGhlIHRvb2x0aXBcbiAgICAgKiB3aWxsIGJlIGRpc3BsYXllZCBpbW1lZGlhdGVseS5cbiAgICAgKi9cbiAgICB0b29sdGlwRGVsYXk6IG51bWJlciB8IG51bGw7XG4gICAgLyoqXG4gICAgICogVGhlIHN0YXJ0IG51bWJlciBvZiB0aGUgd2Vlay5cbiAgICAgKiBUaGlzIGlzIGlnbm9yZWQgd2hlbiB0aGUgYGRheXNJbldlZWtgIGlucHV0IGlzIGFsc28gc2V0IGFzIHRoZSBgdmlld0RhdGVgIHdpbGwgYmUgdXNlZCBhcyB0aGUgc3RhcnQgb2YgdGhlIHdlZWsgaW5zdGVhZC5cbiAgICAgKiBOb3RlLCB5b3Ugc2hvdWxkIGFsc28gcGFzcyB0aGlzIHRvIHRoZSBjYWxlbmRhciB0aXRsZSBwaXBlIHNvIGl0IHNob3dzIHRoZSBzYW1lIGRheXM6IHt7IHZpZXdEYXRlIHwgY2FsZW5kYXJEYXRlOih2aWV3ICsgJ1ZpZXdUaXRsZScpOmxvY2FsZTp3ZWVrU3RhcnRzT24gfX1cbiAgICAgKiBJZiB1c2luZyB0aGUgbW9tZW50IGRhdGUgYWRhcHRlciB0aGlzIG9wdGlvbiB3b24ndCBkbyBhbnl0aGluZyBhbmQgeW91J2xsIG5lZWQgdG8gc2V0IGl0IGdsb2JhbGx5IGxpa2Ugc286XG4gICAgICogYGBgXG4gICAgICogbW9tZW50LnVwZGF0ZUxvY2FsZSgnZW4nLCB7XG4gICAgICogICB3ZWVrOiB7XG4gICAgICogICAgIGRvdzogMSwgLy8gc2V0IHN0YXJ0IG9mIHdlZWsgdG8gbW9uZGF5IGluc3RlYWRcbiAgICAgKiAgICAgZG95OiAwLFxuICAgICAqICAgfSxcbiAgICAgKiB9KTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICB3ZWVrU3RhcnRzT246IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgdG8gcmVwbGFjZSB0aGUgaGVhZGVyXG4gICAgICovXG4gICAgaGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgLyoqXG4gICAgICogQSBjdXN0b20gdGVtcGxhdGUgdG8gdXNlIGZvciB3ZWVrIHZpZXcgZXZlbnRzXG4gICAgICovXG4gICAgZXZlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICAvKipcbiAgICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIGV2ZW50IHRpdGxlc1xuICAgICAqL1xuICAgIGV2ZW50VGl0bGVUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICAvKipcbiAgICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIGV2ZW50IGFjdGlvbnNcbiAgICAgKi9cbiAgICBldmVudEFjdGlvbnNUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICAvKipcbiAgICAgKiBUaGUgcHJlY2lzaW9uIHRvIGRpc3BsYXkgZXZlbnRzLlxuICAgICAqIGBkYXlzYCB3aWxsIHJvdW5kIGV2ZW50IHN0YXJ0IGFuZCBlbmQgZGF0ZXMgdG8gdGhlIG5lYXJlc3QgZGF5IGFuZCBgbWludXRlc2Agd2lsbCBub3QgZG8gdGhpcyByb3VuZGluZ1xuICAgICAqL1xuICAgIHByZWNpc2lvbjogJ2RheXMnIHwgJ21pbnV0ZXMnO1xuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIGRheSBpbmRleGVzICgwID0gc3VuZGF5LCAxID0gbW9uZGF5IGV0YykgdGhhdCBpbmRpY2F0ZSB3aGljaCBkYXlzIGFyZSB3ZWVrZW5kc1xuICAgICAqL1xuICAgIHdlZWtlbmREYXlzOiBudW1iZXJbXTtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIHNuYXAgZXZlbnRzIHRvIGEgZ3JpZCB3aGVuIGRyYWdnaW5nXG4gICAgICovXG4gICAgc25hcERyYWdnZWRFdmVudHM6IGJvb2xlYW47XG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiBzZWdtZW50cyBpbiBhbiBob3VyLiBNdXN0IGRpdmlkZSBlcXVhbGx5IGludG8gNjAuXG4gICAgICovXG4gICAgaG91clNlZ21lbnRzOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogVGhlIGhlaWdodCBpbiBwaXhlbHMgb2YgZWFjaCBob3VyIHNlZ21lbnRcbiAgICAgKi9cbiAgICBob3VyU2VnbWVudEhlaWdodDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIFRoZSBkYXkgc3RhcnQgaG91cnMgaW4gMjQgaG91ciB0aW1lLiBNdXN0IGJlIDAtMjNcbiAgICAgKi9cbiAgICBkYXlTdGFydEhvdXI6IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBUaGUgZGF5IHN0YXJ0IG1pbnV0ZXMuIE11c3QgYmUgMC01OVxuICAgICAqL1xuICAgIGRheVN0YXJ0TWludXRlOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogVGhlIGRheSBlbmQgaG91cnMgaW4gMjQgaG91ciB0aW1lLiBNdXN0IGJlIDAtMjNcbiAgICAgKi9cbiAgICBkYXlFbmRIb3VyOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogVGhlIGRheSBlbmQgbWludXRlcy4gTXVzdCBiZSAwLTU5XG4gICAgICovXG4gICAgZGF5RW5kTWludXRlOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogQSBjdXN0b20gdGVtcGxhdGUgdG8gdXNlIHRvIHJlcGxhY2UgdGhlIGhvdXIgc2VnbWVudFxuICAgICAqL1xuICAgIGhvdXJTZWdtZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgLyoqXG4gICAgICogVGhlIGdyaWQgc2l6ZSB0byBzbmFwIHJlc2l6aW5nIGFuZCBkcmFnZ2luZyBvZiBob3VybHkgZXZlbnRzIHRvXG4gICAgICovXG4gICAgZXZlbnRTbmFwU2l6ZTogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSBmb3IgdGhlIGFsbCBkYXkgZXZlbnRzIGxhYmVsIHRleHRcbiAgICAgKi9cbiAgICBhbGxEYXlFdmVudHNMYWJlbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgZGF5cyBpbiBhIHdlZWsuIENhbiBiZSB1c2VkIHRvIGNyZWF0ZSBhIHNob3J0ZXIgb3IgbG9uZ2VyIHdlZWsgdmlldy5cbiAgICAgKiBUaGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrIHdpbGwgYWx3YXlzIGJlIHRoZSBgdmlld0RhdGVgIGFuZCBgd2Vla1N0YXJ0c09uYCBpZiBzZXQgd2lsbCBiZSBpZ25vcmVkXG4gICAgICovXG4gICAgZGF5c0luV2VlazogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSBmb3IgdGhlIGN1cnJlbnQgdGltZSBtYXJrZXJcbiAgICAgKi9cbiAgICBjdXJyZW50VGltZU1hcmtlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgaGVhZGVyIHdlZWsgZGF5IGlzIGNsaWNrZWQuIEFkZGluZyBhIGBjc3NDbGFzc2AgcHJvcGVydHkgb24gYCRldmVudC5kYXlgIHdpbGwgYWRkIHRoYXQgY2xhc3MgdG8gdGhlIGhlYWRlciBlbGVtZW50XG4gICAgICovXG4gICAgZGF5SGVhZGVyQ2xpY2tlZDogRXZlbnRFbWl0dGVyPHtcbiAgICAgICAgZGF5OiBXZWVrRGF5O1xuICAgICAgICBzb3VyY2VFdmVudDogTW91c2VFdmVudDtcbiAgICB9PjtcbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgZXZlbnQgdGl0bGUgaXMgY2xpY2tlZFxuICAgICAqL1xuICAgIGV2ZW50Q2xpY2tlZDogRXZlbnRFbWl0dGVyPHtcbiAgICAgICAgZXZlbnQ6IENhbGVuZGFyRXZlbnQ8YW55PjtcbiAgICAgICAgc291cmNlRXZlbnQ6IGFueTtcbiAgICB9PjtcbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhbiBldmVudCBpcyByZXNpemVkIG9yIGRyYWdnZWQgYW5kIGRyb3BwZWRcbiAgICAgKi9cbiAgICBldmVudFRpbWVzQ2hhbmdlZDogRXZlbnRFbWl0dGVyPENhbGVuZGFyRXZlbnRUaW1lc0NoYW5nZWRFdmVudDxhbnk+PjtcbiAgICAvKipcbiAgICAgKiBBbiBvdXRwdXQgdGhhdCB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgdGhlIHZpZXcgaXMgcmVuZGVyZWQgZm9yIHRoZSBjdXJyZW50IHdlZWsuXG4gICAgICogSWYgeW91IGFkZCB0aGUgYGNzc0NsYXNzYCBwcm9wZXJ0eSB0byBhIGRheSBpbiB0aGUgaGVhZGVyIGl0IHdpbGwgYWRkIHRoYXQgY2xhc3MgdG8gdGhlIGNlbGwgZWxlbWVudCBpbiB0aGUgdGVtcGxhdGVcbiAgICAgKi9cbiAgICBiZWZvcmVWaWV3UmVuZGVyOiBFdmVudEVtaXR0ZXI8Q2FsZW5kYXJXZWVrVmlld0JlZm9yZVJlbmRlckV2ZW50PjtcbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhbiBob3VyIHNlZ21lbnQgaXMgY2xpY2tlZFxuICAgICAqL1xuICAgIGhvdXJTZWdtZW50Q2xpY2tlZDogRXZlbnRFbWl0dGVyPHtcbiAgICAgICAgZGF0ZTogRGF0ZTtcbiAgICAgICAgc291cmNlRXZlbnQ6IE1vdXNlRXZlbnQ7XG4gICAgfT47XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIGRheXM6IFdlZWtEYXlbXTtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgdmlldzogV2Vla1ZpZXc7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHJlZnJlc2hTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgYWxsRGF5RXZlbnRSZXNpemVzOiBNYXA8V2Vla1ZpZXdBbGxEYXlFdmVudCwgV2Vla1ZpZXdBbGxEYXlFdmVudFJlc2l6ZT47XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHRpbWVFdmVudFJlc2l6ZXM6IE1hcDxDYWxlbmRhckV2ZW50LCBSZXNpemVFdmVudD47XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIGV2ZW50RHJhZ0VudGVyQnlUeXBlOiB7XG4gICAgICAgIGFsbERheTogbnVtYmVyO1xuICAgICAgICB0aW1lOiBudW1iZXI7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgZHJhZ0FjdGl2ZTogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgZHJhZ0FscmVhZHlNb3ZlZDogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgdmFsaWRhdGVEcmFnOiBWYWxpZGF0ZURyYWc7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHZhbGlkYXRlUmVzaXplOiAoYXJnczogYW55KSA9PiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBkYXlDb2x1bW5XaWR0aDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBjYWxlbmRhcklkOiBzeW1ib2w7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIGxhc3REcmFnZ2VkRXZlbnQ6IENhbGVuZGFyRXZlbnQ7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZTogKGluZGV4OiBudW1iZXIsIGRheTogV2Vla0RheSkgPT4gc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICB0cmFja0J5SG91clNlZ21lbnQ6IChpbmRleDogbnVtYmVyLCBzZWdtZW50OiBXZWVrVmlld0hvdXJTZWdtZW50KSA9PiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHRyYWNrQnlIb3VyOiAoaW5kZXg6IG51bWJlciwgaG91cjogV2Vla1ZpZXdIb3VyKSA9PiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHRyYWNrQnlXZWVrQWxsRGF5RXZlbnQ6IChpbmRleDogbnVtYmVyLCB3ZWVrRXZlbnQ6IFdlZWtWaWV3QWxsRGF5RXZlbnQpID0+IHN0cmluZyB8IG51bWJlciB8IENhbGVuZGFyRXZlbnQ8YW55PjtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgdHJhY2tCeVdlZWtUaW1lRXZlbnQ6IChpbmRleDogbnVtYmVyLCB3ZWVrRXZlbnQ6IFdlZWtWaWV3VGltZUV2ZW50KSA9PiBzdHJpbmcgfCBudW1iZXIgfCBDYWxlbmRhckV2ZW50PGFueT47XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByaXZhdGUgbGFzdERyYWdFbnRlckRhdGU7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsIHV0aWxzOiBDYWxlbmRhclV0aWxzLCBsb2NhbGU6IHN0cmluZywgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyKTtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgdHJhY2tCeUhvdXJDb2x1bW46IChpbmRleDogbnVtYmVyLCBjb2x1bW46IFdlZWtWaWV3SG91ckNvbHVtbikgPT4gc3RyaW5nIHwgV2Vla1ZpZXdIb3VyQ29sdW1uO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICB0cmFja0J5SWQ6IChpbmRleDogbnVtYmVyLCByb3c6IFdlZWtWaWV3QWxsRGF5RXZlbnRSb3cpID0+IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogYW55KTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgdGltZUV2ZW50UmVzaXplU3RhcnRlZChldmVudHNDb250YWluZXI6IEhUTUxFbGVtZW50LCB0aW1lRXZlbnQ6IFdlZWtWaWV3VGltZUV2ZW50LCByZXNpemVFdmVudDogUmVzaXplRXZlbnQpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICB0aW1lRXZlbnRSZXNpemluZyh0aW1lRXZlbnQ6IFdlZWtWaWV3VGltZUV2ZW50LCByZXNpemVFdmVudDogUmVzaXplRXZlbnQpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICB0aW1lRXZlbnRSZXNpemVFbmRlZCh0aW1lRXZlbnQ6IFdlZWtWaWV3VGltZUV2ZW50KTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgYWxsRGF5RXZlbnRSZXNpemVTdGFydGVkKGFsbERheUV2ZW50c0NvbnRhaW5lcjogSFRNTEVsZW1lbnQsIGFsbERheUV2ZW50OiBXZWVrVmlld0FsbERheUV2ZW50LCByZXNpemVFdmVudDogUmVzaXplRXZlbnQpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBhbGxEYXlFdmVudFJlc2l6aW5nKGFsbERheUV2ZW50OiBXZWVrVmlld0FsbERheUV2ZW50LCByZXNpemVFdmVudDogUmVzaXplRXZlbnQsIGRheVdpZHRoOiBudW1iZXIpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBhbGxEYXlFdmVudFJlc2l6ZUVuZGVkKGFsbERheUV2ZW50OiBXZWVrVmlld0FsbERheUV2ZW50KTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgZ2V0RGF5Q29sdW1uV2lkdGgoZXZlbnRSb3dDb250YWluZXI6IEhUTUxFbGVtZW50KTogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBkYXRlRHJhZ0VudGVyKGRhdGU6IERhdGUpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBldmVudERyb3BwZWQoZHJvcEV2ZW50OiBEcm9wRXZlbnQ8e1xuICAgICAgICBldmVudD86IENhbGVuZGFyRXZlbnQ7XG4gICAgICAgIGNhbGVuZGFySWQ/OiBzeW1ib2w7XG4gICAgfT4sIGRhdGU6IERhdGUsIGFsbERheTogYm9vbGVhbik6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIGRyYWdFbnRlcih0eXBlOiAnYWxsRGF5JyB8ICd0aW1lJyk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIGRyYWdMZWF2ZSh0eXBlOiAnYWxsRGF5JyB8ICd0aW1lJyk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIGRyYWdTdGFydGVkKGV2ZW50c0NvbnRhaW5lcjogSFRNTEVsZW1lbnQsIGV2ZW50OiBIVE1MRWxlbWVudCwgZGF5RXZlbnQ/OiBXZWVrVmlld1RpbWVFdmVudCk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIGRyYWdNb3ZlKGRheUV2ZW50OiBXZWVrVmlld1RpbWVFdmVudCwgZHJhZ0V2ZW50OiBEcmFnTW92ZUV2ZW50KTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgYWxsRGF5RXZlbnREcmFnTW92ZSgpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBkcmFnRW5kZWQod2Vla0V2ZW50OiBXZWVrVmlld0FsbERheUV2ZW50IHwgV2Vla1ZpZXdUaW1lRXZlbnQsIGRyYWdFbmRFdmVudDogRHJhZ0VuZEV2ZW50LCBkYXlXaWR0aDogbnVtYmVyLCB1c2VZPzogYm9vbGVhbik6IHZvaWQ7XG4gICAgcHJvdGVjdGVkIHJlZnJlc2hIZWFkZXIoKTogdm9pZDtcbiAgICBwcm90ZWN0ZWQgcmVmcmVzaEJvZHkoKTogdm9pZDtcbiAgICBwcm90ZWN0ZWQgcmVmcmVzaEFsbCgpOiB2b2lkO1xuICAgIHByb3RlY3RlZCBlbWl0QmVmb3JlVmlld1JlbmRlcigpOiB2b2lkO1xuICAgIHByb3RlY3RlZCBnZXRXZWVrVmlldyhldmVudHM6IENhbGVuZGFyRXZlbnRbXSk6IFdlZWtWaWV3O1xuICAgIHByb3RlY3RlZCBnZXREcmFnTW92ZWRFdmVudFRpbWVzKHdlZWtFdmVudDogV2Vla1ZpZXdBbGxEYXlFdmVudCB8IFdlZWtWaWV3VGltZUV2ZW50LCBkcmFnRW5kRXZlbnQ6IERyYWdFbmRFdmVudCB8IERyYWdNb3ZlRXZlbnQsIGRheVdpZHRoOiBudW1iZXIsIHVzZVk6IGJvb2xlYW4pOiB7XG4gICAgICAgIHN0YXJ0OiBEYXRlO1xuICAgICAgICBlbmQ6IERhdGU7XG4gICAgfTtcbiAgICBwcm90ZWN0ZWQgcmVzdG9yZU9yaWdpbmFsRXZlbnRzKHRlbXBFdmVudHM6IENhbGVuZGFyRXZlbnRbXSwgYWRqdXN0ZWRFdmVudHM6IE1hcDxDYWxlbmRhckV2ZW50LCBDYWxlbmRhckV2ZW50Piwgc25hcERyYWdnZWRFdmVudHM/OiBib29sZWFuKTogdm9pZDtcbiAgICBwcm90ZWN0ZWQgZ2V0VGltZUV2ZW50UmVzaXplZERhdGVzKGNhbGVuZGFyRXZlbnQ6IENhbGVuZGFyRXZlbnQsIHJlc2l6ZUV2ZW50OiBSZXNpemVFdmVudCk6IHtcbiAgICAgICAgc3RhcnQ6IERhdGU7XG4gICAgICAgIGVuZDogRGF0ZTtcbiAgICB9O1xuICAgIHByb3RlY3RlZCByZXNpemVTdGFydGVkKGV2ZW50c0NvbnRhaW5lcjogSFRNTEVsZW1lbnQsIG1pbldpZHRoPzogbnVtYmVyKTogdm9pZDtcbn1cbiJdfQ==