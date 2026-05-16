export default function Sightings() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Sightings</h1>
        <p className="mt-4 text-slate-600">
          Track noteworthy wildlife sightings and preserve the location details for each observation.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-xl font-semibold text-slate-900">Field-ready</h2>
            <p className="mt-2 text-slate-600">Quickly log sightings with location context and species details.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-xl font-semibold text-slate-900">Reliable</h2>
            <p className="mt-2 text-slate-600">Keep your wildlife records organized and easy to review.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
