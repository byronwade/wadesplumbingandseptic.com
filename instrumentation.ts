import { defineNodeInstrumentation } from 'evlog/next/instrumentation'

export const { register, onRequestError } = defineNodeInstrumentation({
  service: 'wades-plumbing-and-septic',
  captureOutput: true,
})
