OP-orcaOP-orca is an open-source, modular AI orchestration environment built for low-overhead local and cloud execution. It provides a sleek, minimalist dashboard interface that connects swappable open-source inference backends, local vector memory, and multi-agent coordination pipelines—out of the box and at zero token cost.Key FeaturesZero-Cost Baseline: Runs 100% free locally using Ollama or via free cloud API keys (OpenRouter Free Tier, Hugging Face Serverless APIs).Hugging Face–Style Model Mechanic: Easily select models based on target performance metrics: Speed, Rating, Cost ($0), or Depth (Reasoning/Chain-of-Thought).Secret Store Onboarding: Encrypted local configuration keeps API keys secure on your machine—no telemetry, no external lock-in.batch~string Execution Topologies:Recall Boxes: Persistent vector memory (ChromaDB/LanceDB) for deep search and RAG retrieval.Offices: Specialized persona environments with dedicated toolsets and system context.Teams: Sequential multi-model review chains (e.g., Draft $\rightarrow$ Critique $\rightarrow$ Format).Agentic Swarms: Asynchronous parallel agents for complex problem decomposition.Project Workflows [streams]: Stateful, recursive project harnesses that automate multi-step execution loops:$$\text{Search} \longrightarrow \text{Build} \longrightarrow \text{Evaluate} \longrightarrow \text{Repeat}$$Architecture OverviewPlaintext┌────────────────────────────────────────────────────────────────────────┐
│                              OP-orca UI                                │
│                     (Minimalist Web Dashboard)                         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          LiteLLM Proxy Router                          │
│               [ Speed | Rating | Cost ($0) | Depth ]                   │
└──────────────┬─────────────────────────────────────────┬───────────────┘
               │                                         │
               ▼                                         ▼
┌───────────────────────────────┐       ┌────────────────────────────────┐
│      Ollama Engine            │       │      Cloud API Gateway         │
│  (Local GPU/CPU Inference)    │       │ (OpenRouter / Hugging Face)    │
└───────────────────────────────┘       └────────────────────────────────┘
               │                                         │
               └───────────────────┬─────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        `batch~string` & `[streams]`                    │
│     [ Recall Boxes | Offices | Teams | Swarms | Search-Build Loop ]    │
└────────────────────────────────────────────────────────────────────────┘
Directory StructurePlaintextOP-orca/
├── docker-compose.yml        # Master container orchestrator
├── .env.example              # Local secret store template
├── README.md                 # Project documentation
├── config/
│   ├── litellm-config.yaml   # Router configuration & tier mappings
│   └── models.json           # Catalog of local & cloud engines
├── streams/
│   ├── templates/            # Preset [stream] loop harnesses
│   │   └── research_build.yaml
│   └── active/               # Active project state storage
└── memory/
    └── recall_boxes/         # Local vector database storage
Quickstart GuidePrerequisitesDocker Desktop installed and running.(Optional) Ollama installed locally if running models outside of Docker.1. Clone the RepositoryBashgit clone https://github.com/your-username/OP-orca.git
cd OP-orca
2. Configure Your Secret StoreCopy the example environment file:Bashcp .env.example .env
Note: You do not need to add any paid API keys to use OP-orca. By default, it operates completely free using local Ollama models.3. Launch the StackRun the single-command deployment:Bashdocker compose up -d
4. Access the DashboardOpen your browser and navigate to:Plaintexthttp://localhost:3000
Configuration & Model SelectionModel choices can be customized in config/litellm-config.yaml. Default routing profiles include:Profile AliasTarget UtilityDefault Providerop-orca/free-fastHigh speed, standard chatOllama (qwen2.5)op-orca/free-depthDeep reasoning & researchOllama (deepseek-r1)op-orca/cloud-freeZero-cost cloud inferenceOpenRouter (llama-3.1-8b:free)op-orca/top-ratingHigh ELO / Complex tasksAnthropic (claude-3-5-sonnet) (Requires key)Defining a Project Stream ([streams])Create recursive automation flows inside the streams/ directory using YAML:YAMLstream_id: "market-research-analysis"
model_preference: "op-orca/free-depth"
loop_limit: 3
workflow:
  - step: search
    source: "recall_box('local-docs') + web_search"
  - step: build
    harness: "team('analyst', 'writer')"
  - step: evaluate
    criterion: "Verify factual consistency and structure as Markdown report"
ContributingOP-orca is open for public collaboration. Contributions toward minimalist UI improvements, routing configurations, and custom batch~string swarm presets are always welcome via Pull Requests.LicenseDistributed under the MIT License. See LICENSE for more information.
