import React, { PropsWithChildren } from 'react';
import Header from '../Header/Header';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header className="container mx-auto">
        <Header/>
      </header>
      <main className="container mx-auto">{children}</main>
    </>
  );
};

export default Layout;