import { useEffect, useState } from "react";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Replace with your actual user ID logic

    fetch(`http://localhost:8082/reservations/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reservations");
        return res.json();
      })
      .then((data) => setReservations(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Reservations
      </h1>

      {loading && <p className="text-gray-600 dark:text-gray-300">Loading reservations...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {!loading && reservations.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">No reservations found.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {reservation.book.title}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Author: {reservation.book.author}
            </p>
            <p
              className={`mt-2 font-medium ${
                reservation.status === "BORROWED"
                  ? "text-blue-600 dark:text-blue-400"
                  : reservation.status === "RESERVED"
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              Status: {reservation.status}
            </p>
            {reservation.dueDate && (
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Due Date: {new Date(reservation.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationsPage;
