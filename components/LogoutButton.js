// components/LogoutButton.js
import { useAuth } from '../context/AuthContext';

export default function LogoutButton() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.reload(); // Recharge la page pour mettre à jour l'état global
  };

  return (
    <button
      onClick={handleLogout}
      className="py-2 px-4 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition"
    >
      Se déconnecter
    </button>
  );
}
