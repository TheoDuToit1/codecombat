import { supabase } from '../lib/supabase';
import { LessonProgress } from '../data/lessonPlan';

const PROGRESS_STORAGE_KEY = 'xcode_academy_progress';
const CURRENT_PROGRESS_KEY = 'xcode_academy_current_progress';

/**
 * Service to handle lesson progress tracking and persistence
 */
export class ProgressService {
  /**
   * Get the current lesson progress (highest completed lesson ID)
   */
  static getCurrentProgress(): number {
    try {
      const storedProgress = localStorage.getItem(CURRENT_PROGRESS_KEY);
      return storedProgress ? parseInt(storedProgress, 10) : 0;
    } catch (error) {
      console.error('Error getting current progress:', error);
      return 0;
    }
  }

  /**
   * Set the current lesson progress (highest completed lesson ID)
   */
  static setCurrentProgress(lessonId: number): void {
    try {
      // Only update if the new lesson ID is higher than the current progress
      const currentProgress = this.getCurrentProgress();
      if (lessonId > currentProgress) {
        localStorage.setItem(CURRENT_PROGRESS_KEY, lessonId.toString());
        // Also save to Supabase in the background
        this.saveProgressToSupabase(lessonId).catch(console.error);
      }
    } catch (error) {
      console.error('Error setting current progress:', error);
    }
  }

  /**
   * Get detailed lesson progress data
   */
  static getLessonProgress(): LessonProgress[] {
    try {
      const storedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
      return storedProgress ? JSON.parse(storedProgress) : [];
    } catch (error) {
      console.error('Error getting lesson progress:', error);
      return [];
    }
  }

  /**
   * Update progress for a specific lesson
   */
  static updateLessonProgress(lessonProgress: LessonProgress): void {
    try {
      const allProgress = this.getLessonProgress();
      
      // Find if this lesson already has progress data
      const existingIndex = allProgress.findIndex(p => p.lessonId === lessonProgress.lessonId);
      
      if (existingIndex >= 0) {
        // Update existing progress
        allProgress[existingIndex] = {
          ...allProgress[existingIndex],
          ...lessonProgress,
          // If completing the lesson, set the completion date
          ...(lessonProgress.completed && !allProgress[existingIndex].completed ? { completedAt: new Date() } : {})
        };
      } else {
        // Add new progress entry
        allProgress.push({
          ...lessonProgress,
          // If completing the lesson, set the completion date
          ...(lessonProgress.completed ? { completedAt: new Date() } : {})
        });
      }
      
      // Save to localStorage
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
      
      // If the lesson is completed, update the current progress
      if (lessonProgress.completed) {
        this.setCurrentProgress(lessonProgress.lessonId);
      }
      
      // Save to Supabase in the background
      this.saveDetailedProgressToSupabase(allProgress).catch(console.error);
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  }

  /**
   * Mark a lesson as completed
   */
  static completeLesson(lessonId: number, score = 100): void {
    this.updateLessonProgress({
      lessonId,
      completed: true,
      score,
      attempts: 1,
      timeSpent: 0, // This would ideally be tracked during the lesson
      completedAt: new Date(),
      bestScore: score
    });
  }

  /**
   * Check if a specific lesson is completed
   */
  static isLessonCompleted(lessonId: number): boolean {
    try {
      // First check by current progress
      const currentProgress = this.getCurrentProgress();
      if (lessonId <= currentProgress) {
        return true;
      }
      
      // Then check detailed progress
      const allProgress = this.getLessonProgress();
      return allProgress.some(p => p.lessonId === lessonId && p.completed);
    } catch (error) {
      console.error('Error checking if lesson is completed:', error);
      return false;
    }
  }

  /**
   * Save current progress to Supabase
   */
  private static async saveProgressToSupabase(currentProgress: number): Promise<void> {
    try {
      // Ensure we have a session
      await supabase.auth.getSession();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user session, skipping Supabase save');
        return;
      }
      
      // Check if user progress exists
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (existingProgress) {
        // Update existing progress if the new progress is higher
        if (currentProgress > existingProgress.current_progress) {
          await supabase
            .from('user_progress')
            .update({ 
              current_progress: currentProgress,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        }
      } else {
        // Create new progress record
        await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            current_progress: currentProgress
          });
      }
    } catch (error) {
      console.error('Error saving progress to Supabase:', error);
      // Fail silently - we still have localStorage as backup
    }
  }

  /**
   * Save detailed lesson progress to Supabase
   */
  private static async saveDetailedProgressToSupabase(progress: LessonProgress[]): Promise<void> {
    try {
      // Ensure we have a session
      await supabase.auth.getSession();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user session, skipping Supabase save');
        return;
      }
      
      // Check if user progress exists
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (existingProgress) {
        // Update existing progress
        await supabase
          .from('user_progress')
          .update({ 
            detailed_progress: progress,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Get the highest completed lesson ID
        const currentProgress = progress.reduce(
          (max, p) => (p.completed && p.lessonId > max ? p.lessonId : max),
          0
        );
        
        // Create new progress record
        await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            current_progress: currentProgress,
            detailed_progress: progress
          });
      }
    } catch (error) {
      console.error('Error saving detailed progress to Supabase:', error);
      // Fail silently - we still have localStorage as backup
    }
  }

  /**
   * Load progress from Supabase
   */
  static async loadProgressFromSupabase(): Promise<void> {
    try {
      // Ensure we have a session
      await supabase.auth.getSession();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user session, skipping Supabase load');
        return;
      }
      
      // Get user progress
      const { data: userProgress, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No progress found in Supabase');
        } else {
          console.error('Error loading progress from Supabase:', error);
        }
        return;
      }
      
      if (userProgress) {
        // Update localStorage with Supabase data
        localStorage.setItem(CURRENT_PROGRESS_KEY, userProgress.current_progress.toString());
        
        if (userProgress.detailed_progress) {
          localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(userProgress.detailed_progress));
        }
        
        console.log('Progress loaded from Supabase');
      }
    } catch (error) {
      console.error('Error loading progress from Supabase:', error);
      // Fail silently - we still have localStorage as backup
    }
  }
} 