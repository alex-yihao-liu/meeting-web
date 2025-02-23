import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { Button, Typography, Dialog, DialogContent, DialogActions, TextField, DialogTitle, FormControl, MenuItem, Select, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import Divider from '@mui/material/Divider';
import MeetingCard from './components/MeetingCard';
import { useEffect, useState } from 'react';
import { meetingApi } from '../../services/MeetingService';
import { MeetingViewModel, MeetingRoomViewModel, UserViewModel } from '../../services/models/Models';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { meetingRoomApi } from '../../services/MeetingRoomService';
import { userApi } from '../../services/UserService';
import dayjs from 'dayjs';
import { useAuth } from '../../contexts/AuthContext';

export default function HomePage() {
    const { user } = useAuth();
    const [meetings, setMeetings] = useState<MeetingViewModel[]>([]);
    const [rooms, setRooms] = useState<MeetingRoomViewModel[]>([]);
    const [users, setUsers] = useState<UserViewModel[]>([]);
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
    const [isShowBookingModal, setIsShowBookingModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(null);
    const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [meetingsResponse, roomsResponse, usersResponse] = await Promise.all([
                    meetingApi.getAll(),
                    meetingRoomApi.getAll(0, 100),
                    userApi.getAll(0, 100)
                ]);
                setMeetings(meetingsResponse);
                setRooms(roomsResponse.items);
                setUsers(usersResponse.items);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleParticipantChange = (username: string) => {
        setSelectedParticipants(prev => {
            if (prev.includes(username)) {
                return prev.filter(p => p !== username);
            } else {
                return [...prev, username];
            }
        });
    };

    const handleBookMeeting = async () => {
        if (!user || !startTime || !endTime) return;

        setLoading(true);
        try {
            const bookingRequest = {
                name,
                description,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                participants: selectedParticipants,
                meetingRoomId: selectedRoomId
            };

            await meetingApi.bookMeeting(bookingRequest);
            
            // Refresh meetings list
            const updatedMeetings = await meetingApi.getAll();
            setMeetings(updatedMeetings);
            
            // Reset form and close modal
            resetForm();
            setIsShowBookingModal(false);
        } catch (error) {
            console.error('Error booking meeting:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setStartTime(null);
        setEndTime(null);
        setSelectedRoomId('');
        setSelectedParticipants([]);
    };

    return (
        <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column' }} >
            <Divider>
                <Typography gutterBottom sx={{ fontSize: 28 }}>
                    My Meetings
                </Typography>
            </Divider>
            <Box sx={{ display: 'flex', gap: '30px', flexDirection: 'row' }}>
                <Button 
                    variant="contained" 
                    onClick={() => setIsShowBookingModal(true)}
                    disabled={loading}
                >
                    Book Meeting
                </Button>
            </Box>

            <Grid container spacing={2}>
                {meetings.map(meeting => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
            </Grid>
            
            <Dialog
                open={isShowBookingModal}
                onClose={() => !loading && setIsShowBookingModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
               
                maxWidth="md"
            >
                <DialogTitle>Book Meeting</DialogTitle>
                <DialogContent  sx={{ width: '100%', maxWidth: 800 }}>
                    <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'column', mt: 2 }}>
                        <FormControl fullWidth>
                            <TextField 
                                label="Meeting Name" 
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker 
                                    label="Start Time" 
                                    value={startTime}
                                    onChange={(newValue) => setStartTime(newValue)}
                                    minDateTime={dayjs()}
                                />
                            </LocalizationProvider>
                        </FormControl>

                        <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker 
                                    label="End Time" 
                                    value={endTime}
                                    onChange={(newValue) => setEndTime(newValue)}
                                    minDateTime={startTime || dayjs()}
                                />
                            </LocalizationProvider>
                        </FormControl>

                        <FormControl fullWidth>
                            <Select
                                value={selectedRoomId}
                                onChange={(e) => setSelectedRoomId(e.target.value)}
                                displayEmpty
                                required
                            >
                                <MenuItem value="">
                                    <em>Select a Room</em>
                                </MenuItem>
                                {rooms.map((room) => (
                                    <MenuItem key={room.id} value={room.id}>
                                        {room.name} - {room.description}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <Typography  gutterBottom>
                                Select Participants({selectedParticipants.length})
                            </Typography>
                            
                            <FormGroup sx={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
                                {users.map((u) => (
                                    <FormControlLabel
                                        key={u.username}
                                        control={
                                            <Checkbox
                                                checked={selectedParticipants.includes(u.username)}
                                                onChange={() => handleParticipantChange(u.username)}
                                   
                                            />
                                        }
                                        label={u.username}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>

                        <FormControl fullWidth>
                            <TextField 
                                label="Description" 
                                variant="outlined"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={3}
                            />
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setIsShowBookingModal(false)} 
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleBookMeeting} 
                        variant="contained" 
                        disabled={loading || !name || !startTime || !endTime || !selectedRoomId}
                    >
                        {loading ? 'Booking...' : 'Book'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
