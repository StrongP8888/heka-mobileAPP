import { useState } from 'react';
import type { TabId } from './types';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import HealthPage from './pages/HealthPage';
import AssistantPage from './pages/AssistantPage';
import ContactPage from './pages/ContactPage';
import MorePage from './pages/MorePage';

const pages: Record<TabId, () => React.ReactNode> = {
  home: HomePage,
  health: HealthPage,
  assistant: AssistantPage,
  contact: ContactPage,
  more: MorePage,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const Page = pages[activeTab];

  return (
    <div className="relative min-h-dvh">
      <Page />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
