import api from './authService'

export const messageService = {
  getMessages: async (userId: number) => {
    const response = await api.get(`/messages/${userId}`)
    return response.data
  },

  sendMessage: async (data: { receiver_id: number; content: string }) => {
    const response = await api.post('/messages', data)
    return response.data
  },

  markAsRead: async (messageId: number) => {
    const response = await api.patch(`/messages/${messageId}/read`)
    return response.data
  },
}

export const groupService = {
  getGroups: async () => {
    const response = await api.get('/groups')
    return response.data
  },

  createGroup: async (data: {
    name: string
    description?: string
    members?: number[]
  }) => {
    const response = await api.post('/groups', data)
    return response.data
  },

  getGroupMessages: async (groupId: number) => {
    const response = await api.get(`/groups/${groupId}/messages`)
    return response.data
  },
}

export const userService = {
  searchUsers: async (query: string) => {
    const response = await api.get(`/users/search/${query}`)
    return response.data
  },

  getUserProfile: async (userId: number) => {
    const response = await api.get(`/users/profile/${userId}`)
    return response.data
  },

  getContacts: async () => {
    const response = await api.get('/users/contacts')
    return response.data
  },

  addContact: async (contactId: number) => {
    const response = await api.post(`/users/contacts/${contactId}`)
    return response.data
  },

  updateProfile: async (data: {
    display_name?: string
    avatar_url?: string
    bio?: string
  }) => {
    const response = await api.patch('/users/profile', data)
    return response.data
  },
}

export const dealService = {
  getDeals: async (params?: {
    category?: string
    type?: string
    search?: string
    limit?: number
    offset?: number
  }) => {
    const response = await api.get('/deals', { params })
    return response.data
  },

  getDealDetails: async (dealId: number) => {
    const response = await api.get(`/deals/${dealId}`)
    return response.data
  },

  createDeal: async (data: {
    title: string
    description: string
    category?: string
    type: 'selling' | 'buying'
    price?: number
    currency?: string
    location?: string
    images_urls?: string[]
  }) => {
    const response = await api.post('/deals', data)
    return response.data
  },

  updateDealStatus: async (dealId: number, status: string) => {
    const response = await api.patch(`/deals/${dealId}`, { status })
    return response.data
  },

  sendInquiry: async (dealId: number, message?: string) => {
    const response = await api.post(`/deals/${dealId}/inquire`, { message })
    return response.data
  },

  getInquiries: async (dealId: number) => {
    const response = await api.get(`/deals/${dealId}/inquiries`)
    return response.data
  },
}
