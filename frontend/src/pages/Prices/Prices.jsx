import { useEffect, useState } from 'react'
import api from '../../services/api'

function Prices() {
  const [tests, setTests] = useState([])
  const [search, setSearch] = useState('')
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchTests = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/test', {
        params: {
          search,
        },
      })

      const fetchedTests = response.data.tests || []

      setTests(fetchedTests)

      const priceMap = {}

      fetchedTests.forEach((test) => {
        priceMap[test._id] = test.price
      })

      setPrices(priceMap)
    } catch (error) {
      console.error('GET PRICES ERROR:', error)

      setError(
        error.response?.data?.message ||
          'Failed to load test prices'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTests()
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const handlePriceChange = (id, value) => {
    setPrices((previous) => ({
      ...previous,
      [id]: value,
    }))

    setSuccess('')
  }

  const handleSave = async (test) => {
    const price = Number(prices[test._id])

    if (
      prices[test._id] === '' ||
      prices[test._id] === undefined ||
      Number.isNaN(price) ||
      price < 0
    ) {
      setError('Please enter a valid price')
      return
    }

    try {
      setSavingId(test._id)
      setError('')
      setSuccess('')

      await api.put(`/test/${test._id}`, {
        price,
      })

      setTests((previous) =>
        previous.map((item) =>
          item._id === test._id
            ? {
                ...item,
                price,
              }
            : item
        )
      )

      setSuccess(
        `${test.name} price updated successfully`
      )
    } catch (error) {
      console.error('UPDATE PRICE ERROR:', error)

      setError(
        error.response?.data?.message ||
          'Failed to update price'
      )
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Test Pricing
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage laboratory test prices
        </p>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by test name, ID or short name..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading prices...
          </div>
        ) : tests.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-gray-700">
              No tests found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try another search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Test
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Test ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Current Price
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {tests.map((test) => (
                  <tr
                    key={test._id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {test.name}
                      </p>

                      {test.shortName && (
                        <p className="mt-1 text-xs text-gray-500">
                          {test.shortName}
                        </p>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {test.testId}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {test.category}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">

                        <span className="text-sm text-gray-500">
                          ₹
                        </span>

                        <input
                          type="number"
                          min="0"
                          value={prices[test._id] ?? ''}
                          onChange={(e) =>
                            handlePriceChange(
                              test._id,
                              e.target.value
                            )
                          }
                          className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">

                      <button
                        type="button"
                        onClick={() => handleSave(test)}
                        disabled={savingId === test._id}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingId === test._id
                          ? 'Saving...'
                          : 'Save'}
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}

export default Prices