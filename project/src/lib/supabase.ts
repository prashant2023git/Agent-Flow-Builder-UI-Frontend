import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AgentFlow = {
  id: string;
  name: string;
  description: string | null;
  query: string | null;
  flow_data: {
    nodes?: Array<{
      id: string;
      type: string;
      label: string;
      position: { x: number; y: number };
    }>;
    edges?: Array<{
      id: string;
      source: string;
      target: string;
    }>;
  };
  status: 'draft' | 'published';
  version: string;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};
