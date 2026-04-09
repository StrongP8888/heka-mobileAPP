import { useState, useCallback } from 'react';
import type { TabId } from './types';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import HealthPage from './pages/HealthPage';
import AssistantPage from './pages/AssistantPage';
import ContactPage from './pages/ContactPage';
import MorePage from './pages/MorePage';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [assistantPrefill, setAssistantPrefill] = useState<string | undefined>();

  const goToAssistant = useCallback((prefill: string) => {
    setAssistantPrefill(prefill);
    setActiveTab('assistant');
  }, []);

  const clearPrefill = useCallback(() => {
    setAssistantPrefill(undefined);
  }, []);

  return (
    <div className="relative min-h-dvh">
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'health' && <HealthPage onAskAssistant={goToAssistant} />}
      {activeTab === 'assistant' && <AssistantPage prefillMessage={assistantPrefill} onPrefillConsumed={clearPrefill} />}
      {activeTab === 'contact' && <ContactPage />}
      {activeTab === 'more' && <MorePage />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
