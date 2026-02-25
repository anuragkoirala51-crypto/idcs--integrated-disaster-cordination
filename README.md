# IDCS | Integrated Disaster Coordination System

**IDCS** is a state-of-the-art, high-fidelity disaster response and coordination platform designed for authorities, volunteers, and the public. Built with a premium **Neumorphic Tactical UI**, it leverages AI to streamline emergency dispatch, protocol awareness, and relief camp management.

![Header Image Placeholder](https://github.com/anuragkoirala51-crypto/idcs--integrated-disaster-cordination/raw/main/public/file.svg)

---

## ⚡ Key Features

### 🤖 Intelligent AI Assistant (PyroBot)
- Powered by **Llama 3.3 70B** via Groq.
- **Human-like Interaction**: Optimized for short, conversational, and actionable emergency advice.
- **Multilingual Support**: Supports English, Hindi, and Assamese.
- **Advanced HUD**: Includes speech-to-text and text-to-speech capabilities for hands-free operation in the field.

### 🚁 Tactical Command & Fleet Management
- **Intelligent Dispatch**: Auto-matches volunteers to incidents based on skills (Medical, SAR, Logistics) and real-time geographic proximity.
- **Live Telemetry**: Real-time monitoring of personnel readiness and deployment status.
- **Registry Matrix**: Maintain a database of specialized responders and their mission history.

### 🛡️ Survival Protocols & Academy
- Integrated official **NDRF/NDMA** disaster awareness materials.
- Specialized instructions for Tsunami, Earthquake, Floods, and First Aid.
- Training Hub for volunteers with official PDFs and precis.

### 🎨 Premium Design System
- **Advanced Neumorphism**: A soft-extruded, tactile aesthetic designed for high-stress environments.
- **Theme Support**: Instant Light/Dark mode toggle using global CSS filter logic.
- **Mobile-First Responsive**: Fully functional off-canvas navigation and fluid grids for any device.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Custom Neumorphic Utilities
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **AI/LLM**: [Groq Cloud](https://groq.com/) (Llama-3.3-70b-versatile)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Maps**: [React Leaflet](https://react-leaflet.js.org/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/anuragkoirala51-crypto/idcs--integrated-disaster-cordination.git
cd idcs--integrated-disaster-cordination
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your keys:
```env
# AI Integration
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the system.

---

## 📁 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (Globe, Map, HUD).
- `src/actions`: Server Actions for AI and database operations.
- `src/store`: Global state management with Zustand.
- `src/models`: Data schemas and types.

---

## 📄 License
This prototype is developed for disaster relief coordination and research purposes.

---
*Built for resilience and response.*
