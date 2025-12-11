
// ───────────────────────────────────────────────
// 🏁 Startup
// ───────────────────────────────────────────────
console.info('Starting API server...')

// Handle fatal errors early
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason: any) => {
  const msg = reason?.message || reason
  console.error(`Unhandled Rejection: ${msg}`, reason)
  process.exit(1)
})

// ───────────────────────────────────────────────
// 🔧 Main Bootstrap
// ───────────────────────────────────────────────
async function main() {
  try {
    // Initialize configuration
    const { initConfig } = await import('./config')
    await initConfig()
    console.debug('Configuration initialized.')

    // Create Express app
    const { createApp } = await import('./core/create-app')
    await createApp()
  } catch (err: any) {
    console.error('Failed to start application', err)
    process.exit(1)
  }
}

main()
