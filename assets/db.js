// Initialize Dexie IndexedDB for local persistent memory and stream states
const db = new Dexie('OporcaDatabase');

db.version(1).stores({
  secrets: 'key, value',
  recall_boxes: '++id, box_name, content, embedding, timestamp',
  streams: 'stream_id, name, status, current_step, logs',
  history: '++id, model_id, prompt, response, timestamp'
});

// Helper function to save API secrets
async function setSecret(key, value) {
  await db.secrets.put({ key, value });
}

// Helper function to get API secrets
async function getSecret(key) {
  const record = await db.secrets.get(key);
  return record ? record.value : null;
}
