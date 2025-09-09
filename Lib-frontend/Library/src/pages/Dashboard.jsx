import { FaBook, FaUsers, FaExchangeAlt, FaMoneyBillWave } from 'react-icons/fa';

const Dashboard = () => {
  // Sample data - replace with real data from your API
  const stats = [
    {
      title: "Total Books",
      value: "5,234",
      icon: <FaBook className="w-6 h-6" />,
      change: "+12%",
      positive: true
    },
    {
      title: "Active Users",
      value: "1,439",
      icon: <FaUsers className="w-6 h-6" />,
      change: "+5%",
      positive: true
    },
    {
      title: "Reservations",
      value: "89",
      icon: <FaExchangeAlt className="w-6 h-6" />,
      change: "-2%",
      positive: false
    },
    {
      title: "Total Fines",
      value: "$1,285",
      icon: <FaMoneyBillWave className="w-6 h-6" />,
      change: "+8%",
      positive: true
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to LibTrack 📚
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Here's what's happening in your library today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/50 transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg text-indigo-600 dark:text-indigo-400">
                {stat.icon}
              </div>
              <span className={`text-sm font-semibold ${
                stat.positive 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ring-1 ring-gray-900/5 dark:ring-gray-700/50">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[
            {
              type: "Book Reservation",
              description: "User reserved 'The Great Gatsby'",
              time: "2 hours ago"
            },
            {
              type: "Fine Payment",
              description: "John Doe paid $15.00 in fines",
              time: "4 hours ago"
            },
            {
              type: "New Registration",
              description: "New member Sarah Smith joined",
              time: "6 hours ago"
            }
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.type}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.description}
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
