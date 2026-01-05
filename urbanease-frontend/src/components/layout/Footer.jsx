import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-10">
        <div className="container mx-auto px-4 py-6 text-sm text-gray-600">© {new Date().getFullYear()} Urbanease - Demo. All rights reserved.</div>
    </footer>
  )
}

export default Footer