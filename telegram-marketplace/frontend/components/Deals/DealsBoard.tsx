'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, MessageCircle, Filter } from 'lucide-react'
import { dealService, messageService } from '@/lib/services/apiService'
import { useAuthStore } from '@/lib/store/authStore'

interface Deal {
  id: number
  user_id: number
  username: string
  display_name: string
  avatar_url?: string
  title: string
  description: string
  category: string
  type: 'selling' | 'buying'
  price?: number
  currency: string
  status: string
  location?: string
  created_at: string
}

export default function DealsBoard() {
  const { user } = useAuthStore()
  const [deals, setDeals] = useState<Deal[]>([])
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'selling' | 'buying'>('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)

  const [newDeal, setNewDeal] = useState({
    title: '',
    description: '',
    category: 'electronics',
    type: 'selling' as 'selling' | 'buying',
    price: '',
    currency: 'USD',
    location: ''
  })

  useEffect(() => {
    loadDeals()
  }, [])

  useEffect(() => {
    filterDeals()
  }, [searchQuery, filterType, filterCategory, deals])

  const loadDeals = async () => {
    try {
      setLoading(true)
      const data = await dealService.getDeals()
      setDeals(data.deals)
    } catch (error) {
      console.error('Failed to load deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterDeals = () => {
    let filtered = [...deals]

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(d => d.type === filterType)
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(d => d.category === filterCategory)
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredDeals(filtered)
  }

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDeal.title || !newDeal.description) return

    try {
      await dealService.createDeal({
        ...newDeal,
        price: newDeal.price ? parseFloat(newDeal.price) : undefined
      })

      setNewDeal({
        title: '',
        description: '',
        category: 'electronics',
        type: 'selling',
        price: '',
        currency: 'USD',
        location: ''
      })
      setShowCreateModal(false)
      loadDeals()
    } catch (error) {
      console.error('Failed to create deal:', error)
    }
  }

  const handleMessageSeller = async (deal: Deal) => {
    try {
      // Open chat with seller
      await messageService.sendMessage({
        receiver_id: deal.user_id,
        content: `Hi, I'm interested in your deal: "${deal.title}"`
      })
      alert('Message sent! Check your messages.')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const categories = [
    'electronics',
    'furniture',
    'vehicles',
    'clothing',
    'books',
    'sports',
    'other'
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header & Filters */}
      <div className="bg-white border-b border-gray-200 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Marketplace Deals</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            Create Deal
          </button>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deals..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Deals</option>
            <option value="selling">Selling</option>
            <option value="buying">Buying</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="text-center text-gray-600">Loading deals...</div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center text-gray-600">No deals found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map(deal => (
              <div key={deal.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 border border-gray-200">
                {/* Deal Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      deal.type === 'selling'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {deal.type === 'selling' ? 'SELLING' : 'BUYING'}
                    </span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {deal.category}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{deal.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{deal.description}</p>

                {/* Price */}
                {deal.price && (
                  <p className="text-2xl font-bold text-blue-600 mb-3">
                    {deal.currency} {deal.price.toLocaleString()}
                  </p>
                )}

                {/* Location */}
                {deal.location && (
                  <p className="text-sm text-gray-600 mb-4">📍 {deal.location}</p>
                )}

                {/* Seller Info */}
                <div className="bg-gray-50 p-3 rounded mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                    {deal.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{deal.display_name}</p>
                    <p className="text-xs text-gray-600">@{deal.username}</p>
                  </div>
                </div>

                {/* Action Button */}
                {user?.id !== deal.user_id && (
                  <button
                    onClick={() => handleMessageSeller(deal)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    <MessageCircle size={18} />
                    Message Seller
                  </button>
                )}

                {user?.id === deal.user_id && (
                  <div className="text-center text-sm text-gray-600">
                    ✓ Your listing
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Deal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create a New Deal</h2>

            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({...newDeal, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="What are you selling/buying?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newDeal.description}
                  onChange={(e) => setNewDeal({...newDeal, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Describe the item..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newDeal.type}
                    onChange={(e) => setNewDeal({...newDeal, type: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="selling">Selling</option>
                    <option value="buying">Buying</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newDeal.category}
                    onChange={(e) => setNewDeal({...newDeal, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (optional)
                  </label>
                  <input
                    type="number"
                    value={newDeal.price}
                    onChange={(e) => setNewDeal({...newDeal, price: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={newDeal.currency}
                    onChange={(e) => setNewDeal({...newDeal, currency: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={newDeal.location}
                  onChange={(e) => setNewDeal({...newDeal, location: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="City, Country"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
