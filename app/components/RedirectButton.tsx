'use client';

import React from 'react'
import { useRouter } from 'next/navigation';

interface RedirectButtonProps {
  text: string;
  route: string;
}
const RedirectButton = ({text, route}: RedirectButtonProps) => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(route)}
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
    >
      {text}
    </button>
  )
}

export default RedirectButton;