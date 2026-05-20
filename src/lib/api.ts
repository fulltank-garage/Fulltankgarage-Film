const defaultBaseUrl = 'http://localhost:8080/api'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const apiBaseUrl = configuredBaseUrl
  ? configuredBaseUrl.replace(/\/+$/, '')
  : import.meta.env.DEV
    ? defaultBaseUrl
    : '/api'

export const isApiBaseUrlConfigured = Boolean(
  configuredBaseUrl || import.meta.env.DEV,
)

export const resolveImageUrl = (value?: string | null) => {
  const imageUrl = value?.trim()
  if (!imageUrl) {
    return ''
  }

  if (/^(https?:|data:|blob:)/i.test(imageUrl)) {
    return imageUrl
  }

  const apiUrl = new URL(apiBaseUrl, window.location.origin)
  apiUrl.pathname = apiUrl.pathname.replace(/\/api\/?$/, '/')
  apiUrl.search = ''
  apiUrl.hash = ''

  return new URL(imageUrl, apiUrl).toString()
}

export const getJson = async <ResponseBody>(
  path: string,
  init?: RequestInit,
) => {
  if (!isApiBaseUrlConfigured) {
    throw new Error('ไม่พบการตั้งค่า API สำหรับระบบโปรโมชัน')
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }

  return response.json() as Promise<ResponseBody>
}

export type CatalogRealtimeEvent =
  | { type: 'film.created' | 'film.updated'; data: unknown }
  | { type: 'film.deleted'; data: { id?: number | string } }
  | { type: 'promotion.created' | 'promotion.updated'; data: unknown }
  | { type: 'promotion.deleted'; data: { id?: number | string } }

const createCatalogEventsSocket = () => {
  if (!isApiBaseUrlConfigured) {
    return null
  }

  const baseUrl = new URL(apiBaseUrl, window.location.origin)
  baseUrl.protocol = baseUrl.protocol === 'https:' ? 'wss:' : 'ws:'
  baseUrl.pathname = `${baseUrl.pathname.replace(/\/$/, '')}/catalog/events`
  baseUrl.search = ''

  return new WebSocket(baseUrl.toString())
}

export const subscribeCatalogEvents = (
  onEvent: (event: CatalogRealtimeEvent) => void,
) => {
  let socket: WebSocket | null = null
  let retryTimer: ReturnType<typeof setTimeout> | null = null
  let retryCount = 0
  let isClosed = false

  const connect = () => {
    if (isClosed || socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) {
      return
    }

    socket = createCatalogEventsSocket()
    if (!socket) {
      return
    }

    socket.onopen = () => {
      retryCount = 0
    }

    socket.onmessage = (message) => {
      try {
        onEvent(JSON.parse(message.data) as CatalogRealtimeEvent)
      } catch {
        // Ignore malformed realtime payloads.
      }
    }

    socket.onerror = () => {
      socket?.close()
    }

    socket.onclose = () => {
      if (isClosed) {
        return
      }

      retryCount += 1
      retryTimer = setTimeout(connect, Math.min(1000 * retryCount, 10000))
    }
  }

  connect()

  return () => {
    isClosed = true
    if (retryTimer) {
      clearTimeout(retryTimer)
    }
    socket?.close()
  }
}
