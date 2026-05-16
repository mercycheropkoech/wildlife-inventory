import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-700 to-slate-800 py-24">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.35),_transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                Wildlife Management Platform
              </h1>
              <p className="max-w-2xl text-lg text-slate-200">
                Collect sightings, track animal locations, and manage wildlife inventory with an elegant, responsive dashboard.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/animals"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-8 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300 transition"
                >
                  Browse Animals
                </Link>
                <Link
                  to="/add-animal"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:border-cyan-300 hover:text-cyan-200 transition"
                >
                  Add a Location
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-lg">
              <div className="mb-6 flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Live Insights</p>
                  <p className="mt-2 text-3xl font-semibold">Location Tracking</p>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-200">
                  📍
                </span>
              </div>
              <div className="space-y-4 text-slate-300">
                <p className="text-sm leading-7">
                  Add new animal records with precise location context and review them in a clean, modern layout.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <span className="text-xs uppercase text-cyan-300">Primary Color</span>
                    <p className="mt-2 text-xl font-semibold">Teal Blue</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <span className="text-xs uppercase text-cyan-300">Experience</span>
                    <p className="mt-2 text-xl font-semibold">Interactive + Clean</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
