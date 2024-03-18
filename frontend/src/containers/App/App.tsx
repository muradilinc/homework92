import { Route, Routes } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import LoginForm from '../LoginPage/LoginForm';
import RegisterForm from '../RegisterPage/RegisterForm';

const App = () => {
  return (
    <>
      <Routes>
        <Route path={'/'} element={<HomePage/>}/>
        <Route path={'/login'} element={<LoginForm/>}/>
        <Route path={'/register'} element={<RegisterForm/>}/>
      </Routes>
    </>
  );
};

export default App;