import { Workflow, Settings, BarChart3, LogOut } from 'lucide-react';
import { Screen } from '../types';

type SidebarProps = {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
};

export default function Sidebar({ currentScreen, onScreenChange }: SidebarProps) {
  const menuItems = [
    { id: 'catalog' as Screen, icon: Workflow, label: 'Published Agents', section: 'BUILD' },
    { id: 'query' as Screen, icon: Workflow, label: 'Agent Studio', section: 'BUILD' },
  ];

  const operateItems = [
    { icon: Workflow, label: 'Integrations', section: 'OPERATE' },
    { icon: Workflow, label: 'LLM connections', section: 'OPERATE' },
    { icon: Settings, label: 'ENV - Variables', section: 'OPERATE' },
  ];

  const manageItems = [
    { icon: Settings, label: 'Settings', section: 'MANAGE' },
    { icon: BarChart3, label: 'Usage', section: 'MANAGE' },
  ];

  return (
    <div className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Carer</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="text-xs font-semibold text-gray-500 mb-2">BUILD</div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                currentScreen === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4">
          <div className="text-xs font-semibold text-gray-500 mb-2">OPERATE</div>
          {operateItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4">
          <div className="text-xs font-semibold text-gray-500 mb-2">MANAGE</div>
          {manageItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
