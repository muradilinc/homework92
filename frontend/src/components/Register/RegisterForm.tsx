import React, { ChangeEvent, FormEvent, useState } from 'react';
import { RegisterMutation } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectRegisterError } from '../../store/users/usersSlice';
import { register } from '../../store/users/usersThunk';

interface Props {
  userExist: () => void;
  sendUser: () => void;
}

const RegisterForm: React.FC<Props> = ({userExist, sendUser}) => {
  const [state, setState] = useState<RegisterMutation>({
    email: '',
    password: '',
  });
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);

  const changeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const sendFormHandler = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(register(state)).unwrap();
      sendUser();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-[#FAF8F4] p-[20px] box-border w-[45%] rounded-[8px]">
        <h2 className="text-center text-5xl font-bold mb-[30px]">Sign Up</h2>
        <form onSubmit={sendFormHandler} className="flex flex-col gap-y-3">
          <input
            className="bg-gray-50 bg-inherit outline-0 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white"
            name="email"
            value={state.email}
            onChange={changeField}
            type="email"
            required
          />
          <input
            className="bg-gray-50 bg-inherit outline-0 border border-gray-600 text-black text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white"
            name="password"
            value={state.password}
            onChange={changeField}
            type="password"
            required
          />
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <button
            className="bg-[#1ed760] rounded-[30px] text-base font-bold py-[8px] text-black capitalize"
            type="submit"
          >
            sign up
          </button>
          <button onClick={userExist}>i have acc</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;