export default function NotFound() {
  return (
    <div className=" ml-40 flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <h1 className="text-8xl font-extrabold text-blue-600">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-800">
        Page Not Found
      </h2>
      <p className="mt-2 text-center text-gray-600">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <a
        href="/home"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white shadow hover:bg-blue-700 transition"
      >
        Back to Home
      </a>
    </div>
  );
}
