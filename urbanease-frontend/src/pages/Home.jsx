import React, { useEffect, useState } from 'react'

// Homepage.jsx
// React + Tailwind component designed for your Urban Company style project.
// Usage: place this component in src/pages/Home.jsx and import into AppRouter.

// Notes:
// - Expects an axios instance at src/api/axiosClient (BASE_URL configured)
// - If you don't have axiosClient yet, replace fetches with static data or simple fetch()

import axiosClient from '../api/axiosClient' // adjust path if necessary
import ServiceCard from '../components/service/ServiceCard'
import Footer from '../components/layout/Footer'


export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const [catRes, servRes] = await Promise.all([
          axiosClient.get('/services/categories/'),
          axiosClient.get('/services/'),
        ])
        if (!mounted) return
        setCategories(catRes.data || [])
        setServices(servRes.data || [])
      } catch (err) {
        console.error('Failed to load services', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => (mounted = false)
  }, [])

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className=" from-indigo-600 to-indigo-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold">Book Trusted Home Services Near You</h1>
            <p className="mt-3 text-lg">Cleaning, Plumbing, Electrical — professionals at your doorstep.</p>

            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="flex rounded-lg overflow-hidden shadow">
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="flex-1 py-3 px-4 text-gray-900"
                    placeholder="Search services, e.g. 'Tap Repair'"
                  />
                  <button className="bg-white text-indigo-600 px-5">Search</button>
                </div>
                <div className="mt-3 text-sm text-amber-300">Try: Bathroom Cleaning, Tap Repair, Fan Installation</div>
              </div>
            </div>

          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {/* Categories */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Top Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-4 text-center text-gray-500">Loading categories...</div>
            ) : (
              categories.map(cat => (
                <div key={cat.id} className="bg-white rounded-lg p-4 flex items-center gap-3 shadow">
                  <div className="w-12 p-8 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">{cat.name[0]}</div>
                  <div>
                    <div className="font-semibold">{cat.name}</div>
                    <div className="text-sm text-gray-500">{cat.description}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Popular Services */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Popular Services</h2>
            <a href="/services" className="text-indigo-600">View all</a>
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="text-gray-500">Loading services...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {filtered.slice(0, 9).map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-16 bg-white rounded-lg p-6 shadow">
          <h3 className="text-xl font-semibold">How it works</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">1</div>
              <h4 className="font-semibold">Search & Book</h4>
              <p className="text-sm text-gray-500 mt-2">Find the service and pick a slot.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">2</div>
              <h4 className="font-semibold">Provider Accepts</h4>
              <p className="text-sm text-gray-500 mt-2">A verified provider accepts and arrives on time.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">3</div>
              <h4 className="font-semibold">Rate & Review</h4>
              <p className="text-sm text-gray-500 mt-2">Give feedback and help others choose better.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10">
          <div className="bg-indigo-600 text-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h4 className="text-xl font-bold">Are you a service provider?</h4>
              <p className="mt-1 text-indigo-100">Join now and get job requests in your area.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <a href="/provider/signup" className="bg-white text-indigo-600 px-4 py-2 rounded-md font-semibold">Become a Provider</a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
