import { create } from 'zustand';
import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware';
import { GlobalPreferences, GroupBy, SortBy, ViewSettings } from './components/types';

interface AchievementState extends GlobalPreferences, ViewSettings {
  clearDefaults(): void;
  hasCustomDefaults(): boolean;
  resetToDefault(): void;
  saveAsDefault(): void;
  setPreferences(preferences: Partial<GlobalPreferences>): void;
  setViewSettings(settings: Partial<ViewSettings>): void;

  // Internal persistent state for defaults
  savedDefaults: ViewSettings | null;
}

const defaultsGlobalPreferences: GlobalPreferences = {
  hideHidden: false,
  showGuides: true,
  showObtainability: true,
  showPlayerCount: true,
  showPoints: true,
  showTags: true,
};

const standardDefaults: ViewSettings = {
  expandAll: true,
  groupBy: GroupBy.DLCAndUpdate,
  reverse: false,
  showUnlocked: true,
  sortBy: SortBy.SteamHunters,
  searchQuery: '',
  preferencesOpen: false,
};

const persistOptions: PersistOptions<AchievementState> = {
  name: 'steamhunter-settings',
  version: 1,
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => {
    // Dynamically make it from the GlobalPreferences interface
    const globalPrefs: Partial<GlobalPreferences> = {};
    for (const key of Object.keys(defaultsGlobalPreferences)) {
      globalPrefs[key as keyof GlobalPreferences] = state[key as keyof GlobalPreferences];
    }

    const persisted = {
      ...globalPrefs,
      // Persist savedDefaults
      savedDefaults: state.savedDefaults,
    };

    return persisted as AchievementState;
  },
  onRehydrateStorage: () => (state) => {
    // Always reset to defaults on load to ensure ViewSettings aren't accidentally persisted
    // or left in an inconsistent state.
    state?.resetToDefault();
  },
};

// @ts-expect-error ignore weird error that randomly appears
export const useAchievementStore = create<AchievementState>()(persist(
  (set, get) => ({
    // Global Preferences
    ...defaultsGlobalPreferences,

    // Active View Settings
    ...standardDefaults,

    // Internal persistent state for defaults
    savedDefaults: null,

    setPreferences: (preferences: Partial<GlobalPreferences>): void => {
      set(state => ({ ...state, ...preferences }) as AchievementState);
    },

    setViewSettings: (settings: Partial<ViewSettings>): void => {
      set(state => ({ ...state, ...settings }) as AchievementState);
    },

    saveAsDefault: (): void => {
      const state = get();
      set({
        savedDefaults: {
          // View Settings Only (exclude Global Preferences)
          expandAll: state.expandAll,
          groupBy: state.groupBy,
          reverse: state.reverse,
          showUnlocked: state.showUnlocked,
          sortBy: state.sortBy,
          searchQuery: '', // Always reset search in defaults
        },
      } as Partial<AchievementState>);
    },

    resetToDefault: (): void => {
      const { savedDefaults } = get();
      // Always merge with standardDefaults to ensure all keys are present
      set({ ...standardDefaults, ...(savedDefaults ?? {}) } as Partial<AchievementState>);
    },

    clearDefaults: (): void => {
      set({ savedDefaults: null } as Partial<AchievementState>);
      // After clearing, we should reset active settings to standard defaults
      get().resetToDefault();
    },

    hasCustomDefaults: (): boolean => get().savedDefaults !== null,
  }),
  persistOptions,
));
