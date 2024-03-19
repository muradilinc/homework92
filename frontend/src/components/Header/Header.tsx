import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../store/users/usersSlice';
import React from 'react';

interface Props {
  logout: () => void;
}

const Header: React.FC<Props> = ({ logout }) => {
  const user = useAppSelector(selectUser);

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-b border-black py-[20px]">
      <h1 className="text-green-500 font-semibold text-[20px]">WeChat</h1>
      <div>
        {user ? (
          <div className="flex gap-x-3 items-center">
            <h4>{user.displayName}</h4>
            <button
              onClick={logout}
              className="px-[10px] text-white rounded-[8px] py-[5px] bg-blue-300"
            >
              logout
            </button>
          </div>
        ) : (
          <button className="px-[10px] text-white rounded-[8px] py-[5px] bg-blue-300">
            login
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
