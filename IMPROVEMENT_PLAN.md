# Bank Statement Converter - Open Source Improvement Plan

## Project Overview
An intelligent web tool that uses AI (Google Gemini) to extract, analyze, and organize data from bank statement PDFs into clean Excel format. Built with React, Vite, and TailwindCSS.

## Current Status ✅
- Security: API key exposure fixed
- TypeScript: All errors resolved
- Build: Successful
- Documentation: .env.example created
- Gitignore: Added

---

## 🎯 Priority 1: Make Truly Open Source

### 1.1 Add Open Source License
Create a LICENSE file to declare usage rights:
```text
MIT License

Copyright (c) 2026 Bank Statement Converter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:
```

### 1.2 Add README.md with Setup Instructions
- Project overview
- Prerequisites (Node.js, Gemini API key)
- Installation steps (`npm install`, `.env` setup)
- How to run development (`npm run dev`)
- Build command (`npm run build`)
- Preview command (`npm run preview`)

### 1.3 Update package.json Metadata
- Remove `"private": true` (already done)
- Add `license` field
- Add `repository` field
- Add `bugs` and `homepage` fields

### 1.4 Add Contributing Guide
- Development setup
- Code style guidelines
- How to submit PRs
- Category customization guidelines

---

## 🤖 Priority 2: AI/Gemini Integration Improvements

### 2.1 Make Categories Configurable
- Move category rules to a JSON config file
- Allow users to override/add categories via UI
- Add category management page

### 2.2 Support Multiple Currencies/Regions
- Detect currency from statement
- Make currency format configurable
- Support regional date formats

### 2.3 Add Fallback Offline Processing
- Basic regex-based extraction as fallback
- When API fails, show partial results
- Cache previously processed statements

### 2.4 Improve Prompt Robustness
- Add more validation rules
- Handle edge cases better
- Support multiple bank formats

---

## 📊 Priority 3: User Experience & Features

### 3.1 Enhanced Filtering
- Add "Clear all filters" button
- Add preset filter dates (this month, last month, etc.)
- Add search highlight matching

### 3.2 Transaction Editing
- Inline category editing
- Bulk category updates
- Amount correction

### 3.3 Export Options
- CSV export in addition to Excel
- Filtered export (export visible rows only)
- Custom column selection

### 3.4 UI/UX Improvements
- Dark mode support
- Responsive design for mobile
- Loading states and skeletons
- Toast notifications for actions

---

## 🛠️ Priority 4: Developer Experience

### 4.1 Type Safety
- Complete TypeScript types for all props
- Add prop validation
- Type guards for API responses

### 4.2 Testing
- Unit tests for utils (formatCurrency, filtering)
- Integration tests for key flows
- Mock Gemini API responses

### 4.3 Code Quality
- ESLint configuration
- Prettier formatting
- Component documentation (JSDoc)

### 4.4 CI/CD Setup
- GitHub Actions workflow
- Automated testing
- Build verification

---

## 📦 Priority 5: Distribution & Adoption

### 5.1 npm Package Publication
- Publish to npm with scoped name
- Version management
- Release tags

### 5.2 Docker Support
- Dockerfile for easy deployment
- Docker Compose for development

### 5.3 Static Site Export
- Add `base` configuration for GitHub Pages
- Deploy-to-Vercel/Netlify readiness

### 5.4 Template Documentation
- Example .env file (already created)
- Category configuration examples
- API key setup guide

---

## 📋 Immediate Action Items

| Task | Priority | Effort | Impact |
|------|----------|--------|--------|
| Add MIT license file | High | 10 min | Critical |
| Create README.md | High | 30 min | Critical |
| Make categories configurable via UI | High | 2-3 hrs | High |
| Add currency detection/configuration | Medium | 2-3 hrs | High |
| Add CSV export | Medium | 1-2 hrs | Medium |
| Add unit tests | Medium | 3-4 hrs | Medium |
| Publish to npm | Low | 1 hr | High |
| Docker support | Low | 1-2 hrs | Medium |

---

## 🚀 Getting Started for New Contributors

1. **Fork the repository**
2. **Install dependencies**: `npm install`
3. **Create .env file**: Copy `.env.example` and add your Gemini API key
4. **Run development server**: `npm run dev`
5. **Start contributing**: Follow the contributing guide

---

## 💡 Key Design Decisions for Open Source

1. **API Key Management**: Users provide their own Gemini API key - no backend needed
2. **Categories are Configurable**: Not hardcoded to Nigerian banking - users adapt for their region
3. **No Vendor Lock-in**: Uses standard React + Vite - easy to swap AI providers
4. **Client-Side Only**: All processing happens in browser - no server costs for contributors
5. **MIT License**: Permissive - can be used in commercial projects

---

## 📝 License Considerations

Since this uses Google's Gemini AI, users will need their own API key. The application code itself can be MIT-licensed, but users must:
- Have their own Gemini API key
- Comply with Google's AI usage policies
- Understand that AI accuracy varies by statement format