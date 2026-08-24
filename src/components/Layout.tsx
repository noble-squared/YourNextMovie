import type React from 'react';
import type { ReactNode } from 'react';
import Navbar from './Navbar.tsx';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div id="layout">
      <Navbar />
      <main>
        <div id='main-content'>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
