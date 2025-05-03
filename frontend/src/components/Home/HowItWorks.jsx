const HowItWorks = () => {
    const steps = [
      {
        title: 'Take a Photo',
        description: 'Snap a clear photo of your car damage using your smartphone.',
        icon: '📸'
      },
      {
        title: 'Get Analysis',
        description: 'Our AI system analyzes the damage and identifies the repair needs.',
        icon: '🔍'
      },
      {
        title: 'Find Garages',
        description: 'Get matched with nearby garages that specialize in your repair needs.',
        icon: '🔧'
      },
      {
        title: 'Book Repair',
        description: 'Choose your preferred garage and schedule your repair.',
        icon: '📅'
      }
    ];
  
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Process
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </p>
          </div>
          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-4 md:gap-x-8 md:gap-y-10">
              {steps.map((step, index) => (
                <div key={step.title} className="relative">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500 text-white text-2xl">
                      {step.icon}
                    </div>
                    <p className="mt-4 text-lg font-medium text-gray-900">{step.title}</p>
                    <p className="mt-2 text-base text-gray-500 text-center">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-8">
                      <div className="h-0.5 w-full bg-gray-300"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default HowItWorks;