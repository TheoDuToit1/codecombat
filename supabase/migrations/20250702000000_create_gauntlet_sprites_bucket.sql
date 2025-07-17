-- Create a storage bucket for Gauntlet sprites
INSERT INTO storage.buckets (id, name, public)
VALUES ('gauntletsprites', 'gauntletsprites', true)
ON CONFLICT (id) DO NOTHING;

-- Set up public access policy for reading objects
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Public Read Access',
  '{"statement": "SELECT", "resource": "object", "action": "select", "principal": "*"}',
  'gauntletsprites'
)
ON CONFLICT (name, definition, bucket_id) DO NOTHING;

-- Set up authenticated users policy for uploading objects
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Auth Users Upload Access',
  '{"statement": "INSERT", "resource": "object", "action": "insert", "principal": {"type": "authenticated"}}',
  'gauntletsprites'
)
ON CONFLICT (name, definition, bucket_id) DO NOTHING;

-- Set up authenticated users policy for updating objects
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Auth Users Update Access',
  '{"statement": "UPDATE", "resource": "object", "action": "update", "principal": {"type": "authenticated"}}',
  'gauntletsprites'
)
ON CONFLICT (name, definition, bucket_id) DO NOTHING;

-- Set up authenticated users policy for deleting objects
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Auth Users Delete Access',
  '{"statement": "DELETE", "resource": "object", "action": "delete", "principal": {"type": "authenticated"}}',
  'gauntletsprites'
)
ON CONFLICT (name, definition, bucket_id) DO NOTHING; 