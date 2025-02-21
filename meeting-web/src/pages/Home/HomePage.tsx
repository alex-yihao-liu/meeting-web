import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { Button, Typography, Dialog, DialogContent, DialogActions, TextField, DialogTitle, FormControlLabel, Checkbox } from '@mui/material';
import Divider from '@mui/material/Divider';
import MeetingCard from './components/MeetingCard';
import { useEffect, useState } from 'react';
import { meetingApi } from '../../services/MeetingService';
import { MeetingViewModel } from '../../services/models/Models';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FormControl from '@mui/material/FormControl';



export default function HomePage() {
    const [meetings, setMeetings] = useState<MeetingViewModel[]>([]);
    const [isShowBookingModal, setIsShowBookingModal] = useState(false);

    useEffect(() => {
        const fetchMeetings = async () => {
            const response = await meetingApi.getAll();
            setMeetings(response);
        };
        fetchMeetings();

        return () => {
            // this now gets called when the component unmounts
        };
    }, []);

    function bookMeeting(): void {
        setIsShowBookingModal(true);
    }

    return (
        <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column' }} >
            <Divider>
                <Typography gutterBottom sx={{ fontSize: 28 }}>
                    My Meetings
                </Typography>
            </Divider>
            <Box sx={{ display: 'flex', gap: '30px', flexDirection: 'row' }}>
                <Button variant="contained" onClick={bookMeeting}>Book Meeting</Button>
            </Box>

            <Grid container spacing={2}>
                {meetings.map(meeting => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
            </Grid>
            <Dialog
                open={isShowBookingModal}
                onClose={() => setIsShowBookingModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle>Book Meeting</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'column', width: '500px' }}>
                        <FormControl>
                            {/* <InputLabel htmlFor="component-outlined">Meeting Name</InputLabel> */}
                            <TextField id="outlined-basic" label="Meeting Name" variant="outlined" />
                        </FormControl>
                        <FormControl>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker label="Start Time" name='startTime' />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker label="End Time" name='endTime' />
                            </LocalizationProvider>
                        </FormControl>
                        <div>
                            <Typography gutterBottom sx={{ fontSize: 18 }}>
                                Participants
                            </Typography>
                            <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'row', width: '500px' }}>
                                <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                                <FormControlLabel required control={<Checkbox />} label="Required" />
                                <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
                            </Box>
                        </div>
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsShowBookingModal(false)}>Cancel</Button>
                    <Button variant="contained" type="submit">Book</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}




