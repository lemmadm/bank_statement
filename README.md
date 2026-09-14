# Bank Statement Converter

Transform your PDF bank statements into organized Excel data in seconds using AI.

![Bank Statement Converter](https://logo.clearbit.com/lemmaiot.com.ng)

## � company

**Developed by LemmaIot Cloud Solution Ltd.**  
Website: [https://lemmaiot.com.ng](https://lemmaiot.com.ng)

LemmaIot Cloud Solution Ltd. specializes in innovative technology solutions for financial data processing and automation.

---

## ✨ Features

### AI-Powered Extraction
- Uses Google Gemini AI to extract transaction data from PDF bank statements
- Intelligent categorization based on transaction descriptions and amounts
- Handles various bank statement formats and formatting imperfections

### Data Organization
- **Transaction Table**: View all extracted transactions with date, description, category, and amounts
- **Smart Filtering**: Filter by date range, description text, category, and amount ranges
- **Sorting**: Sort transactions by any column (date, description, category, debit, credit, balance)

### Category Management
- Default categories: Bank Charges, Claims, Stamp Duty, IHMS, Capitation, Other
- Add custom categories that persist in localStorage
- Edit categories per transaction
- Configurable categorization rules for different regions/banks

### Excel Export
- Export filtered/sorted transactions to Excel (.xlsx) format
- One-click export from the transaction table
- Preserves all data including categories and amounts

### User Experience
- **Drag & Drop** or click to upload PDF files
- **Loading spinner** during AI processing
- **Error handling** with user-friendly messages
- **Responsive design** works on mobile and desktop
- **Accessible** with ARIA labels and keyboard navigation

### Data Persistence
- Custom categories saved to browser localStorage
- Categories persist across sessions
- AI-discovered categories added automatically to your inventory

---

## 🛠️ Technical Details

### Built With
- **React 19** - UI library
- **Vite 6** - Build tool and dev server
- **TailwindCSS** - Styling
- **@google/genai** - Google Gemini AI integration
- **SheetJS** - Excel file generation

### Architecture
- **Client-side only** - All processing happens in the browser
- **No backend required** - Users provide their own Gemini API key
- **Environment variables** - API key stored in `.env` file (not committed to repo)

### API Key Setup
1. Get your free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Copy `.env.example` to `.env`
3. Add your: `GEMINI_API_KEY=your_key_here`
4. Run `npm run dev` to start

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/bank-statement-converter.git

# Install dependencies
cd bank-statement-converter
npm install

# Set up environment variables
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🚀 How It Works

1. **Upload**: Select or drag & drop a PDF bank statement
2. **AI Analysis**: Gemini extracts transactions, dates, amounts, and categories
3. **Review**: Browse extracted data in the interactive table
4. **Filter**: Use sidebar filters to find specific transactions
5. **Edit**: Change categories or amounts if needed
6. **Export**: Click "Export to Excel" to download .xlsx file

---

## 📋 Default Categorization Rules

The AI automatically categorizes transactions:

- **Bank Charges**: Small debits (typically under 50 units)
- **Claims**: Transactions related to health insurance/claims
- **Stamp Duty**: Government tax/fee transactions (often 50 units)
- **IHMS**: International Health Management Services credits
- **Capitation**: Other credit transactions
- **Other**: Default category for unmatched transactions

*Categories are fully configurable - adjust based on your bank and region.*

---

## 🔧 Customization

### Adding New Categories
1. Go to the "Category" filter dropdown
2. Select "＋ Add New..." 
3. Enter your custom category name
4. It will be saved to localStorage for future use

### Configuring Categorization Rules
Edit the AI prompt in `services/geminiService.ts` to match your bank's format and regional conventions.

### Changing Currency
The `formatCurrency` function accepts any ISO currency code (defaults to NGN).

---

## 📱 Responsive Design

- **Mobile**: Full functionality, optimized touch targets
- **Tablet**: Adaptive layout with readable tables
- **Desktop**: Full feature set with keyboard shortcuts

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

- **Company**: LemmaIot Cloud Solution Ltd.
- **Website**: [https://lemmaiot.com.ng](https://lemmaiot.com.ng)
- **Project**: Bank Statement Converter

Built with ❤️ for financial data accessibility.