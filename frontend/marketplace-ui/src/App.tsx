import { useState } from 'react';
import Navbar, { type MarketplaceView } from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SignupPage from './auth/signup/page';
import LoginPage from './auth/login/page';
import ProfilePage from './profile/page';
import CatalogView from './views/CatalogView';
import CartCheckoutView from './views/CartCheckoutView';
import VendorDashboardView from './views/VendorDashboardView';
import AdminConsoleView from './views/AdminConsoleView';
import { MarketplaceProvider } from './context/MarketplaceContext';

function AppContent() {
  const [currentView, setCurrentView] = useState<MarketplaceView>('catalog');

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#fcfcfb] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Atelier Luxury Header with navigation hooks */}
      <Navbar currentView={currentView} onNavigate={(view) => setCurrentView(view)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center">
        {currentView === 'catalog' && (
          <CatalogView onNavigateToCart={() => setCurrentView('cart')} />
        )}
        {currentView === 'cart' && (
          <CartCheckoutView onNavigateToCatalog={() => setCurrentView('catalog')} />
        )}
        {currentView === 'vendor' && (
          <VendorDashboardView onNavigateToProfile={() => setCurrentView('profile')} />
        )}
        {currentView === 'admin' && <AdminConsoleView />}
        {currentView === 'login' && (
          <LoginPage
            onNavigateToSignup={() => setCurrentView('signup')}
            onNavigateToProfile={() => setCurrentView('profile')}
          />
        )}
        {currentView === 'signup' && (
          <SignupPage
            onNavigateToLogin={() => setCurrentView('login')}
            onNavigateToProfile={() => setCurrentView('profile')}
          />
        )}
        {currentView === 'profile' && (
          <ProfilePage
            onNavigateToLogin={() => setCurrentView('login')}
            onNavigateToSignup={() => setCurrentView('signup')}
          />
        )}
      </main>

      {/* Atelier Architectural Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <MarketplaceProvider>
      <AppContent />
    </MarketplaceProvider>
  );
}

export default App;
