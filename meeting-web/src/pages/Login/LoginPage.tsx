import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from "react-router";
import { useState } from 'react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleLogin = async () => {
        await login(
            username,
            password
        )
        

        navigate('/dashboard/home')
    }

    return (
        <Card style={{ width: '500px', margin: 'auto', padding: '50px' }}>

            <Stack
                component="form"

                sx={{ '& > :not(style)': { m: 1 } }}
                noValidate
                autoComplete="off"
            >
                <div className='text-center'>
                    <h1>Login</h1>
                    <p>Welcome, please sign in to continue</p>
                </div>


                <FormControl>
                    <InputLabel htmlFor="component-outlined">Username</InputLabel>
                    <OutlinedInput

                        id="component-outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        label="Name"
                    />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="component-outlined">Password</InputLabel>
                    <OutlinedInput

                        id="component-outlined"
                        value={password }
                        onChange={(e) => setPassword(e.target.value)}
                        label="Name"
                    />
                </FormControl>
                <Button variant="contained" onClick={handleLogin} >Login</Button>
            </Stack>
        </Card>
    );
}
