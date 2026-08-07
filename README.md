# OP-orca

**OP-orca** is an open-source, modular AI orchestration environment built for low-overhead local and cloud execution. It provides a sleek, minimalist dashboard interface that connects swappable open-source inference backends, local vector memory, and multi-agent coordination pipelines—out of the box and at zero token cost.

---

## Key Features

- **Zero-Cost Baseline:** Runs 100% free locally using Ollama or via free cloud API keys (OpenRouter Free Tier, Hugging Face Serverless APIs).
- **Hugging Face–Style Model Mechanic:** Easily select models based on target performance metrics: **Speed**, **Rating**, **Cost ($0)**, or **Depth** (Reasoning/Chain-of-Thought).
- **Secret Store Onboarding:** Encrypted local configuration keeps API keys secure on your machine—no telemetry, no external lock-in.
- **batch~string Execution Topologies:**
  - **Recall Boxes:** Persistent vector memory (ChromaDB/LanceDB) for deep search and RAG retrieval.
  - **Offices:** Specialized persona environments with dedicated toolsets and system context.
  - **Teams:** Sequential multi-model review chains (e.g., Draft -> Critique -> Format).
  - **Agentic Swarms:** Asynchronous parallel agents for complex problem decomposition.
- **Project Workflows [streams]:** Stateful, recursive project harnesses that automate multi-step execution loops:
  Search -> Build -> Evaluate -> Repeat

---

## Architecture Overview

+------------------------------------------------------------------------+
|                              OP-orca UI                                |
|                     (Minimalist Web Dashboard)                         |
+----------------------------------+-------------------------------------+
                                   |
                                   v
+------------------------------------------------------------------------+
|                          LiteLLM Proxy Router                          |
|               [ Speed | Rating | Cost ($0) | Depth ]                   |
+--------------+-----------------------------------------+---------------+
               |                                         |
               v                                         v
+-------------------------------+       +--------------------------------+
|      Ollama Engine            |       |      Cloud API Gateway         |
|  (Local GPU/CPU Inference)    |       | (OpenRouter / Hugging Face)    |
+-------------------------------+       +--------------------------------+
               |                                         |
               +-------------------+---------------------+
                                   |
                                   v
+------------------------------------------------------------------------+
|                        batch~string & [streams]                        |
|     [ Recall Boxes | Offices | Teams | Swarms | Search-Build Loop ]    |
+------------------------------------------------------------------------+

---

## Directory Structure

OP-orca/
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

---

## Quickstart Guide

### Prerequisites

- Docker Desktop installed and running.
- (Optional) Ollama installed locally if running models outside of Docker.

### 1. Clone the Repository

git clone https://github.com/your-username/OP-orca.git
cd OP-orca

### 2. Configure Your Secret Store

Copy the example environment file:

cp .env.example .env

*Note: You do NOT need to add any paid API keys to use OP-orca. By default, it operates completely free using local Ollama models.*

### 3. Launch the Stack

Run the single-command deployment:

docker compose up -d

### 4. Access the Dashboard

Open your browser and navigate to:
http://localhost:3000

---

## Configuration & Model Selection

Model choices can be customized in config/litellm-config.yaml. Default routing profiles include:

| Profile Alias | Target Utility | Default Provider |
| :--- | :--- | :--- |
| op-orca/free-fast | High speed, standard chat | Ollama (qwen2.5) |
| op-orca/free-depth | Deep reasoning & research | Ollama (deepseek-r1) |
| op-orca/cloud-free | Zero-cost cloud inference | OpenRouter (llama-3.1-8b:free) |
| op-orca/top-rating | High ELO / Complex tasks | Anthropic (claude-3-5-sonnet) *(Requires key)* |

---

## Defining a Project Stream ([streams])

Create recursive automation flows inside the streams/ directory using YAML:

stream_id: "market-research-analysis"
model_preference: "op-orca/free-depth"
loop_limit: 3
workflow:
  - step: search
    source: "recall_box('local-docs') + web_search"
  - step: build
    harness: "team('analyst', 'writer')"
  - step: evaluate
    criterion: "Verify factual consistency and structure as Markdown report"

---

## Contributing

OP-orca is open for public collaboration. Contributions toward minimalist UI improvements, routing configurations, and custom batch~string swarm presets are always welcome via Pull Requests.

---

## License

Distributed under the MIT License. See LICENSE for more information.
