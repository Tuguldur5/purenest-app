'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    useEffect(() => { 
        const role = localStorage.getItem("userRole")
        if (role !== 'admin') {
            router.push('/') // Admin биш бол homepage руу
        }
    }, [])

    return (
        <div></div>
    )
}
