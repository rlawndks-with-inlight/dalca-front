import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.css'
import theme from './styles/theme'
import App from '../src/pages/App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.hydrateRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ThemeProvider>
);
reportWebVitals();