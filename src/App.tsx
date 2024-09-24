import React, { useState } from 'react'
import './App.css'
import UserRoutes from './routes/UserRoutes'
import { GoogleOAuthProvider } from '@react-oauth/google';


function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
      <GoogleOAuthProvider clientId={clientId}>
        <UserRoutes/>
      </GoogleOAuthProvider >
  )
}

export default App
