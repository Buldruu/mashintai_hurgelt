import { useState, useCallback } from 'react'
import { INITIAL_STATE } from './constants'
import { reducer } from './store/reducer'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import GuestOrderPage from './pages/auth/GuestOrderPage'
import AdminApp from './pages/admin/AdminApp'
import DriverApp from './pages/driver/DriverApp'
import CustomerApp from './pages/customer/CustomerApp'

export default function App() {
  const [state, setRaw] = useState({ ...INITIAL_STATE, currentUser: null })
  const dispatch = useCallback(a => setRaw(s => reducer(s, a)), [])
  const [page, setPage] = useState('login')

  const handleLogin    = (email, pass) => { const u = state.users.find(u => u.email===email && u.password===pass && u.status==='active'); if (u) { dispatch({ type:'LOGIN', user:u }); return true } return false }
  const handleRegister = data => dispatch({ type:'REGISTER', data })
  const handleLogout   = () => { dispatch({ type:'LOGOUT' }); setPage('login') }

  if (page === 'guest') return <GuestOrderPage onBack={()=>setPage('login')} onSubmit={(form,tracking)=>dispatch({type:'CREATE_DELIVERY',customerId:null,form,tracking})} />

  if (!state.currentUser) {
    if (page === 'register') return <RegisterPage onRegister={handleRegister} onBack={()=>setPage('login')} />
    return <LoginPage onLogin={handleLogin} onGoRegister={()=>setPage('register')} onGuestOrder={()=>setPage('guest')} />
  }

  const cu = state.currentUser
  if (cu.role === 'admin')  return <AdminApp    state={state} dispatch={dispatch} user={cu} onLogout={handleLogout} />
  if (cu.role === 'driver') return <DriverApp   state={state} dispatch={dispatch} user={cu} onLogout={handleLogout} />
  return                           <CustomerApp state={state} dispatch={dispatch} user={cu} onLogout={handleLogout} />
}
