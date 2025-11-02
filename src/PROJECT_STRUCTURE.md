# WhyAi Project Structure

This document describes the folder structure and organization of the WhyAi platform.

## Folder Structure

```
/
├── components/               # Reusable React components
│   ├── common/              # Shared components used across pages
│   │   ├── Navbar.tsx       # Global navigation bar
│   │   └── Footer.tsx       # Global footer
│   ├── ui/                  # shadcn/ui components
│   └── figma/               # Figma-specific components
│
├── pages/                   # Page-level components
│   ├── landing/             # Landing page components
│   │   ├── index.tsx        # Landing page main component
│   │   ├── Hero.tsx         # Hero section with typing effect
│   │   ├── NewsSection.tsx  # AI news and updates section
│   │   ├── FeaturesSection.tsx # Platform features section
│   │   └── LoginDialog.tsx  # Login/Signup dialog
│   │
│   ├── dashboard/           # User dashboard
│   │   └── index.tsx        # Dashboard page (TODO)
│   │
│   ├── courses/             # Course-related pages
│   │   ├── index.tsx        # Courses listing page (TODO)
│   │   ├── CourseDetail.tsx # Individual course page (TODO)
│   │   └── LearningPath.tsx # AI learning mind map (TODO)
│   │
│   ├── practice/            # Practice platform (LeetCode-style)
│   │   ├── index.tsx        # Problems listing (TODO)
│   │   └── ProblemSolve.tsx # Code editor & problem solving (TODO)
│   │
│   ├── contests/            # Contest platform
│   │   ├── index.tsx        # Contests listing (TODO)
│   │   └── ContestDetail.tsx # Contest details & leaderboard (TODO)
│   │
│   └── profile/             # User profile
│       └── index.tsx        # User profile page (TODO)
│
├── hooks/                   # Custom React hooks
│   └── useDarkMode.ts       # Dark mode state management
│
├── contexts/                # React context providers
│   └── AuthContext.tsx      # Authentication state (TODO: Supabase)
│
├── utils/                   # Utility functions
│   └── api.ts               # API service layer (TODO: Supabase)
│
├── types/                   # TypeScript type definitions
│   └── index.ts             # Shared type definitions
│
├── constants/               # Application constants
│   └── index.ts             # Routes, categories, etc.
│
├── assets/                  # Static assets (images, fonts, etc.)
│
├── styles/                  # Global styles
│   └── globals.css          # Global CSS and Tailwind config
│
└── App.tsx                  # Root application component

```

## Key Features by Page

### Landing Page (`/pages/landing/`)
- ✅ Hero section with animated typing effect
- ✅ Latest AI news and updates section
- ✅ Platform features showcase
- ✅ Login/Signup dialog
- ✅ Dark mode support

### Dashboard (TODO)
- User learning progress
- Course recommendations
- Recent activity
- Quick actions

### Courses (TODO)
- Course catalog with filtering
- Individual course pages with lessons
- Text, video, GIF-based content
- Interactive mind map of AI learning path

### Practice Platform (TODO)
- LeetCode-style problem listing
- Code editor with syntax highlighting
- Test cases and submissions
- Problem discussions

### Contests (TODO)
- Ongoing, upcoming, and past contests
- Contest leaderboards
- Timer and rankings
- Prize information

### Profile (TODO)
- User statistics
- Achievements and badges
- Learning streak
- Settings and preferences

## Technologies Used

- **React**: UI library
- **Vite**: Build tool
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI components
- **Motion**: Animations
- **Lucide React**: Icons
- **Supabase** (planned): Backend & Authentication

## Development Guidelines

1. **Component Organization**
   - Keep page-specific components in their respective `/pages/` folders
   - Shared components go in `/components/common/`
   - UI components stay in `/components/ui/`

2. **State Management**
   - Use React Context for global state (auth, theme)
   - Local state for component-specific data
   - Custom hooks for reusable logic

3. **API Integration**
   - All API calls should go through `/utils/api.ts`
   - Use Supabase for backend services
   - Implement proper error handling

4. **Styling**
   - Use Tailwind CSS classes
   - Follow dark mode conventions
   - Maintain consistent spacing and colors

5. **Type Safety**
   - Define types in `/types/index.ts`
   - Use TypeScript for all components
   - Avoid `any` types

## Next Steps

1. Implement authentication with Supabase
2. Build out course catalog and content system
3. Create code editor for practice platform
4. Implement contest system with real-time leaderboards
5. Add user dashboard with progress tracking
6. Create interactive AI learning mind map

## Contributing

When adding new features:
1. Create components in appropriate folders
2. Update type definitions if needed
3. Add routes to `/constants/index.ts`
4. Update this README if structure changes
