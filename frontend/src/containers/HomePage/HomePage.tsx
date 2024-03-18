import { useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../../store/users/usersSlice';
import { User } from '../../types';
import { logout } from '../../store/users/usersThunk';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const user = useAppSelector(selectUser);
  const ws = useRef<WebSocket | null>(null);
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  useEffect(() => {
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
  }, []);

  // useEffect(() => {
  //   if (!ws.current) return;
  //
  //   ws.current.send(JSON.stringify({
  //     type: 'LOGIN',
  //     payload: {
  //       token: user?.token
  //     },
  //   }));
  // }, [user]);

  // const loginInChat = () => {
  //   if (ws.current) {
  //     ws.current.send(JSON.stringify({
  //       type: 'LOGIN',
  //       payload: {
  //         token: user?.token
  //       },
  //     }));
  //   }
  // };

  const logoutHandle = async () => {
    if (ws.current) {
      ws.current.send(JSON.stringify({
        type: 'LOGOUT',
        payload: {
          token: user?.token
        }
      }));
    }
    await dispatch(logout()).unwrap();
  };

  return (
    <Layout logout={() => logoutHandle()}>
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
      </div>
    </Layout>
  );
};

export default HomePage;