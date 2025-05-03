import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Hero = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen">
      {/* Background image overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-80" />
        <img
          src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80"
          alt="Car Damage Assessment"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative h-full px-4 py-32 sm:px-6 sm:py-40 lg:py-48 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col justify-center">
          <div className="text-center">
            <div className="space-y-4">
              <div className="inline-block p-2 bg-indigo-500/10 rounded-lg backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-indigo-300">
                  Instant Garage Recommendations
                </h2>
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Find the Perfect Garage</span>
                <span className="block bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                  For Your Car Repairs
                </span>
              </h1>
            </div>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300 backdrop-blur-sm bg-black/10 p-4 rounded-lg">
              Upload photos of your car damage and get instant AI-powered analysis. We'll match you with specialized repair shops in your area.
            </p>
            {!user && (
              <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12 space-x-4">
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/50"
                >
                  Get Started
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'AI Damage Detection',
              description: 'Advanced AI identifies 14 different types of car damage',
              icon: '🔍'
            },
            {
              title: 'Expert Matching',
              description: 'Connect with specialized garages for your specific damage',
              icon: '🎯'
            },
            {
              title: 'Verified Garages',
              description: 'All repair shops are vetted and quality-assured',
              icon: '✓'
            }
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;