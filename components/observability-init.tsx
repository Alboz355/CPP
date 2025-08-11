"use client"

import { useEffect } from 'react'
import { initObservability } from '@/lib/observability'

export function ObservabilityInit() {
  useEffect(() => {
    initObservability()
  }, [])
  return null
}
