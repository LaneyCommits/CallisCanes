import { AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageTransition from './motion/PageTransition';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="site-shell">
      <Header />
      <main className="site-main" id="main-content">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
