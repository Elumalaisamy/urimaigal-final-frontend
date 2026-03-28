# ⚖ Urimaigal — Justice Unified

> A legal services platform connecting citizens with verified advocates through AI-powered guidance.
> Built as part of **Live In Lab III** · Sri Sairam Engineering College

---

## 📋 Project Overview

**Urimaigal** (Tamil: உரிமைகள், meaning *Rights*) is a full-stack legal services application that bridges the gap between citizens needing legal help and advocates looking to grow their practice.

### Problem Statement
- Citizens face difficulty finding the right lawyer, understanding costs, or knowing if they need legal help
- Advocates struggle to find clients and rely on outdated networking methods
- Legal assistance is intimidating, opaque, and often unaffordable

### Solution
An AI-powered platform providing:
- Instant legal guidance via chatbot
- Verified advocate profiles with ratings & specializations
- Easy consultation booking (chat or video)
- Transparent, affordable pricing

### SDG Alignment
| Goal | Description |
|------|------------|
| **SDG 16** | Peace, Justice & Strong Institutions — equal access to justice |
| **SDG 8**  | Decent Work & Economic Growth — opportunities for advocates |
| **SDG 4**  | Quality Education — legal awareness for all |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | **Vue 3** (Composition API) |
| Language | **TypeScript** |
| Build Tool | **Vite 5** |
| State Management | **Pinia** |
| Routing | **Vue Router 4** |
| Styling | Custom CSS (CSS Variables design system) |
| Utilities | **@vueuse/core** |
| Icons | **lucide-vue-next** |

---

## 📁 Project Structure

```
urimaigal/
├── public/
│   └── favicon.svg
├── src/
│   ├── types/
│   │   └── index.ts          # All TypeScript interfaces & types
│   ├── stores/               # Pinia stores
│   │   ├── auth.ts           # Authentication state & actions
│   │   ├── lawyers.ts        # Lawyers list, filtering, selection
│   │   ├── chat.ts           # AI chatbot messages & state
│   │   └── booking.ts        # Consultation booking state
│   ├── router/
│   │   └── index.ts          # Vue Router with auth guards
│   ├── components/
│   │   ├── AppNav.vue         # Sticky navigation bar
│   │   ├── ChatWidget.vue     # Floating AI chatbot
│   │   └── LawyerCard.vue     # Lawyer listing card
│   ├── views/
│   │   ├── HomeView.vue       # Landing page
│   │   ├── AuthView.vue       # Login / Register
│   │   ├── LawyersView.vue    # Browse & filter advocates
│   │   ├── LawyerDetailView.vue # Profile + booking
│   │   └── DashboardView.vue  # User dashboard
│   ├── styles/
│   │   └── global.css         # Design system & global styles
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── package.json
```

---

## 🏪 Pinia Stores

### `useAuthStore` (`stores/auth.ts`)
Handles authentication state for the entire app.

```ts
// State
user: User | null
isLoading: boolean
error: string | null

// Getters
isAuthenticated: boolean  // computed
userName: string          // computed

// Actions
login(email, password): Promise<boolean>
register(name, email, password): Promise<boolean>
logout(): void
clearError(): void
```

### `useLawyersStore` (`stores/lawyers.ts`)
Manages the lawyers list, search, and filters.

```ts
// State
lawyers: Lawyer[]
selectedLawyer: Lawyer | null
searchQuery: string
filters: FilterOptions

// Getters
filteredLawyers: Lawyer[]   // computed — reactive filtering
categories: LegalCategory[] // computed

// Actions
setSearchQuery(q: string): void
setFilter(key, value): void
selectLawyer(lawyer): void
getLawyerById(id): Lawyer | undefined
resetFilters(): void
```

### `useChatStore` (`stores/chat.ts`)
AI chatbot state and message management.

```ts
// State
messages: ChatMessage[]
isTyping: boolean
isOpen: boolean

// Getters
messageCount: number  // computed

// Actions
sendMessage(content: string): Promise<void>
toggleChat(): void
clearChat(): void
```

### `useBookingStore` (`stores/booking.ts`)
Consultation booking and tracking.

```ts
// State
bookings: Consultation[]
isLoading: boolean
successMessage: string | null

// Actions
bookConsultation(lawyerId, lawyerName, date, time, mode, fee): Promise<boolean>
cancelBooking(id: string): void
clearSuccess(): void
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9+ or **pnpm** v8+

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/urimaigal.git
cd urimaigal
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### 4. Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### 5. Preview Production Build

```bash
npm run preview
```

### 6. Type Checking

```bash
npm run type-check
```

---

## 📱 Pages & Routes

| Route | View | Auth Required |
|-------|------|--------------|
| `/` | `HomeView` | No |
| `/auth` | `AuthView` | Guest only (redirects if logged in) |
| `/lawyers` | `LawyersView` | No |
| `/lawyers/:id` | `LawyerDetailView` | No (booking requires auth) |
| `/dashboard` | `DashboardView` | ✅ Yes |

### Route Guards
Implemented in `router/index.ts`:
- `requiresAuth: true` → redirects unauthenticated users to `/auth`
- `guestOnly: true` → redirects authenticated users to `/dashboard`

---

## 🎨 Design System

The project uses a custom CSS design system defined in `src/styles/global.css`.

### Color Palette

```css
--ink:       #0d0f14   /* Primary dark background */
--ink-80:    #1a1d26   /* Card backgrounds */
--ink-60:    #252934   /* Input backgrounds */
--parchment: #f5f0e8   /* Primary text */
--gold:      #c9922a   /* Primary accent */
--gold-light:#e6b84a   /* Gradient end */
--mist:      #8b96a8   /* Secondary text */
--sage:      #4a7c6f   /* Available indicator */
--scarlet:   #c0392b   /* Error/danger */
```

### Typography

```css
--font-display: 'Playfair Display', Georgia, serif  /* Headings */
--font-body:    'DM Sans', system-ui, sans-serif    /* Body text */
```

### Global Utility Classes

| Class | Purpose |
|-------|---------|
| `.btn-primary` | Gold gradient CTA button |
| `.btn-ghost` | Outlined secondary button |
| `.card` | Dark card with hover effect |
| `.tag` | Pill-shaped label |
| `.container` | Max-width centered wrapper |
| `.fade-up` | Entry animation |

---

## 🧩 Key Components

### `AppNav.vue`
- Sticky navigation with scroll-aware background blur
- Authenticated/guest state-aware links
- Mobile hamburger menu with slide animation

### `ChatWidget.vue`
- Floating action button (FAB)
- Slide-up chat panel with auto-scroll
- Keyword-based response routing (property, criminal, family, employment, traffic)
- Suggestion chips for quick queries
- Typing indicator animation

### `LawyerCard.vue`
- Avatar with availability indicator
- Badge display (Top Rated, Rising Star, Pro Bono)
- Rating, experience, fee summary
- Hover lift animation

---

## 🔮 Connecting a Real Backend

Replace the mock data and setTimeout simulations in the stores with real API calls:

### Auth Store
```ts
// Replace mock in login()
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
const data = await response.json()
user.value = data.user
```

### Lawyers Store
```ts
// Replace MOCK_LAWYERS with API fetch
const response = await fetch('/api/lawyers')
lawyers.value = await response.json()
```

### Recommended Backend Stack (as per project spec)
- **Node.js + Express** or **Django** — REST API
- **MySQL / MongoDB / Firebase** — Database
- **DialogFlow / Rasa** — AI Chatbot NLP
- **PayPal / Stripe / Razorpay** — Payment gateway

---

## 🗺 Roadmap (Future Steps)

As documented in the project presentation:

- [ ] GST & Business Registration Service
- [ ] Trademark Registration integration
- [ ] AI Chatbot with full NLP (Dialogflow)
- [ ] SME & Startup Legal Packages
- [ ] Educational Resources for Businesses
- [ ] Business Compliance Tracker
- [ ] Automation of Legal Document Generation
- [ ] Legal Advisory & Consultation Services
- [ ] Expansion into Corporate Legal Services
- [ ] Real payment gateway (Razorpay)
- [ ] Video consultation (WebRTC)
- [ ] Push notifications
- [ ] Multi-language UI (Tamil, English, Hindi)

---

## 👥 Team

| Name | Roll Number |
|------|------------|
| Elumalaisamy C | 412522205031 |
| Arunkumar A | 412522205010 |
| Saravanan M | 412522205126 |

**College:** Sri Sairam Engineering College  
**Guide:** Ramya B  
**Program:** Live In Lab III

---

## 📚 References

1. Thomson Reuters Institute — *AI for Legal Aid: How to Empower Clients in Need*
2. Harvard Journal of Law & Technology — *Legal Chatbots: Innovations and Limitations in Legal Service Automation*
3. Cummings, R. (2021) — *Artificial Intelligence in Law: The State of the Art*. Journal of Legal Technology, 17(3)
4. McKinsey & Company (2020) — *The Future of Legal Services*
5. Ministry of Corporate Affairs, Government of India — *Business Registration in India*

---

## 📄 License

This project is built for academic purposes under Live In Lab III, Sri Sairam Engineering College.

---

*"Justice should be accessible to all — not just those who can afford it."*
