import { useState } from 'react';
import { Search, Plus, ArrowRight } from 'lucide-react';
import { supabase, AgentFlow } from '../lib/supabase';
import { FlowData } from '../types';

type QueryScreenProps = {
  onFlowGenerated: (flowId: string) => void;
};

const presetAgents = [
  'ConnectorHub', 'DocVision', 'SchemaForge', 'DataLineage', 'IndexSmith', 'RetrievePro',
  'PlanRouter', 'ToolRunner', 'CliffReason', 'MemWeaver', 'CarerWall', 'ClosedTheLoop'
];

export default function QueryScreen({ onFlowGenerated }: QueryScreenProps) {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentAgents, setRecentAgents] = useState<AgentFlow[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  const generateFlow = async () => {
    if (!query.trim()) return;

    setIsGenerating(true);
    try {
      const nodes: FlowData['nodes'] = [
        { id: '1', type: 'reception', label: 'Reception', position: { x: 100, y: 100 } },
        { id: '2', type: 'triage', label: 'Triage', position: { x: 300, y: 100 } },
        { id: '3', type: 'assessment', label: 'Assessment', position: { x: 500, y: 100 } },
        { id: '4', type: 'treatment', label: 'Treatment', position: { x: 700, y: 100 } },
        { id: '5', type: 'discharge', label: 'Discharge', position: { x: 900, y: 100 } }
      ];

      const edges: FlowData['edges'] = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
        { id: 'e4-5', source: '4', target: '5' }
      ];

      const { data, error } = await supabase
        .from('agent_flows')
        .insert({
          name: `Flow: ${query.substring(0, 50)}`,
          description: 'Auto-generated agent flow',
          query: query,
          flow_data: { nodes, edges },
          status: 'draft',
          version: '1.0.0',
          tags: ['auto-generated']
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        onFlowGenerated(data.id);
      }
    } catch (error) {
      console.error('Error generating flow:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Recent Agents</h1>
            <p className="text-sm text-gray-600">Pick up where you left off or start something new</p>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Agents..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">All Agents</span>
            </div>
          </div>

          <button className="w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors mb-8">
            <Plus className="w-8 h-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Create New</span>
            <span className="text-xs text-gray-500">Start fresh agent</span>
          </button>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Build Agents</h2>
                <p className="text-sm text-gray-600">Describe what you want to automate and watch AI create intelligent workflows for you</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">×</button>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {presetAgents.map((agent) => (
                  <button
                    key={agent}
                    className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-full text-sm hover:bg-blue-50 transition-colors"
                  >
                    {agent}
                  </button>
                ))}
              </div>

              <div className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="provide me the sequence of agents for Clinical front door"
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={generateFlow}
                  disabled={isGenerating || !query.trim()}
                  className="absolute bottom-4 right-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
