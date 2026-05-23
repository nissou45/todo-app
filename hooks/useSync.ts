import { supabase } from '../lib/supabase';
import { Todo } from '../types';

interface CloudTodo {
  id: string;
  text: string;
  completed: boolean;
  categoryId: string;
  dueDate: string | null;
  reminderEnabled: boolean;
  updated_at: string;
  user_id: string;
}

interface UseSyncReturn {
  syncTodos: (localTodos: Todo[], userId: string) => Promise<Todo[]>;
}

export const useSync = (): UseSyncReturn => {
  const syncTodos = async (localTodos: Todo[], userId: string): Promise<Todo[]> => {
    if (!supabase) {
      if (__DEV__) console.log('[sync] Supabase non configuré, mode local uniquement');
      return localTodos;
    }

    try {
      // 1. Récupérer les données du cloud
      const { data: cloudTodos, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const cloudMap = new Map((cloudTodos || []).map((t: CloudTodo) => [t.id, t]));
      const localMap = new Map(localTodos.map((t) => [t.id, t]));

      type UploadRecord = Record<string, unknown>;
      const allIds = new Set([...cloudMap.keys(), ...localMap.keys()]);
      const merged: Todo[] = [];
      const toUpload: UploadRecord[] = [];

      allIds.forEach((id) => {
        const local = localMap.get(id);
        const cloud = cloudMap.get(id);

        if (local && cloud) {
          // Conflit : priorité au plus récent
          if (new Date(local.updatedAt) >= new Date(cloud.updated_at)) {
            merged.push(local);
            toUpload.push({ ...local, user_id: userId, updated_at: local.updatedAt });
          } else {
            merged.push({
              id: cloud.id,
              text: cloud.text,
              completed: cloud.completed,
              categoryId: cloud.categoryId,
              dueDate: cloud.dueDate,
              reminderEnabled: cloud.reminderEnabled ?? false,
              updatedAt: cloud.updated_at,
              pomodoroCount: 0,
            });
          }
        } else if (local) {
          // Uniquement en local
          merged.push(local);
          toUpload.push({ ...local, user_id: userId, updated_at: local.updatedAt });
        } else if (cloud) {
          // Uniquement sur le cloud
          merged.push({
            id: cloud.id,
            text: cloud.text,
            completed: cloud.completed,
            categoryId: cloud.categoryId,
            dueDate: cloud.dueDate,
            reminderEnabled: cloud.reminderEnabled ?? false,
            updatedAt: cloud.updated_at,
            pomodoroCount: 0,
          });
        }
      });

      // 2. Envoyer les mises à jour vers le cloud
      if (toUpload.length > 0) {
        const { error: upsertError } = await supabase
          .from('todos')
          .upsert(
            toUpload.map((t) => ({
              id: t.id,
              text: t.text,
              completed: t.completed,
              categoryId: t.categoryId,
              dueDate: t.dueDate,
              reminderEnabled: t.reminderEnabled,
              updated_at: t.updatedAt,
              user_id: userId,
            }))
          );
        if (upsertError) throw upsertError;
      }

      return merged;
    } catch (error) {
      console.error('Sync error:', error);
      return localTodos;
    }
  };

  return { syncTodos };
};
