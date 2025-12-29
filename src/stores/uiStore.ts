import { create } from 'zustand';
import type {UIStore, Notification} from '../types/game';

export const useUIStore = create<UIStore>((set, get) => ({
  // State
  isMenuOpen: false,
  notifications: [],

  // Actions
  setMenuOpen: (open: boolean) => {
    set({ isMenuOpen: open });
  },

  addNotification: (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));

    // Auto remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  }
}));