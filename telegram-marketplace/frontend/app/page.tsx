'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ChatInterface from '@/components/Chat/ChatInterface'
import DealsBoard from '@/components/Deals/DealsBoard'
import Sidebar from '@/components/Common/Sidebar'
import { useAuthStore } from '@/lib/store/authStore'

export default function Home() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'messages' | 'deals'>('messages')
  const { user, token } = useAuthStore()

  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token, router])

  if (!token) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'messages' ? 'Messages' : 'Marketplace'}
            </h1>
            <p className="text-sm text-gray-600">
              {activeTab === 'messages' 
                ? 'Chat with your contacts' 
                : 'Buy and sell items in your community'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'messages' ? (
            <ChatInterface />
          ) : (
            <DealsBoard />
          )}
        </div>
      </div>
    </div>
  )
}
