import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomePage from './pages/Home'
import AppRouter from './router/AppRouter'
import Navbar from './components/layout/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex flex-col gap-12'>
      <Navbar />
      <AppRouter />
    </div>
  )
}

export default App
