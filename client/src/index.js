// Import necessary libraries and hooks for React functionality
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { BrowserRouter } from 'react-router-dom';

// Import your application's Redux store and Firebase configuration
import store from './state/store';
import './config/firebase';

// Import main application component and styling
import App from './App';
import './index.css'; // Global styles

// Import theme settings for dynamic theme customization
import {themeSettings} from './themes/baseTheme';
//import { themeSettings } from './themes/altTheme';

/**
 * Root Component
 * Created to handle theme logic and encapsulate application structure.
 * Ensures hooks like useSelector and useMemo are used correctly 
 * (inside React function components and at the top level of the component).
 * Maintains modularity and React's rules of hooks compliance.
 */
const Root = () => {
  const mode = useSelector((state) => state.theme.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}> 
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
};

// Create the root of the application where components will be mounted
const root = ReactDOM.createRoot(document.getElementById('root'));


/**
 * Render the application
 * The application is wrapped with the Redux Provider to manage state globally.
 */
root.render(
  <React.StrictMode>
    {/* Wrap Root inside Provider */}
    <Provider store={store}>
      <Root />
    </Provider>
  </React.StrictMode>
);
