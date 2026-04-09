import { useState } from 'react';
import type { TabId } from './types';
import BottomNav from './components/layout/BottomNav';
import SummaryPage from './pages/SummaryPage';
import SharePage from './pages/SharePage';
import AnalysisPage from './pages/AnalysisPage';
import RemindersPage from './pages/RemindersPage';
import BrowsePage from './pages/BrowsePage';

const pages: Record<TabId, () => React.ReactNode> = {
  summary: SummaryPage,
  share: SharePage,
  analysis: AnalysisPage,
  reminders: RemindersPage,
  browse: BrowsePage,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const Page = pages[activeTab];

  return (
    <div className="relative min-h-dvh">
      <Page />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
