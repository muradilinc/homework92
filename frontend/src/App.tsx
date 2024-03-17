import { useEffect, useRef, useState } from 'react';
import RegisterForm from './components/Register/RegisterForm';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectUser } from './store/users/usersSlice';
import { logout } from './store/users/usersThunk';
import LoginForm from './components/Login/LoginForm';

const App = () => {
  const [newUser, setNewUser] = useState(false);
  const user = useAppSelector(selectUser);
  const ws = useRef<WebSocket | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      ws.current = new WebSocket('ws://localhost:8000/chat');
      ws.current.addEventListener('close', () => console.log('close'));
      ws.current.addEventListener('message', (event) => {
        // const decodedMessage = JSON.parse(event.data) as IncomingMessage;
        console.log(event);
      });

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [user]);

  const loginInChat = () => {
    if (!ws.current) return;
    ws.current.send(JSON.stringify({
      type: 'LOGIN',
      payload: {
        token: user?.token
      },
    }));
  };

  return (
    <div>
      {
        user ?
          <div>
            <h1>chat</h1>
            <button onClick={loginInChat}>login</button>
            <button onClick={() => dispatch(logout())}>logout</button>
          </div>
          :
          newUser ?
            <LoginForm sendUser={() => loginInChat()} userExist={() => setNewUser(false)}/>
            :
            <RegisterForm sendUser={() => loginInChat()} userExist={() => setNewUser(true)}/>
      }
    </div>
  );
};

export default App;