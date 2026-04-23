import CleanupStatsGrid from "./CleanupStatsGrid";
import AdminQrCodeGenerator from "./AdminQrCodeGenerator";

export default function AdminDashboard() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 md:p-6">
      <header className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
        <h1 className="text-2xl font-bold text-slate-800">EchoChic Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Track cleanup impact and generate QR codes for physical products.
        </p>
      </header>

      <CleanupStatsGrid />
      <AdminQrCodeGenerator />
    </main>
  );
}
