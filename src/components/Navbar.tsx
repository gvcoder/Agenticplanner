import { User } from 'firebase/auth';
import { LogOut, LogIn, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function Navbar({ user, onLogin, onLogout }: NavbarProps) {
  return (
    <nav className="border-b border-[#5A5A40]/10 bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#5A5A40] rounded-xl flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <span className="text-2xl font-light tracking-tight">
            Agentic<span className="italic">Planner</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#5A5A40]/5 rounded-full border border-[#5A5A40]/10">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-4 h-4 text-[#5A5A40]" />
                )}
                <span className="text-sm font-medium text-[#5A5A40]">{user.displayName}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-[#5A5A40] hover:bg-[#5A5A40]/5 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-2 text-[#5A5A40] font-medium hover:underline underline-offset-4"
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
