// src/components/UI/Spinner.jsx
// Usage: <Spinner /> or <Spinner fullScreen />
export default function Spinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]">
        <SpinnerIcon />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center py-16">
      <SpinnerIcon />
    </div>
  );
}

function SpinnerIcon() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#2a2a2a] border-t-[#ae7aff]" />
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  );
}