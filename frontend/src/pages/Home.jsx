function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">
          LabCare
        </h1>

        <p className="text-slate-500 mb-6">
          Medical Laboratory Management System
        </p>

        <a
          href="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  )
}

export default Home