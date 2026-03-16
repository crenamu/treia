import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'outline' | 'solid' | 'amber' | 'green' | 'blue'
  className?: string
}

export default function Badge({ children, variant = 'outline', className = '' }: BadgeProps) {
  const baseStyles = 'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider'
  
  const variants = {
    outline: 'bg-white border border-gray-100 text-gray-400',
    solid: 'bg-gray-900 text-white',
    amber: 'bg-amber-50 text-amber-600 border border-amber-100',
    green: 'bg-green-50 text-green-600 border border-green-100',
    blue: 'bg-blue-50 text-blue-600 border border-blue-100'
  }

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
