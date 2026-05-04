import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { EMPTY_PROFILE, type CompanyProfile } from '@/types/company';
import { api } from '@/lib/api';

const STORAGE_KEY = 'rde:companyProfile:v2';

interface CompanyProfileContextValue {
  profile: CompanyProfile;
  isComplete: boolean;
  loading: boolean;
  saving: boolean;
  error: Error | null;
  updateProfile: (patch: Partial<CompanyProfile>) => void;
  saveProfile: (next: CompanyProfile) => Promise<void>;
  resetProfile: () => void;
}

const CompanyProfileContext = createContext<CompanyProfileContextValue | null>(null);

function loadCachedProfile(): CompanyProfile {
  if (typeof window === 'undefined') return EMPTY_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROFILE;
    return { ...EMPTY_PROFILE, ...(JSON.parse(raw) as Partial<CompanyProfile>) };
  } catch {
    return EMPTY_PROFILE;
  }
}

function cacheProfile(profile: CompanyProfile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* noop */
  }
}

export function CompanyProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<CompanyProfile>(() => loadCachedProfile());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getCompany()
      .then((server) => {
        if (cancelled) return;
        setProfile(server);
        cacheProfile(server);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateProfile = useCallback((patch: Partial<CompanyProfile>) => {
    setProfile((p) => {
      const next = { ...p, ...patch };
      cacheProfile(next);
      return next;
    });
  }, []);

  const saveProfile = useCallback(async (next: CompanyProfile) => {
    setSaving(true);
    setError(null);
    try {
      const server = await api.saveCompany(next);
      setProfile(server);
      cacheProfile(server);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(EMPTY_PROFILE);
    cacheProfile(EMPTY_PROFILE);
    void api.saveCompany(EMPTY_PROFILE).catch(() => undefined);
  }, []);

  const isComplete = useMemo(
    () =>
      Boolean(
        profile.companyName &&
          profile.description &&
          profile.idealCustomerProfile &&
          profile.customerPains,
      ),
    [profile],
  );

  const value = useMemo(
    () => ({
      profile,
      isComplete,
      loading,
      saving,
      error,
      updateProfile,
      saveProfile,
      resetProfile,
    }),
    [profile, isComplete, loading, saving, error, updateProfile, saveProfile, resetProfile],
  );

  return (
    <CompanyProfileContext.Provider value={value}>{children}</CompanyProfileContext.Provider>
  );
}

export function useCompanyProfile() {
  const ctx = useContext(CompanyProfileContext);
  if (!ctx) throw new Error('useCompanyProfile must be used inside CompanyProfileProvider');
  return ctx;
}
