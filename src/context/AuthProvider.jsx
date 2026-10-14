import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { DEFAULT_ACCOUNTS } from "../constants";

const AUTH_KEY = "benahin-auth-user";

function muatUser() {
  try {
    const tersimpan = localStorage.getItem(AUTH_KEY);
    if (!tersimpan) return null;
    const parsed = JSON.parse(tersimpan);
    if (parsed && typeof parsed.name === "string") {
      parsed.name = parsed.name.replace(/\s*\(Pelapor\)/i, "");
    }
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(muatUser);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    } catch {
      // ignore storage error
    }
  }, [user]);

  const login = ({ username, password, targetRole = "pelapor" }) => {
    const cleanUser = username?.trim().toLowerCase();
    const cleanPass = password?.trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, error: "Username dan password wajib diisi." };
    }

    if (targetRole === "admin") {
      // Validasi akun Admin
      if (
        (cleanUser === DEFAULT_ACCOUNTS.admin.username ||
          cleanUser === DEFAULT_ACCOUNTS.admin.email) &&
        cleanPass === DEFAULT_ACCOUNTS.admin.password
      ) {
        const adminData = {
          username: DEFAULT_ACCOUNTS.admin.username,
          name: DEFAULT_ACCOUNTS.admin.name,
          role: "admin",
          email: DEFAULT_ACCOUNTS.admin.email,
        };
        setUser(adminData);
        return { success: true, user: adminData };
      }
      return {
        success: false,
        error: "Kredensial Admin salah! Gunakan username 'admin' dan password 'admin123'.",
      };
    } else {
      // Validasi akun Pelapor default
      if (
        cleanUser === DEFAULT_ACCOUNTS.pelapor.username ||
        cleanUser === DEFAULT_ACCOUNTS.pelapor.email
      ) {
        if (cleanPass !== DEFAULT_ACCOUNTS.pelapor.password) {
          return {
            success: false,
            error: "Password pelapor salah! (Default: pelapor123)",
          };
        }
        const pelaporData = {
          username: DEFAULT_ACCOUNTS.pelapor.username,
          name: DEFAULT_ACCOUNTS.pelapor.name,
          role: "pelapor",
          email: DEFAULT_ACCOUNTS.pelapor.email,
        };
        setUser(pelaporData);
        return { success: true, user: pelaporData };
      }

      // Pelapor dapat masuk dengan nama/username kustom
      if (cleanPass.length < 3) {
        return {
          success: false,
          error: "Password minimal 3 karakter.",
        };
      }

      const formattedName = cleanUser
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      const customPelapor = {
        username: cleanUser,
        name: formattedName,
        role: "pelapor",
        email: cleanUser.includes("@") ? cleanUser : `${cleanUser}@kampus.ac.id`,
      };
      setUser(customPelapor);
      return { success: true, user: customPelapor };
    }
  };

  const quickLogin = (role) => {
    if (role === "admin") {
      const adminData = {
        username: DEFAULT_ACCOUNTS.admin.username,
        name: DEFAULT_ACCOUNTS.admin.name,
        role: "admin",
        email: DEFAULT_ACCOUNTS.admin.email,
      };
      setUser(adminData);
      return adminData;
    } else {
      const pelaporData = {
        username: DEFAULT_ACCOUNTS.pelapor.username,
        name: DEFAULT_ACCOUNTS.pelapor.name,
        role: "pelapor",
        email: DEFAULT_ACCOUNTS.pelapor.email,
      };
      setUser(pelaporData);
      return pelaporData;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        quickLogin,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isPelapor: user?.role === "pelapor",
        defaultAccounts: DEFAULT_ACCOUNTS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
