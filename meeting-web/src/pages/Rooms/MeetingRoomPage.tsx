import { DataGrid, GridRowsProp, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField, Typography } from '@mui/material';
import { MeetingRoomViewModel } from '../../services/models/Models';
import { useEffect, useState } from 'react';
import { meetingRoomApi } from '../../services/MeetingRoomService';

export default function MeetingRoomPage() {
    const [rooms, setRooms] = useState<MeetingRoomViewModel[]>([]);
    const [isShowAddModal, setIsShowAddModal] = useState(false);
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [totalRows, setTotalRows] = useState(0);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });
    const [loading, setLoading] = useState(false);

    const fetchRooms = async (page: number, pageSize: number) => {
        setLoading(true);
        try {
            const result = await meetingRoomApi.getAll(page, pageSize);
            setRooms(result.items);
            setTotalRows(result.total);
        } catch (error) {
            console.error('Error fetching meeting rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms(paginationModel.page, paginationModel.pageSize);
    }, [paginationModel]);

    const handlePaginationModelChange = (newModel: GridPaginationModel) => {
        setPaginationModel(newModel);
    };

    const rows: GridRowsProp = rooms.map(room => ({
        id: room.id,
        col1: room.name,
        col2: room.description,
    }));

    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'Room Name', width: 150 },
        { field: 'col2', headerName: 'Description', width: 150 },
        { 
            field: 'col5', 
            headerName: 'Actions', 
            width: 150, 
            renderCell: (params) => (
                <Button 
                    onClick={() => {
                        setSelectedRoomId(params.id as string);
                        setIsShowDeleteModal(true);
                    }}
                    color="error"
                >
                    Delete
                </Button>
            ) 
        },
    ];

    const addRoom = async () => {
        try {
            const room = {
                name,
                description,
            };
            await meetingRoomApi.create(room);
            setIsShowAddModal(false);
            // Refresh the current page
            fetchRooms(paginationModel.page, paginationModel.pageSize);
            // Reset form
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error adding meeting room:', error);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await meetingRoomApi.delete(id);
            // Refresh the current page
            fetchRooms(paginationModel.page, paginationModel.pageSize);
            setIsShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting meeting room:', error);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <Typography gutterBottom sx={{ fontSize: 24 }}>
                Meeting Rooms
            </Typography>

            <Button 
                style={{ marginBottom: '10px' }} 
                variant="contained" 
                onClick={() => setIsShowAddModal(true)}
            >
                Add Room
            </Button>

            <DataGrid 
                rows={rows} 
                columns={columns} 
                pagination
                paginationModel={paginationModel}
                pageSizeOptions={[5, 10, 20]}
                rowCount={totalRows}
                paginationMode="server"
                onPaginationModelChange={handlePaginationModelChange}
                loading={loading}
                disableRowSelectionOnClick={true}
            />

            <Dialog
                open={isShowAddModal}
                onClose={() => setIsShowAddModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle>Add Meeting Room</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'column', width: '500px', marginTop: '5px' }}>
                        <FormControl>
                            <TextField 
                                label="Room Name" 
                                variant="outlined" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </FormControl>

                        <FormControl>
                            <TextField 
                                label="Description" 
                                variant="outlined" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsShowAddModal(false)}>Cancel</Button>
                    <Button onClick={addRoom} variant="contained" color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isShowDeleteModal}
                onClose={() => setIsShowDeleteModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle>Delete Meeting Room</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this meeting room?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsShowDeleteModal(false)}>Cancel</Button>
                    <Button onClick={(e) => handleDelete(e, selectedRoomId)} variant="contained" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
