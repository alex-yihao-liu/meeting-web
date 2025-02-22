import './App.css'
import { Route, Routes, Navigate } from 'react-router'
import HomePage from './pages/Home/HomePage'
import LoginPage from './pages/Login/LoginPage.tsx'
import AuthLayout from './layouts/AuthLayout.tsx'
import Layout from './layouts/Layout.tsx'
import RoomsPage from './pages/Rooms/MeetingRoomPage.tsx'
import MeetingsCalendar from './pages/Meetings/MeetingsCalendar.tsx'
import UsersPage from './pages/Users/UsersPage.tsx'

function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          {/* <Route path="register" element={<Register />} /> */}
        </Route>

        <Route path='dashboard' element={<Layout />} >
          <Route path='home' element={<HomePage />} />
          <Route path='rooms' element={<RoomsPage />} />
        </Route>
        <Route path='meetings' element={<Layout />} >
          <Route path='calendar' element={<MeetingsCalendar />} />
          <Route path='rooms' element={<RoomsPage />} />
        </Route>
        <Route path='system' element={<Layout />} >
          <Route path='users' element={<UsersPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard/home" />}>
        </Route>
      </Routes>
    </>
  )
}

export default App
