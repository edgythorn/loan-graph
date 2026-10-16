import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'

interface Props {
  value: number
  onChange: (value: number) => void
  onBlur?: () => void
  placeholder?: string
  className?: string
}

function format(raw: string): string {
  if (!raw) return ''
  const [intPart, decPart] = raw.split('.')
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return decPart !== undefined ? `${intFormatted},${decPart}` : intFormatted
}

function normalize(input: string): string {
  let s = input.replace(/\s/g, '').replace(',', '.')
  s = s.replace(/[^\d.]/g, '')
  const parts = s.split('.')
  if (parts.length > 2) s = parts[0] + '.' + parts.slice(1).join('')
  return s
}

function parse(raw: string): number {
  const n = Number(raw)
  return isNaN(n) ? 0 : n
}

export function MoneyInput({
  value,
  onChange,
  onBlur,
  placeholder,
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [text, setText] = useState(() => format(value ? String(value) : ''))
  const lastEmitted = useRef(value)

  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value
      setText(format(value ? String(value) : ''))
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const cursor = input.selectionStart ?? 0
    const before = input.value

    const normalized = normalize(before)
    const formatted = format(normalized)
    const parsed = parse(normalized)

    const digitsBefore = before.slice(0, cursor).replace(/[^\d.,]/g, '').length
    let newCursor = 0
    let seen = 0
    for (let i = 0; i < formatted.length; i++) {
      if (/[\d.,]/.test(formatted[i])) seen++
      if (seen === digitsBefore) {
        newCursor = i + 1
        break
      }
    }

    lastEmitted.current = parsed
    setText(formatted)
    onChange(parsed)

    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(newCursor, newCursor)
    })
  }

  return (
    <Input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={text}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={className}
    />
  )
}