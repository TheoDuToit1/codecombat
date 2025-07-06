# X-Code Academy Progress Tracking System

This document explains how the progress tracking system works in X-Code Academy.

## Overview

The progress tracking system allows users to:

- Track their progress through the 160 lessons
- Save their progress locally and in the cloud
- See visual progress indicators
- Unlock new lessons as they complete existing ones

## Implementation

### Data Structure

Progress is tracked using two main data structures:

1. **Simple Progress Counter** - A single number representing the highest lesson ID completed
2. **Detailed Progress Data** - An array of `LessonProgress` objects with detailed information:
   ```typescript
   interface LessonProgress {
     lessonId: number;
     completed: boolean;
     score: number;
     attempts: number;
     timeSpent: number; // minutes
     completedAt?: Date;
     bestScore?: number;
   }
   ```

### Storage

Progress is stored in two places:

1. **LocalStorage** - For offline access and quick loading
   - `xcode_academy_current_progress` - Stores the highest completed lesson ID
   - `xcode_academy_progress` - Stores the detailed progress data array

2. **Supabase** - For cloud backup and syncing across devices
   - `user_progress` table with fields:
     - `user_id` - The authenticated user ID
     - `current_progress` - The highest completed lesson ID
     - `detailed_progress` - JSON array of detailed progress data

### Components

The progress tracking system involves these key components:

1. **ProgressService** (`src/services/ProgressService.ts`)
   - Static class that handles all progress-related operations
   - Methods for getting, setting, and updating progress
   - Handles synchronization between localStorage and Supabase

2. **XCodeAcademy Component** (`src/components/XCodeAcademy.tsx`)
   - Displays lessons based on current progress
   - Provides UI for completing lessons
   - Updates progress when lessons are completed

3. **Dashboard Component** (`src/components/Dashboard.tsx`)
   - Shows overall progress indicators
   - Displays progress percentage

4. **App Component** (`src/App.tsx`)
   - Loads initial progress on application start
   - Passes progress data to child components

### User Flow

1. When the application loads, it attempts to load progress from Supabase
2. If Supabase is unavailable or the user is not authenticated, it falls back to localStorage
3. As the user completes lessons, progress is updated in both localStorage and Supabase
4. Progress indicators update in real-time to show completion status

## Database Schema

The `user_progress` table in Supabase has the following schema:

```sql
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    current_progress INTEGER NOT NULL DEFAULT 0,
    detailed_progress JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Row-level security policies ensure that users can only access their own progress data.

## Usage

### Checking if a Lesson is Completed

```typescript
const isCompleted = ProgressService.isLessonCompleted(lessonId);
// or in components that receive currentProgress as a prop
const isCompleted = lessonId <= currentProgress;
```

### Marking a Lesson as Completed

```typescript
ProgressService.completeLesson(lessonId);
```

### Getting Current Progress

```typescript
const progress = ProgressService.getCurrentProgress();
```

## Future Enhancements

- Achievement tracking based on progress
- Detailed analytics on time spent and attempts
- Progress sharing and leaderboards
- Syncing progress across multiple devices 