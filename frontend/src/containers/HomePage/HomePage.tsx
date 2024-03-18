import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../../store/users/usersSlice';
import { logout } from '../../store/users/usersThunk';
import { useNavigate } from 'react-router-dom';
import { IncomingMessage, Message, User } from '../../types';
import { Trash } from '@phosphor-icons/react';

const HomePage = () => {
  const user = useAppSelector(selectUser);
  const ws = useRef<WebSocket | null>(null);
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [waitingToReconnect, setWaitingToReconnect] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');
    ws.current.addEventListener('close', () => {
      if (waitingToReconnect) {
        return;
      }
      console.log('close');
      setWaitingToReconnect(true);
      setTimeout(() => setWaitingToReconnect(null), 3000);
    });
    ws.current.addEventListener('message', (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;
      if (decodedMessage.type === 'WELCOME') {
        if (ws.current) {
          ws.current.send(JSON.stringify({
            type: 'LOGIN',
            payload: {
              token: user?.token
            },
          }));
        }
      }
      if (decodedMessage.type === 'USERS') {
        setUsers(decodedMessage.payload.onlineUsers);
        setMessages(decodedMessage.payload.messages);
      }
      if (decodedMessage.type === 'NEW_MESSAGE') {
        setMessages(prevState => [...prevState, decodedMessage.payload as Message]);
      }
      if (decodedMessage.type === 'REFRESH_MESSAGE') {
        setMessages(decodedMessage.payload.messages);
      }
    });

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [user?.token, waitingToReconnect]);


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
    setText('');
  };

  const deleteMessage = (id: string, role?: string) => {
    ws.current?.send(JSON.stringify({
      type: 'DELETE_MESSAGE',
      payload: {_id: id, role}
    }));
  };

  return (
    <Layout logout={() => logoutHandle()}>
      <div>
        <div className="flex justify-between gap-x-3 my-[10px]">
          <div className="border w-[20%] border-black px-[10px] py-[5px]">
            <h4 className="text-center text-[#1ed760]">Online users</h4>
            <div>
              {
                users ?
                  users.map((user) => <p key={user._id}>{user.displayName}</p>)
                  :
                  null
              }
            </div>
          </div>
          <div className="border border-black w-[80%] max-h-[80vh] p-[10px]">
            <div className="flex flex-col gap-y-3 overflow-y-scroll h-[90%]">
              {
                messages.map((message) =>
                  <div className="p-[10px] w-fit flex gap-x-5 bg-[#FAF8F4] rounded-[5px]">
                    <p key={message._id}><strong>{message.author.displayName}:</strong> {message.text} </p>
                    {
                      user?.role === 'admin' ?
                        <Trash className="cursor-pointer" size={22} weight="fill" color="#ef233c"
                               onClick={() => deleteMessage(message._id, user?.role)}>delete</Trash>
                        :
                        null
                    }
                  </div>
                )
              }
            </div>
            <form className="flex gap-x-3 my-[15px]" onSubmit={sendMessage}>
              <input
                type="text"
                className="bg-gray-50 outline-0 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={text}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setText(event.target.value)}
              />
              <button type="submit" className="bg-green-400 px-[10px] py-[5px] rounded-[5px] text-white">send</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;