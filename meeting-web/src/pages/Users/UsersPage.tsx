import { DataGrid, GridRowsProp, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField, Typography } from '@mui/material';
import { UserViewModel } from '../../services/models/Models';
import { useEffect, useState } from 'react';
import { userApi } from '../../services/UserService';

export default function UsersPage() {
    const [users, setUsers] = useState<UserViewModel[]>([]);
    const [isShowAddUserModal, setIsShowAddUserModal] = useState(false);
    const [isShowDeleteUserModal, setIsShowDeleteUserModal] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [totalRows, setTotalRows] = useState(0);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });
    const [loading, setLoading] = useState(false);

    const fetchUsers = async (page: number, pageSize: number) => {
        setLoading(true);
        try {
            const result = await userApi.getAll(page, pageSize);
            setUsers(result.items);
            setTotalRows(result.total);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(paginationModel.page, paginationModel.pageSize);
    }, [paginationModel]);

    const handlePaginationModelChange = (newModel: GridPaginationModel) => {
        setPaginationModel(newModel);
    };

    const rows: GridRowsProp = users.map(user => ({
        id: user.id,
        col1: user.username,
        col2: user.displayName,
        col3: user.email
    }));

    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'User Name', width: 150 },
        { field: 'col2', headerName: 'Display Name', width: 150 },
        { field: 'col3', headerName: 'Email', width: 200 },
        { 
            field: 'col4', 
            headerName: 'Actions', 
            width: 150, 
            renderCell: (params) => (
                <Button 
                    onClick={(e) => {
                        setSelectedUserId(params.id as string);
                        setIsShowDeleteUserModal(true);
                    }}
                    color="error"
                >
                    Delete
                </Button>
            ) 
        },
    ];

    const addUser = async () => {
        try {
            const user = {
                username,
                email,
                displayName
            };
            await userApi.create(user);
            setIsShowAddUserModal(false);
            // Refresh the current page
            fetchUsers(paginationModel.page, paginationModel.pageSize);
            // Reset form
            setUsername('');
            setEmail('');
            setDisplayName('');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await userApi.delete(id);
            // Refresh the current page
            fetchUsers(paginationModel.page, paginationModel.pageSize);
            setIsShowDeleteUserModal(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <Typography gutterBottom sx={{ fontSize: 24 }}>
                Users
            </Typography>

            <Button 
                style={{ marginBottom: '10px' }} 
                variant="contained" 
                onClick={() => setIsShowAddUserModal(true)}
            >
                Add User
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
                open={isShowAddUserModal}
                onClose={() => setIsShowAddUserModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle>Add User</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', gap: '20px', flexDirection: 'column', width: '500px', marginTop: '5px' }}>
                        <FormControl>
                            <TextField 
                                label="User Name" 
                                variant="outlined" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </FormControl>

                        <FormControl>
                            <TextField 
                                label="Display Name" 
                                variant="outlined" 
                                value={displayName} 
                                onChange={(e) => setDisplayName(e.target.value)} 
                            />
                        </FormControl>

                        <FormControl>
                            <TextField 
                                label="Email" 
                                variant="outlined" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsShowAddUserModal(false)}>Cancel</Button>
                    <Button onClick={addUser} variant="contained" color="primary">
                        Add
                    </Button>
                    <Button onClick={() => { handleDelete }} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={isShowDeleteUserModal}
                onClose={() => setIsShowDeleteUserModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this user?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsShowDeleteUserModal(false)}>Cancel</Button>
                    <Button onClick={(e) => handleDelete(e, selectedUserId)} variant="contained" color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
