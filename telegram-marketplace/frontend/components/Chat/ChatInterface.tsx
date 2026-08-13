'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Search, Plus } from 'lucide-react'
import { userService, messageService } from '@/lib/services/apiService'
import { useSocket } from '@/lib/hooks/useSocket'
import { useAuthStore } from '@/lib/store/authStore'

interface Contact {
  id: number
  username: string
  display_name: string
  avatar_url?: string
}

interface Message {
  id: number
  sender_id: number
  receiver_id: number
  content: string
  created_at: string
  is_read: boolean
}

export default function ChatInterface() {
  const { user } = useAuthStore()
  const { on, emit } = useSocket()
  
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load contacts on mount
  useEffect(() => {
    loadContacts()
  }, [])

  // Load messages when contact is selected
  useEffect(() => {
    if (selectedContact) {
      loadMessages()
    }
  }, [selectedContact])

  // Listen for new messages
  useEffect(() => {
    on('receive-message', (data) => {
      if (data.sender_id === selectedContact?.id) {
        setMessages(prev => [...prev, data])
      }
    })
  }, [selectedContact, on])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadContacts = async () => {
    try {
      const data = await userService.getContacts()
      setContacts(data)
    } catch (error) {
      console.error('Failed to load contacts:', error)
    }
  }

  const loadMessages = async () => {
    if (!selectedContact) return
    try {
      setLoading(true)
      const data = await messageService.getMessages(selectedContact.id)
      setMessages(data)
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      const results = await userService.searchUsers(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  const handleAddContact = async (contact: Contact) => {
    try {
      await userService.addContact(contact.id)
      setContacts(prev => [...prev, contact])
      setSearchResults(prev => prev.filter(c => c.id !== contact.id))
      setSearchQuery('')
    } catch (error) {
      console.error('Failed to add contact:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !selectedContact || !user) return

    const tempMessage: Message = {
      id: Date.now(),
      sender_id: user.id,
      receiver_id: selectedContact.id,
      content: messageInput,
      created_at: new Date().toISOString(),
      is_read: false
    }

    try {
      setMessages(prev => [...prev, tempMessage])
      setMessageInput('')
      
      // Send via API
      await messageService.sendMessage({
        receiver_id: selectedContact.id,
        content: messageInput
      })

      // Emit via socket
      emit('send-message', {
        sender_id: user.id,
        receiver_id: selectedContact.id,
        content: messageInput
      })
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id))
    }
  }

  return (
    <div className="flex h-full">
      {/* Contacts List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {searchResults.map(result => (
                <div key={result.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                  <div>
                    <p className="font-medium text-sm">{result.display_name}</p>
                    <p className="text-xs text-gray-600">@{result.username}</p>
                  </div>
                  <button
                    onClick={() => handleAddContact(result)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="p-4 text-center text-gray-600">
              <p>No contacts yet. Search for users to add them.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {contacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full px-4 py-3 text-left transition ${
                    selectedContact?.id === contact.id
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      {contact.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{contact.display_name}</p>
                      <p className="text-xs text-gray-600">@{contact.username}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold">{selectedContact.display_name}</h2>
              <p className="text-sm text-gray-600">@{selectedContact.username}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="text-center text-gray-600">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-600">No messages yet</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender_id === user?.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            <p>Select a contact to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
