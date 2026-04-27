# Ngembal

A modern thread-like social web application built for portfolio showcase and programming fun. Ngembal is a full-stack application inspired by platforms like Twitter/X, featuring thread creation, interactions, and user profiles.

## 🎯 Project Overview

Ngembal is a Next.js-based social platform where users can:
- Create and edit threads (posts)
- View threads from other users
- Like and comment on threads
- Manage user profiles with image uploads
- Browse public user profiles with their thread history

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Custom component library (shadcn/ui style)
- **Icons**: Lucide React & React Icons

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better-Auth
- **Image Upload**: Cloudinary
- **Cache**: Next.js built-in revalidation

### Development & Code Quality
- **Package Manager**: pnpm with workspaces
- **Linter**: Biome
- **Code Formatter**: Biome
- **Type Checking**: TypeScript

## 📁 Project Structure

```
ngembal/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (auth)
│   ├── auth/              # Authentication pages (login, register)
│   ├── profile/           # User profiles (public and personal)
│   ├── thread/            # Thread management (create, edit)
│   └── page.tsx           # Home page with thread feed
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── thread-card.tsx    # Thread display component
│   └── theme-provider.tsx # Theme management
├── database/              # Database configuration
│   ├── schema.ts          # Drizzle ORM schema
│   └── index.ts           # Database initialization
├── lib/                   # Utility functions and helpers
│   ├── actions/           # Server actions
│   ├── auth.ts            # Auth configuration
│   ├── cloudinary.ts      # Image upload service
│   └── validations.ts     # Zod schemas
├── public/                # Static assets
├── drizzle/               # Database migrations
└── biome.json             # Biome configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (package manager)
- PostgreSQL database
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd amproj
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ngembal

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Better-Auth
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
```

4. **Run database migrations**
```bash
pnpm run db:migrate
```

5. **Start development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📝 Available Scripts

```bash
# Development
pnpm dev           # Start development server

# Code Quality
pnpm lint          # Run Biome linter
pnpm lint --fix    # Fix linting issues automatically
pnpm format        # Format code with Biome

# Database
pnpm db:generate   # Generate Drizzle migrations
pnpm db:migrate    # Run migrations
pnpm db:studio     # Open Drizzle Studio

# Build
pnpm build         # Production build
pnpm start         # Start production server
```

## ✨ Features

### Thread Management
- Create new threads with text content
- Edit existing threads (author only)
- Delete threads (author only)
- View thread details with author info and timestamps

### Interactions
- Like threads (toggle like status)
- Comment on threads with nested support
- View like and comment counts

### User Profiles
- Public profile viewing with user info and thread history
- Personal profile management
- Profile image upload via Cloudinary
- User bio and metadata

### Authentication
- User registration and login
- OAuth support (via Better-Auth)
- Session management
- Protected routes and server actions

## 🎨 Components

### UI Components
- Button with multiple variants
- Card for content containers
- Avatar with fallback images
- Input and Textarea fields
- Dropdown menus
- Accordion for collapsible content
- Alerts and dialogs
- Form field components with error handling
- Separator dividers
- Spinner loading indicator

## 🔒 Authentication & Authorization

The application uses **Better-Auth** for authentication with:
- Email/password registration and login
- OAuth provider support
- Secure session management
- Protected API routes and server actions
- User role management

## 🗄️ Database Schema

The application includes:
- **Users**: User accounts and profiles
- **Threads**: Thread posts with content and metadata
- **Comments**: Replies to threads
- **Likes**: Thread and comment likes
- **Accounts**: OAuth account linking

## 🚢 Deployment

The application can be deployed to:
- **Vercel** (recommended for Next.js)
- **AWS Amplify**
- **Docker containers**
- **Self-hosted Node.js servers**

Ensure environment variables are configured on your hosting platform.

## 📚 Development Notes

- All imports are organized and sorted by Biome
- Code follows accessibility best practices (a11y)
- Type-safe database queries with Drizzle ORM
- Client-side validation with Zod schemas
- Server actions for mutations and side effects
- NextJS 15+ features including async params

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📄 License

This project is open source and available for educational and portfolio purposes.

## 🎓 Learning Purpose

This project was created as a portfolio showcase to demonstrate:
- Full-stack Next.js development
- TypeScript best practices
- Database design and ORM usage
- Authentication implementation
- UI/UX component development
- Modern web development workflows

---

**Enjoy building with Ngembal! 🚀**

