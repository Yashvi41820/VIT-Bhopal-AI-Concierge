# VIT-Bhopal-AI-Concierge 🎓🤖

An intelligent, dual-mode (Chat + Voice) assistant designed to navigate the academic and cultural landscape of **VIT Bhopal University**. This agent serves as the first point of contact for students, parents, and visitors, providing real-time data about the "Future Ready" campus.

---

## 🚀 Project Overview

The **VIT-Bhopal-AI-Concierge** is a web-integrated solution that lives in the bottom-right corner of the university portal. It leverages a **RAG (Retrieval-Augmented Generation)** framework to ensure that every answer—from fee structures to placement stats—is pulled directly from official university data.

---

## ✨ Key Features

### 1. Dual-Interface Interaction
* **Minimized Chat Bubble:** A sleek, non-intrusive UI element that stays docked in the bottom-right corner.
* **Seamless Voice Mode:** Users can toggle from typing to talking with a single click, utilizing high-fidelity AI voice synthesis for a natural conversation.

### 2. Comprehensive Knowledge Domains
The agent is pre-trained and indexed to handle queries across these specific areas:
* **Academic Excellence:** Details on B.Tech specialized branches (AI, Cyber Security, etc.) and the **FFCS (Fully Flexible Credit System)**.
* **Admissions & Finance:** Real-time updates on fee structures, scholarships, and batch commencement dates.
* **Placement & Training:** Statistics on the highest and average packages, top recruiters, and PAT (Placement Administration Team) protocols.
* **Campus Life:** Insights into the "Lab-in-Classroom" concept, the "Lion’s Den" hostel culture, and 24/7 library access.
* **Events & Clubs:** Information on **AdVITya** (Technical Fest), cultural events, and student-run clubs.

### 3. "Future Ready" Personality
* **Tone:** Professional, encouraging, and tech-savvy.
* **Language Support:** Optimized for English, with the ability to understand regional nuances typical of a diverse Indian campus.

### 4. Technical Edge
* **Direct Link Integration:** The bot doesn't just talk; it provides direct hyperlinks to the relevant sections of the [official website](https://vitbhopal.ac.in/).
* **No-Hallucination Policy:** If data isn't found in the official records, the bot is programmed to redirect users to the Registrar or specific department contacts.

---

## Dummy Project URL
https://ais-dev-flutdlxxg57zurvz5nottk-17442443725.asia-southeast1.run.app/

---

## Website Images
### AI Chat bot
<img width="1614" height="691" alt="image" src="https://github.com/user-attachments/assets/f56e5f1d-59eb-4890-a621-a674153b3355" />
<img width="1617" height="694" alt="image" src="https://github.com/user-attachments/assets/c2e6b09e-aa61-43f7-932c-4f15f29ca19c" />

### AI Voice bot
<img width="1614" height="689" alt="image" src="https://github.com/user-attachments/assets/4c8988f8-0534-4a99-8a06-dbe122d05bf4" />

---

## 🛠️ Tech Stack

| Component      | Technology                           |
| :------------- | :----------------------------------- |
| **Frontend** | React.js / Tailwind CSS              |
| **AI Logic** | LLM (e.g., GPT-4o / Gemini 1.5 Pro)  |
| **Voice Engine**| Web Speech API / ElevenLabs         |
| **Database** | Vector DB (Pinecone/Chroma)          |
| **Backend** | Node.js or Python (FastAPI/Flask)    |

---

## 📂 Project Structure

```text
VIT-Bhopal-AI-Concierge/
├── assets/             # Images, university logos, and icons
├── components/         # ChatWindow, VoiceToggle, FloatingButton
├── data/               # Scraped text and PDF transcripts from vitbhopal.ac.in
├── styles/             # CSS for the bottom-right positioning
├── system_prompt.md    # The core logic and personality instructions
└── README.md           # Project documentation
