import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css'
import App from './App.jsx'
import Layout from './components/Layout';
import PersonalPage from './components/PersonalPage';
import AuthProvider from './components/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<App />} />
                        <Route path="/me" element={<PersonalPage />} />
                    </Routes>
                </Layout>
            </AuthProvider>
        </BrowserRouter>
  </StrictMode>,
)
