import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

type Installation = {
  id: string;
  provider: "github" | "gitlab";
  installationId: string;
  accountLogin: string;
  accountType: string;
};

type InstallationsContextType = {
  installations: Installation[];
  refreshInstallations: () => Promise<void>;
};

const InstallationsContext = createContext<InstallationsContextType | undefined>(undefined);

export function InstallationsProvider({ children }: { children: ReactNode }) {
  const [installations, setInstallations] = useState<Installation[]>([]);

  const refreshInstallations = async () => {
    try {
      const res = await fetch("/api/installations", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch installations");
      const data = await res.json();
      setInstallations(data.installations as Installation[]);
    } catch (err) {
      console.error("Error fetching provider installations:", err);
      setInstallations([]);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only fetch on mount
  useEffect(() => {
    refreshInstallations();
  }, []);

  return (
    <InstallationsContext.Provider value={{ installations, refreshInstallations }}>
      {children}
    </InstallationsContext.Provider>
  );
}

export const useInstallations = () => {
  const context = useContext(InstallationsContext);
  if (!context) throw new Error("useInstallations must be used within InstallationsProvider");
  return context;
};
