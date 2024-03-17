import React, { PropsWithChildren } from 'react';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header className="container mx-auto">
      </header>
      <main className="container mx-auto">{children}</main>
    </>
  );
};

export default Layout;