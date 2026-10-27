import { useState } from 'react';
import SignupPage from './auth/signup/page';
import LoginPage from './auth/login/page';

function App() {
  // Defaults to 'signup' view as requested
  const [currentView, setCurrentView] = useState<'signup' | 'login'>('signup');

  return (
    <div className="min-h-screen w-full">
      {currentView === 'signup' ? (
        <SignupPage onNavigateToLogin={() => setCurrentView('login')} />
      ) : (
        <LoginPage onNavigateToSignup={() => setCurrentView('signup')} />
      )}
    </div>
  );
}

export default App;
