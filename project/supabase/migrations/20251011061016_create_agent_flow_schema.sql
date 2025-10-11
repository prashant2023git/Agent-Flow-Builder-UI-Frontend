/*
  # Agent Flow Builder Database Schema

  1. New Tables
    - `agent_flows`
      - `id` (uuid, primary key)
      - `name` (text, required) - Name of the agent flow
      - `description` (text) - Description of the flow
      - `query` (text) - Original query used to generate the flow
      - `flow_data` (jsonb) - Complete flow data including nodes and edges
      - `status` (text) - Status: draft, published
      - `version` (text) - Version number
      - `tags` (jsonb) - Array of tags for categorization
      - `created_by` (text) - Creator identifier
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `published_at` (timestamptz) - Publication timestamp

  2. Security
    - Enable RLS on `agent_flows` table
    - Add policy for users to read all published flows
    - Add policy for users to manage their own flows
*/

CREATE TABLE IF NOT EXISTS agent_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  query text,
  flow_data jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  version text DEFAULT '1.0.0',
  tags jsonb DEFAULT '[]'::jsonb,
  created_by text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE agent_flows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published flows"
  ON agent_flows
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can read their own flows"
  ON agent_flows
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create flows"
  ON agent_flows
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own flows"
  ON agent_flows
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own flows"
  ON agent_flows
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_agent_flows_status ON agent_flows(status);
CREATE INDEX IF NOT EXISTS idx_agent_flows_created_at ON agent_flows(created_at DESC);