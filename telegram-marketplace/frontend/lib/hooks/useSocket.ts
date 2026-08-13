import { useEffect, useRef, useCallback } from 'react'
import io, { Socket } from 'socket.io-client'
import { useAuthStore } from '@/lib/store/authStore'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null)
  const { user, token } = useAuthStore()

  useEffect(() => {
    if (!token || !user) return

    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      })

      socketRef.current.on('connect', () => {
        console.log('Socket connected')
        socketRef.current?.emit('user-join', user.id)
      })

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected')
      })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect')
        socketRef.current.off('disconnect')
      }
    }
  }, [user, token])

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }, [])

  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data)
    }
  }, [])

  const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }, [])

  return { socket: socketRef.current, on, emit, off }
}
