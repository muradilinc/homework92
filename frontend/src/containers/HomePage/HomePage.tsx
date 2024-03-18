import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../../store/users/usersSlice';
import { logout } from '../../store/users/usersThunk';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';

const HomePage = () => {
  const user = useAppSelector(selectUser);
  const ws = useRef<WebSocket | null>(null);
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<string[]>([]);
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<{ author: User, text: string }[]>([]);

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
      if (decodedMessage.type === 'USERS') {
        setUsers(prevState => [...prevState, decodedMessage.payload.onlineUsers]);
        setMessages(decodedMessage.payload.messages);
      }
      if (decodedMessage.type === 'NEW_MESSAGE') {
        setMessages(prevState => [...prevState, decodedMessage.payload]);
      }
    });

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  console.log(messages);

  console.log(user);

  // useEffect(() => {
  //   if (user && ws.current?.readyState === WebSocket.OPEN ) {
  //     ws.current.send(JSON.stringify({
  //       type: 'LOGIN',
  //       payload: {
  //         token: user?.token
  //       },
  //     }));
  //   }
  // }, [user]);

  const loginInChat = () => {
    if (ws.current) {
      ws.current.send(JSON.stringify({
        type: 'LOGIN',
        payload: {
          token: user?.token
        },
      }));
    }
  };

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

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!ws.current) return;

    ws.current.send(JSON.stringify({
      type: 'SEND_MESSAGE',
      payload: {
        token: user?.token,
        text,
      },
    }));
  };

  return (
    <Layout logout={() => logoutHandle()}>
      <div>
        <div className="flex justify-between gap-x-3 my-[10px]">
          <div className="border w-[20%] border-black px-[10px] py-[5px]">
            <h4>Online users</h4>
            <div>
              {
                users ?
                  users.map((user, index) => <p key={index}>{user}</p>)
                  :
                  null
              }
            </div>
          </div>
          <div className="border border-black w-[80%]">
            <div>
              {
                messages.map(message => <p><strong>{message.author?.displayName}</strong>{message.text}</p>)
              }
              <button onClick={loginInChat}>login</button>
            </div>
            <form onSubmit={sendMessage}>
              <input type="text" value={text}
                     onChange={(event: ChangeEvent<HTMLInputElement>) => setText(event.target.value)}/>
              <button type="submit" className="bg-green-400 px-[10px] py-[5px] rounded-[5px] text-white">send</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;