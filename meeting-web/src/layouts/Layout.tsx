
import { Outlet, Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext.tsx";
import AppBar from '@mui/material/AppBar';
import { Box, Button, Toolbar, Typography } from "@mui/material";
import SideMenu from "../components/SideMenu";
import PageContainer from "../components/PageContainer";

export default function Layout() {
    const { user } = useAuth();

    return (
        user && (
        <div className="w-full h-screen">
            <AppBar position="static">
                <Toolbar>
                    <Typography color="inherit">Book Meetings</Typography>
                    {/* <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton> */}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

                    </Typography>
                    <Button color="inherit">{user?.username}</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', p: 2, gap: '10px' }}>
                <SideMenu />
                <PageContainer>
                    <Outlet />
                </PageContainer>
            </Box>
        </div >)
    );
};