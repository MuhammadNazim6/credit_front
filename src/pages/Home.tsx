import React from 'react'
import Navbar from '@/components/User/Navbar'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import LandingPage from '@/components/User/LandingPage';
import AdminDashboard from '@/components/admin/AdminDashboard';
import UserContent from '@/components/User/UserContent';


function Home() {

  const { userLoggedIn, adminLoggedIn } = useSelector((state: RootState) => state.auth)
  return (
    <>
      <Navbar />
      {userLoggedIn ? (<UserContent />) : adminLoggedIn ? (<AdminDashboard />) : (<LandingPage />
      )}

    </>
  )
}

export default Home