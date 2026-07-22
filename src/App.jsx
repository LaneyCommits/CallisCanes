import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CollectionPage = lazy(() => import('./pages/ShopPage'));
const CaneDetailPage = lazy(() => import('./pages/CaneDetailPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CustomOrdersPage = lazy(() => import('./pages/CommissionPage'));

function PageLoader() {
  return <p className="loading-state">Loading...</p>;
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="collection" element={<CollectionPage />} />
          <Route path="collection/:slug" element={<CaneDetailPage />} />
          <Route path="custom-orders" element={<CustomOrdersPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="contact" element={<ContactPage />} />

          <Route path="shop" element={<Navigate to="/collection" replace />} />
          <Route path="shop/:slug" element={<Navigate to="/collection" replace />} />
          <Route path="commission" element={<Navigate to="/custom-orders" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
