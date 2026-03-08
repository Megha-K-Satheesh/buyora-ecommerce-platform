import { GoogleOAuthProvider } from "@react-oauth/google"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { store } from './Redux/store.js'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

    <Provider store={store}>

    <BrowserRouter>
    
    <App />
    </BrowserRouter>
    </Provider>
    </GoogleOAuthProvider>

  </StrictMode>,
)
