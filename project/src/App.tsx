import { useState } from 'react';
import { Screen } from './types';
import { supabase } from './lib/supabase';
import Sidebar from './components/Sidebar';
import QueryScreen from './screens/QueryScreen';
import EditorScreen from './screens/EditorScreen';
import CatalogScreen from './screens/CatalogScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('query');
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null);

  const handleFlowGenerated = (flowId: string) => {
    setCurrentFlowId(flowId);
    setCurrentScreen('editor');
  };

  const handleEditFlow = (flowId: string) => {
    setCurrentFlowId(flowId);
    setCurrentScreen('editor');
  };

  const handlePublishFlow = async (flowId: string) => {
    const { error } = await supabase
      .from('agent_flows')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', flowId);

    if (!error) {
      setCurrentScreen('catalog');
    }
  };

  const handleBackFromEditor = () => {
    setCurrentScreen('query');
    setCurrentFlowId(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentScreen={currentScreen} onScreenChange={setCurrentScreen} />

      <div className="flex-1">
        {currentScreen === 'query' && (
          <QueryScreen onFlowGenerated={handleFlowGenerated} />
        )}

        {currentScreen === 'editor' && (
          <EditorScreen
            flowId={currentFlowId}
            onBack={handleBackFromEditor}
            onPublish={handlePublishFlow}
          />
        )}

        {currentScreen === 'catalog' && (
          <CatalogScreen onEditFlow={handleEditFlow} />
        )}
      </div>
    </div>
  );
}
