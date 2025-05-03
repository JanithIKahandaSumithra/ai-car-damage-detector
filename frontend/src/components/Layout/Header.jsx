import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  console.log('User Object:', user);
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/' },
    ...(user?.userType === 'customer' 
      ? [
          { name: 'Upload Image', href: '/customer/upload' },
          { name: 'View Garages', href: '/customer/garages' },
          { name: 'Detection History', href: '/customer/history' },
          { name: 'My Bookings', href: '/customer/bookings' },
          { name: 'Messages', href: '/customer/chat' }  
        ]
      : user?.userType === 'garage_owner'
      ? [
          { name: 'My Garage', href: '/garage' },
          { name: 'Register Garage', href: '/garage/register' },
          { name: 'Manage Bookings', href: '/garage/bookings' },
          { name: 'Messages', href: '/garage/chat' } 
        ]
      : [])
  ];
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Disclosure as="nav" className="bg-gray-800 navbar">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-white font-bold text-xl">
                    CarCare Navigator
                  </Link>
                </div>
                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="hidden md:flex md:items-center md:space-x-4">
                {user ? (
                  <Menu as="div" className="relative ml-3 z-50">
                    <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
      <span className="sr-only">Open user menu</span>
      <div className="relative">
        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center group hover:bg-indigo-700 transition-colors duration-200">
          <span className="text-white text-lg font-semibold">
            {user && user.username && user.username.trim() !== '' 
              ? user.username.charAt(0).toUpperCase() 
              : <UserCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
            }
          </span>
        </div>
      </div>
    </Menu.Button>

  
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm text-gray-500">Signed in as</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                        </div>

                        {/* Profile Link */}
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={user.userType === 'customer' ? '/customer/profile' : '/garage/profile'}
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } flex items-center px-4 py-2 text-sm text-gray-700`}
                              >
                                <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                Your Profile
                              </Link>
                            )}
                          </Menu.Item>
                        </div>

                        {/* Logout Button */}
                        <div className="py-1 border-t border-gray-100">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } flex w-full items-center px-4 py-2 text-sm text-red-700`}
                              >
                                <svg 
                                  className="mr-3 h-5 w-5 text-red-400" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                                  />
                                </svg>
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {user && (
                <Disclosure.Button
                  as={Link}
                  to={user.userType === 'customer' ? '/customer/profile' : '/garage/profile'}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  <div className="flex items-center">
                    <UserCircleIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                    Your Profile
                  </div>
                </Disclosure.Button>
              )}
              {!user && (
                <>
                  <Disclosure.Button
                    as={Link}
                    to="/login"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Login
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    to="/register"
                    className="bg-indigo-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700"
                  >
                    Register
                  </Disclosure.Button>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;