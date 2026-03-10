import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import BitchAssDinosaur from './components/random-components/bitchassdinosaur.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <BitchAssDinosaur /> */}
  </StrictMode>,
)
