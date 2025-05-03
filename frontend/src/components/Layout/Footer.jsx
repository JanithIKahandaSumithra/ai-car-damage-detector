import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const { user } = useAuth();

  // Define links based on user status
  const getFooterLinks = () => {
    // Not logged in links
    if (!user) {
      return {
        quickLinks: [
          { name: 'Home', to: '/' },
          { name: 'Login', to: '/login' },
          { name: 'Register', to: '/register' }
        ],
        services: [
          { name: 'Damage Detection', to: '/login' },
          { name: 'Find Garages', to: '/login' },
          { name: 'Garage Registration', to: '/register' }
        ]
      };
    }

    // Customer links
    if (user.userType === 'customer') {
      return {
        quickLinks: [
          { name: 'Dashboard', to: '/customer' },
          { name: 'Upload Image', to: '/customer/upload' },
          { name: 'My Bookings', to: '/customer/bookings' },
          { name: 'Chat', to: '/customer/chat' }
        ],
        services: [
          { name: 'Damage Detection', to: '/customer/upload' },
          { name: 'View Garages', to: '/customer/garages' },
          { name: 'Detection History', to: '/customer/history' }
        ]
      };
    }

    // Garage owner links
    return {
      quickLinks: [
        { name: 'Dashboard', to: '/garage' },
        { name: 'Register Garage', to: '/garage/register' },
        { name: 'Manage Bookings', to: '/garage/bookings' },
        { name: 'Chat', to: '/garage/chat' }
      ],
      services: [
        { name: 'Garage Management', to: '/garage' },
        { name: 'Booking Management', to: '/garage/bookings' }
      ]
    };
  };

  const links = getFooterLinks();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div>
            <Link to="/" className="text-xl font-bold text-white">
              CarCare Navigator
            </Link>
            <p className="mt-4 text-sm text-gray-400 max-w-xs">
              AI-powered car damage detection and garage recommendation system
            </p>
            {!user && (
              <div className="mt-4 space-x-4">
                <Link
                  to="/login"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Sign In
                </Link>
                <span className="text-gray-400">|</span>
                <Link
                  to="/register"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {links.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {links.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} CarCare Navigator. All rights reserved.
          </p>
          
          {user && (
            <div className="mt-4 md:mt-0 text-sm text-gray-400">
              Logged in as: {user.username} ({user.userType === 'customer' ? 'Customer' : 'Garage Owner'})
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;