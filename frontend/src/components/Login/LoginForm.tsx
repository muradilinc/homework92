import React, { ChangeEvent, FormEvent, useState } from 'react';
import { LoginMutation } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLoginError } from '../../store/users/usersSlice';
import { login } from '../../store/users/usersThunk';

interface Props {
  userExist: () => void;
  sendUser: () => void;
}

const LoginForm: React.FC<Props> = ({userExist, sendUser}) => {
  const [state, setState] = useState<LoginMutation>({
    email: '',
    password: '',
  });
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);

  const changeField = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const sendFormHandler = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(login(state)).unwrap();
      sendUser();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="bg-[#FAF8F4] p-[20px] box-border w-[45%] rounded-[8px] flex flex-col gap-y-[30px]">
        <h2 className="text-center text-5xl font-bold">Sign in</h2>
        <form onSubmit={sendFormHandler} className="flex flex-col gap-y-3">
          <input
            className="bg-gray-50 bg-inherit outline-0 border border-gray-300 text-black text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white"
            value={state.email}
            onChange={changeField}
            name="email"
            type="email"
            required
          />
          <input
            className="bg-gray-50 bg-inherit outline-0 border border-gray-300 text-black text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white"
            value={state.password}
            onChange={changeField}
            name="password"
            type="password"
            required
          />
          {error && <p className="text-sm text-red-500">{error.error}</p>}
          <button
            className="bg-[#1ed760] rounded-[30px] text-base font-bold py-[8px] text-black capitalize"
            type="submit"
          >
            sign in
          </button>
        </form>
        <p className="text-center border-t mt-[30px] py-[30px] border-gray-500">
          No account?{' '}
          <button type="button" className="hover:text-[#1ed760]" onClick={userExist}>
            Sign up for Spotify
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;