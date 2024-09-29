import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import ReactDOM from 'react-dom/client'
import CssBaseline from '@material-ui/core/CssBaseline'

import {App} from './app.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <CssBaseline />
    <App />
  </>,
)
