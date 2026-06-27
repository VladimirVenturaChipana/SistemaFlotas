import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Register from './pages/register'
import CssBaseline from '@mui/material/CssBaseline'

const lightTheme = createTheme({
  palette: {
    mode: 'light'
  }
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App() {
  const [isLight, setIsLight] = useState(true)

  return (
    <ThemeProvider theme={isLight ? lightTheme : darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login isLight={isLight} setIsLight={setIsLight} />} />
          <Route path='/login' element={<Login isLight={isLight} setIsLight={setIsLight} />} />
          <Route path='/register' element={<Register isLight={isLight} setIsLight={setIsLight} />} />
          <Route path='/home' element={<Home isLight={isLight} setIsLight={setIsLight} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App