import React, { PropsWithChildren } from 'react';
import Header from '../Header/Header';

interface Props extends PropsWithChildren{
  logout: () => void;
}

const Layout: React.FC<Props> = ({ children, logout }) => {
  return (
    <>
      <header className="container mx-auto">
        <Header logout={logout}/>
      </header>
      <main className="container mx-auto">{children}</main>
    </>
  );
};

export default Layout;