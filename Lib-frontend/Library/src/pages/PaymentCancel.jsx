export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
        <p className="text-gray-700 dark:text-gray-300">Your payment was cancelled. Please try again.</p>
        <a href="/" className="mt-4 inline-block bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700">
          Go Home
        </a>
      </div>
    </div>
  );
}
