const Features = () => {
    const features = [
      {
        title: 'AI-Powered Damage Detection',
        description: 'Upload a photo of your car damage and get instant analysis using advanced machine learning.',
        icon: '🤖'
      },
      {
        title: 'Smart Garage Matching',
        description: 'Get matched with garages that specialize in your specific type of damage.',
        icon: '🔍'
      },
      {
        title: 'Verified Repair Shops',
        description: 'All garages in our network are verified and rated by real customers.',
        icon: '✅'
      }
    ];
  
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Smart Car Damage Solutions
            </p>
          </div>
          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.title} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Features;