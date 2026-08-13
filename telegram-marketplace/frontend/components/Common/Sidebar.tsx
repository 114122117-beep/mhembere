'use client'

import { useRouter } from 'next/navigation'
import { MessageCircle, ShoppingBag, LogOut, Settings } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'

interface SidebarProps {
  activeTab: 'messages' | 'deals'
  setActiveTab: (tab: 'messages' | 'deals') => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <aside className="w-20 bg-gradient-to-b from-blue-600 to-blue-700 flex flex-col items-center py-6 space-y-8 border-r border-blue-800">
      {/* Logo */}
      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-bold text-blue-600">
        TM
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-4 flex-1">
        <button
          onClick={() => setActiveTab('messages')}
          className={`p-3 rounded-lg transition ${
            activeTab === 'messages'
              ? 'bg-white text-blue-600'
              : 'text-white hover:bg-blue-500'
          }`}
          title="Messages"
        >
          <MessageCircle size={24} />
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`p-3 rounded-lg transition ${
            activeTab === 'deals'
              ? 'bg-white text-blue-600'
              : 'text-white hover:bg-blue-500'
          }`}
          title="Marketplace"
        >
          <ShoppingBag size={24} />
        </button>
      </nav>

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t border-blue-500 pt-4 w-full items-center">
        <button
          onClick={() => router.push('/settings')}
          className="p-3 text-white hover:bg-blue-500 rounded-lg transition"
          title="Settings"
        >
          <Settings size={20} />
        </button>

        <button
          onClick={handleLogout}
          className="p-3 text-white hover:bg-red-500 rounded-lg transition"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  )
}
