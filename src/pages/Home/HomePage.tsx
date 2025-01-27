import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import MeetingCard from './components/MeetingCard';
import { Meeting } from '../../models/meeting';
import { useEffect, useState } from 'react';

const mockMeetings: Meeting[] = [
    {
        id: '1',
        title: 'Project Kickoff Meeting',
        description: 'Initial meeting to discuss project scope, timeline, and deliverables.',
        start: new Date('2025-02-01T09:00:00'),
        end: new Date('2025-02-01T11:00:00'),
        location: 'Conference Room A',
        participants: ['Alice Johnson', 'Bob Smith', 'Charlie Brown']
    },
    {
        id: '2',
        title: 'Weekly Team Sync',
        description: 'Regular meeting to discuss weekly progress and roadblocks.',
        start: new Date('2025-02-05T10:30:00'),
        end: new Date('2025-02-05T11:30:00'),
        location: 'Zoom',
        participants: ['David Lee', 'Emma Watson', 'Frank Harris']
    },
    {
        id: '3',
        title: 'Client Presentation',
        description: 'Presentation of the project updates to the client stakeholders.',
        start: new Date('2025-02-10T14:00:00'),
        end: new Date('2025-02-10T15:30:00'),
        location: 'Client Headquarters',
        participants: ['George King', 'Hannah White', 'Isabella Moore']
    },
    {
        id: '4',
        title: 'Sprint Planning',
        description: 'Planning session for the upcoming development sprint.',
        start: new Date('2025-02-12T09:00:00'),
        end: new Date('2025-02-12T10:30:00'),
        location: 'Office Room B',
        participants: ['Jack Wilson', 'Kate Brown', 'Liam Johnson']
    },
    {
        id: '5',
        title: 'HR Policy Update Meeting',
        description: 'Discussion on the new HR policies and guidelines.',
        start: new Date('2025-02-15T16:00:00'),
        end: new Date('2025-02-15T17:00:00'),
        location: 'Teams',
        participants: ['Michael Scott', 'Nina Davis', 'Oliver Green']
    }
];


export default function HomePage() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);

    useEffect(() => {
        setMeetings(mockMeetings)
    }, []);

    return (
        <Box sx={{ display: 'flex', gap: '30px', flexDirection: 'column' }} >
            <Divider>
                <Typography gutterBottom sx={{ fontSize: 28 }}>
                    My Meetings
                </Typography>
            </Divider>
            <Grid container spacing={2}>
                {meetings.map(meeting => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
            </Grid>
        </Box>
    );
}




