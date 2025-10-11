import { useState, useEffect } from 'react';
import { Search, Calendar, Tag } from 'lucide-react';
import { supabase, AgentFlow } from '../lib/supabase';

type CatalogScreenProps = {
  onEditFlow?: (flowId: string) => void;
};

export default function CatalogScreen({ onEditFlow }: CatalogScreenProps) {
  const [agents, setAgents] = useState<AgentFlow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published'>('all');

  useEffect(() => {
    loadAgents();
  }, [filterStatus]);

  const loadAgents = async () => {
    let query = supabase
      .from('agent_flows')
      .select('*')
      .order('created_at', { ascending: false });

    if (filterStatus === 'published') {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading agents:', error);
      return;
    }

    if (data) {
      setAgents(data);
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Explore Agents</h1>
        <p className="text-sm text-gray-600">Find the perfect agent for your needs</p>
      </div>

      <div className="px-8 py-6 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setFilterStatus(filterStatus === 'all' ? 'published' : 'all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Agents
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">All Agents List</h2>
          <p className="text-sm text-gray-600">Browse all available agents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onEditFlow?.(agent.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    agent.status === 'published'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {agent.status === 'published' ? 'Official' : 'Draft'}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">
                {agent.name}
              </h3>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {agent.description || 'No description available'}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(agent.created_at)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-600 mb-2">By {agent.created_by}</p>
                {agent.tags && agent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {agent.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No agents found</p>
          </div>
        )}
      </div>
    </div>
  );
}
