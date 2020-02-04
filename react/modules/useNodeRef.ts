import { useState } from 'react'

type RefFn = <T>(instance: T | null) => void

export const useNodeRef = <T extends HTMLElement>(): [T | null, RefFn] => {
  const [node, ref] = useState<T | null>(null)
  return [node, ref as RefFn]
}
