document.addEventListener('alpine:init', () => {
  Alpine.data('orcaApp', () => ({
    models: [],
    selectedModel: null,
    prompt: '',
    response: '',
    loading: false,
    apiKey: '',
    activeTab: 'chat',
    
    async init() {
      // Load model catalog
      const res = await fetch('./config/models.json');
      this.models = await res.json();
      this.selectedModel = this.models[0].id;
      
      // Load stored OpenRouter/HF key if present
      const storedKey = await getSecret('OPENROUTER_API_KEY');
      if (storedKey) this.apiKey = storedKey;
    },

    async saveKey() {
      await setSecret('OPENROUTER_API_KEY', this.apiKey);
      alert('Secret stored securely in local browser datastore.');
    },

    async runPrompt() {
      if (!this.prompt.trim()) return;
      this.loading = true;
      this.response = 'Routing request...';

      const modelConfig = this.models.find(m => m.id === this.selectedModel);

      try {
        if (modelConfig.provider === 'Ollama') {
          // Direct local request to Ollama
          const res = await fetch(modelConfig.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: modelConfig.model_param,
              prompt: this.prompt,
              stream: false
            })
          });
          const data = await res.json();
          this.response = data.response;
        } else if (modelConfig.provider === 'OpenRouter') {
          // Cloud execution using local Secret Store key
          const key = this.apiKey || await getSecret('OPENROUTER_API_KEY');
          if (!key) throw new Error('API Key missing. Enter an API key in the Secret Store.');

          const res = await fetch(modelConfig.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
              model: modelConfig.model_param,
              messages: [{ role: 'user', content: this.prompt }]
            })
          });
          const data = await res.json();
          this.response = data.choices[0].message.content;
        }

        // Save execution to IndexedDB history
        await db.history.add({
          model_id: this.selectedModel,
          prompt: this.prompt,
          response: this.response,
          timestamp: new Date().toISOString()
        });

      } catch (err) {
        this.response = `[OP-orca Error]: ${err.message}. Make sure local provider is active or key is provided.`;
      } finally {
        this.loading = false;
      }
    }
  }));
});
