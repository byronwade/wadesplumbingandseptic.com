import { createEvlog } from 'evlog/next'
import { createFsDrain } from 'evlog/fs'

export const { withEvlog, useLogger, log, createError } = createEvlog({
  service: 'wades-plumbing-and-septic',
  // Local NDJSON under .evlog/logs — development only.
  drain: process.env.NODE_ENV === 'production' ? undefined : createFsDrain(),
})
