import { useState, useEffect } from 'react';
import { Save, Eye, ArrowLeft, Plus, Minus, Maximize2, Download } from 'lucide-react';
import { supabase, AgentFlow } from '../lib/supabase';
import { FlowNode, FlowEdge } from '../types';

type EditorScreenProps = {
  flowId: string | null;
  onBack: () => void;
  onPublish: (flowId: string) => void;
};

export default function EditorScreen({ flowId, onBack, onPublish }: EditorScreenProps) {
  const [flow, setFlow] = useState<AgentFlow | null>(null);
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (flowId) {
      loadFlow();
    }
  }, [flowId]);

  const loadFlow = async () => {
    if (!flowId) return;

    const { data, error } = await supabase
      .from('agent_flows')
      .select('*')
      .eq('id', flowId)
      .maybeSingle();

    if (error) {
      console.error('Error loading flow:', error);
      return;
    }

    if (data) {
      setFlow(data);
      setNodes(data.flow_data.nodes || []);
      setEdges(data.flow_data.edges || []);
    }
  };

  const saveFlow = async () => {
    if (!flowId) return;

    const { error } = await supabase
      .from('agent_flows')
      .update({
        flow_data: { nodes, edges },
        updated_at: new Date().toISOString()
      })
      .eq('id', flowId);

    if (error) {
      console.error('Error saving flow:', error);
    }
  };

  const handlePublish = () => {
    if (flowId) {
      onPublish(flowId);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Response Agent Editor</h1>
            {flow && <p className="text-sm text-gray-600">{flow.name}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Reorder Flow
          </button>
          <button
            onClick={saveFlow}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Validate
          </button>
          <button
            onClick={handlePublish}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-white"
          style={{
            backgroundImage: `
              linear-gradient(to right, #f0f0f0 1px, transparent 1px),
              linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        >
          <div
            className="relative w-full h-full p-8"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {edges.map((edge) => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const x1 = sourceNode.position.x + 120;
                const y1 = sourceNode.position.y + 35;
                const x2 = targetNode.position.x;
                const y2 = targetNode.position.y + 35;

                return (
                  <g key={edge.id}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#cbd5e1"
                      strokeWidth="2"
                    />
                    <circle cx={x2} cy={y2} r="4" fill="#cbd5e1" />
                  </g>
                );
              })}
            </svg>

            {nodes.map((node) => (
              <div
                key={node.id}
                className={`absolute bg-white border-2 rounded-lg shadow-sm px-4 py-3 cursor-move hover:shadow-md transition-shadow ${
                  selectedNode === node.id ? 'border-blue-500' : 'border-gray-300'
                }`}
                style={{
                  left: node.position.x,
                  top: node.position.y,
                  width: '120px'
                }}
                onClick={() => setSelectedNode(node.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-900">{node.label}</span>
                </div>
                <div className="text-xs text-gray-500">get-my-event</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute left-4 bottom-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
