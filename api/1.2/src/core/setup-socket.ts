import { config } from '@src/config/config'
import { handleSocketCommand } from '@src/modules'
import http from 'http'
import jwt from 'jsonwebtoken'
import { Server as SocketIOServer } from 'socket.io'
import { logger } from './logger'

export function setupSocket(server: http.Server): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: {
      origin: config.corsAllowedOrigins || '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  })

  // Socket authentication using Bearer token from handshake auth or header
  io.use((socket, next) => {
    try {
      const authToken =
        (socket.handshake.auth && (socket.handshake.auth as any).token) ||
        (socket.handshake.headers['authorization'] as string | undefined)?.replace('Bearer ', '')

      if (!authToken) {
        return next(new Error('unauthorized'))
      }
      const user = jwt.verify(authToken, config.authTokenSecret)
      ;(socket.data as any).user = user
      next()
    } catch (err) {
      next(new Error('unauthorized'))
    }
  })

  io.on('connection', (socket) => {
    logger.info(`WS client connected: ${socket.id}`)

    // Notify client immediately about successful connection
    socket.emit('connected')

    // Handle inbound messages
    socket.on('message', (payload) => handleSocketCommand(socket, payload))

    socket.on('disconnect', (reason) => {
      logger.info(`WS client disconnected: ${socket.id} (${reason})`)
    })
  })

  return io
}
