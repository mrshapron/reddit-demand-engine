import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CompanyProfileProvider } from './store/companyStore';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CompanyProfileProvider>
        <App />
      </CompanyProfileProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
