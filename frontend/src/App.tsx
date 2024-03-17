import { useEffect, useRef, useState } from 'react';
import RegisterForm from './components/Register/RegisterForm';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectUser } from './store/users/usersSlice';
import { logout } from './store/users/usersThunk';
import LoginForm from './components/Login/LoginForm';
import Layout from './components/Layout/Layout';
import { User } from './types';

const App = () => {
  const [newUser, setNewUser] = useState(false);
  const user = useAppSelector(selectUser);
  const ws = useRef<WebSocket | null>(null);
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (user) {
      ws.current = new WebSocket('ws://localhost:8000/chat');
      ws.current.addEventListener('close', () => console.log('close'));
      ws.current.addEventListener('message', (event) => {
        const decodedMessage = JSON.parse(event.data);
        setUsers(decodedMessage.users);
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

  const logoutHandle = async () => {
    if (!ws.current) return;

    ws.current.send(JSON.stringify({
      type: 'LOGOUT',
      payload: {
        token: user?.token
      }
    }));
    await dispatch(logout()).unwrap();
  };

  return (
    <Layout>
      {
        user ?
          <div>
            <div className="flex ">
              <div className="border border-black">
                <h4>Online users</h4>
                <div>
                  {
                    users ?
                      users.map(user => <p key={user._id}>{user.displayName}</p>)
                      :
                      null
                  }
                </div>
              </div>
              <div className="border border-black">
                <h1>message</h1>
              </div>
            </div>
            <button onClick={loginInChat}>login</button>
            <button onClick={logoutHandle}>logout</button>
          </div>
          :
          newUser ?
            <LoginForm sendUser={() => loginInChat()} userExist={() => setNewUser(false)}/>
            :
            <RegisterForm sendUser={() => loginInChat()} userExist={() => setNewUser(true)}/>
      }
    </Layout>
  );
};

export default App;