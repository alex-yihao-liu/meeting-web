import { Button, Card, CardActions, CardContent, Typography, Chip, Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatMeetingTime } from "../../../utils/formats";
import { useMemo } from "react";
import { MeetingViewModel } from "../../../services/models/Models";

export interface MeetingCardProps {
    meeting: MeetingViewModel
}

export default function MeetingCard(props: MeetingCardProps) {

    const [startTime, endTime] = useMemo(() => {
        return [
            formatMeetingTime(props.meeting.startTime),
            formatMeetingTime(props.meeting.endTime)
        ];
    }, [props.meeting.startTime]);

    return <Grid size={{ xs: 12, md: 4, lg: 3 }}>
        <Card >
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                        {props.meeting.meetingRoomName}
                    </Typography>
                    <Typography variant="h5" component="div" >
                        {props.meeting.name}
                    </Typography>

                    <div className="text-gray-400 flex gap-1">
                        <AccessTimeIcon /> <p> {startTime} - {endTime}</p>
                    </div>

                    <Typography variant="body2">
                        {props.meeting.description}
                    </Typography>
                </Box>
            </CardContent>
            <CardActions className="flex justify-center">
                <Button size="small">Join Meeting</Button>
            </CardActions>
        </Card>
    </Grid>
}