import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import './index.css'
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
     <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </>,
)
