import './App.css'
import RegisterPage from './RegisterPage'
import LoginPage from './LoginPage'
import JobListPage from './JobListPage'
import ApplyJobPage from './ApplyJobPage'
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"

function App() {

  return (
    <BrowserRouter>
		<Routes>
			<Route path='/' element={<Navigate to="/login" replace />} />
			<Route path='/register' element={<RegisterPage/>} />
			<Route path='/login' element={<LoginPage/>} />
			<Route path='/jobs' element={<JobListPage/>} />
			<Route path='/apply/:jobId' element={<ApplyJobPage/>} />
			<Route path='*' element={<Navigate to="/login" replace />} />
		</Routes>
    </BrowserRouter>
  )
}

export default App
