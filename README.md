<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# PharmaGuard - Pharmacogenomic Risk Prediction System

## 🚀 Project Overview

PharmaGuard is an AI-powered comprehensive pharmacogenomic analysis tool designed to prevent adverse drug reactions. By analyzing patient genetic data (VCF files), it predicts risks for 6 critical genes and providing clinically actionable recommendations with LLM-generated explanations.

Submitted for **RIFT 2026 Hackathon** within the **Pharmacogenomics / Explainable AI Track**.

## 🔗 Live Demo & Video

- **Live Application**: [https://pharmaguard-demo.vercel.app](https://pharmaguard-demo.vercel.app) _(Placeholder)_
- **Demo Video**: [LinkedIn Video Link](https://linkedin.com) _(Placeholder)_

## 🏗️ Architecture

PharmaGuard is built as a modern full-stack web application:

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS for a premium, responsive UI.
- **Theme Support**: Built-in Dark/Light mode with system preference detection.
- **Localization**: Multi-language support (English, Spanish, Hindi).
- **Backend**: Next.js API Routes for server-side VCF parsing and risk analysis.
- **Logic Layer**:
  - **VCF Parser**: Custom TypeScript implementation to extract variants from standard VCF v4.2 files.
  - **Risk Engine**: Deterministic rule-based engine mapping Genotype -> Phenotype -> Clinical Risk based on CPIC guidelines.
  - **Knowledge Base**: Curated rules for genes CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD.
  - **AI Layer**: Integration with LLM (stubbed for submission safety) to generate human-readable clinical explanations.

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Linting**: ESLint

## 💻 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/chessman2345788/pharmaguard.git
   cd pharmaguard
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 📡 API Documentation

### `POST /api/analyze`

Analyzes a VCF file against a list of drugs.

**Request:**

- `Content-Type`: `multipart/form-data`
- `file`: The VCF file (`.vcf`).
- `drugs`: Comma-separated string of drug names (e.g., "Warfarin, Codeine").

**Response (JSON):**

```json
{
  "patient_id": "PATIENT_DEMO",
  "results": [
    {
      "drug": "Codeine",
      "gene": "CYP2D6",
      "phenotype": "PM",
      "risk": "Ineffective",
      "recommendation": "Avoid codeine due to lack of efficacy...",
      "severity": "moderate",
      "llm_explanation": { ... }
    }
  ]
}
```

## 🧪 Usage Examples

1. Upload the provided `sample_test.vcf` (located in `public/` folder).
2. Enter drug names: `Warfarin, Codeine, Clopidogrel`.
3. Click "Analyze Risk Profile".
4. View the color-coded risk cards and AI explanations.
5. Download the detailed JSON report.

## 👥 Team Members — Fusion X

| Name              | Role                       |
| ----------------- | -------------------------- |
| Satyam Srivastava | Lead Developer             |
| Harsh Mishra      | Backend & AI Integration   |
| Keshav Pandey     | Frontend & UI/UX           |
| Siddhant Soni     | Data Engineering & Testing |

---

_Built with ❤️ for RIFT 2026_
>>>>>>> 500bb36e9daa8dea6b5101f080debd160c26d6b1
