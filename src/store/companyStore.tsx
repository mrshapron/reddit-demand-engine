import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type CompanyProfile } from '@/types/company';
import { mockCompanyProfile } from '@/data/mockCompanyProfile';

const STORAGE_KEY = 'rde:companyProfile:v1';

interface CompanyProfileContextValue {
  profile: CompanyProfile;
  isComplete: boolean;
  updateProfile: (patch: Partial<CompanyProfile>) => void;
  saveProfile: (next: CompanyProfile) => void;
  resetProfile: () => void;
}

const CompanyProfileContext = createContext<CompanyProfileContextValue | null>(null);

function loadProfile(): CompanyProfile {
  if (typeof window === 'undefined') return mockCompanyProfile;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockCompanyProfile;
    return { ...mockCompanyProfile, ...(JSON.parse(raw) as Partial<CompanyProfile>) };
  } catch {
    return mockCompanyProfile;
  }
}

export function CompanyProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<CompanyProfile>(() => loadProfile());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      /* noop */
    }
  }, [profile]);

  const updateProfile = useCallback((patch: Partial<CompanyProfile>) => {
    setProfile((p) => ({ ...p, ...patch }));
  }, []);

  const saveProfile = useCallback((next: CompanyProfile) => {
    setProfile(next);
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(mockCompanyProfile);
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
    () => ({ profile, isComplete, updateProfile, saveProfile, resetProfile }),
    [profile, isComplete, updateProfile, saveProfile, resetProfile],
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
