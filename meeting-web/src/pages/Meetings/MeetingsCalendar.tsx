import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { useEffect, useState } from 'react'
import {
    createViewMonthAgenda,
    createViewMonthGrid,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'

import '@schedule-x/theme-default/dist/index.css'

export default function MeetingsCalendar() {
    const eventsService = useState(() => createEventsServicePlugin())[0]
    const calendar = useCalendarApp({
        views: [ createViewMonthGrid(), createViewMonthAgenda()],
        events: [
            {
                id: '1',
                title: 'Event 1',
                start: '2025-02-21',
                end: '2025-02-22',
            },
        ],
        plugins: [eventsService]
    })

    useEffect(() => {
        // get all events
        eventsService.getAll()
    }, [])
    return (
        <div>
            <ScheduleXCalendar calendarApp={calendar} />
        </div>
    );
}