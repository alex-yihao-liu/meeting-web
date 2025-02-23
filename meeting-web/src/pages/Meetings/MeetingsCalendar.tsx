import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { useEffect, useState } from 'react'
import {
    createViewMonthAgenda,
    createViewMonthGrid,
} from '@schedule-x/calendar'

import { createEventsServicePlugin } from '@schedule-x/events-service'

import { meetingApi } from '../../services/MeetingService';

import '@schedule-x/theme-default/dist/index.css'


export default function MeetingsCalendar() {
    const eventsService = useState(() => createEventsServicePlugin())[0]
    
    useEffect(() => {
        const updateEvents = async () => {
            const meetings = await meetingApi.getAll()
            console.log(meetings)
            eventsService.set(meetings.map(meeting => ({
                id: meeting.id,
                title: meeting.name,
                start: meeting.startTime,
                end: meeting.endTime,
                description: meeting.description,
                location: meeting.meetingRoomName
            })))
        };

        updateEvents();

    }, [])

    const calendar = useCalendarApp({
        views: [createViewMonthGrid(), createViewMonthAgenda()],
        events: [],
        plugins: [eventsService],
        callbacks: {
            onEventClick: (event) => {
                console.log(event)
            }
        }
    })



    return (
        <div style={{ height: 'calc(100vh - 200px)' }}>
            <ScheduleXCalendar calendarApp={calendar} />
        </div>
    )
}