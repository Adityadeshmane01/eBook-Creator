import { TESTIMONIALS } from "../../utils/data";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  return (
    <div
      id="testimonials"
      className="relative overflow-hidden bg-linear-to-br from-violet-50 via-white to-purple-50 py-24"
    >
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6 hover:shadow-md transition-all duration-300">
            <Star className="w-5 h-5 text-violet-600 fill-violet-600" />
            <span className="text-sm font-semibold text-violet-900">
              Testimonials
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
            Loved by Creators
            <span className="block bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Everywhere
            </span>
          </h2>

          <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed">
            Don't just take our word for it. Here's what our users have to say
            about their experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => {
            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Quote Icon */}
                <div className="absolute -top-6 -left-5 z-20 w-16 h-16 bg-linear-to-br from-violet-600 to-purple-600 rounded-2xl rotate-6 flex items-center justify-center shadow-lg shadow-violet-300/40 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
                  <Quote className="w-8 h-8 text-white" />
                </div>

                {/* Card */}
                <div className="relative h-full overflow-hidden rounded-3xl bg-white border border-gray-200/80 p-10 pt-12 shadow-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-violet-200/50 group-hover:border-violet-200">
                  {/* Hover Gradient Background */}
                  <div className="absolute inset-0 bg-linear-to-br from-violet-50/0 via-transparent to-purple-50/0 group-hover:from-violet-50/70 group-hover:to-purple-50/70 transition-all duration-500 pointer-events-none"></div>

                  <div className="relative z-10">
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-7">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-6 h-6 text-violet-600 fill-violet-600 transition-transform duration-300 group-hover:scale-110"
                          style={{
                            transitionDelay: `${i * 50}ms`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-lg leading-8 text-gray-700 mb-10 min-h-36.25">
                      "{testimonial.quote}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {/* Avatar Glow */}
                        <div className="absolute inset-0 rounded-full bg-linear-to-r from-violet-500 to-purple-500 blur-md opacity-20 group-hover:opacity-50 transition-opacity duration-300"></div>

                        <img
                          className="relative w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                          src={testimonial.avatar}
                          alt={testimonial.author}
                        />
                      </div>

                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {testimonial.author}
                        </p>
                        <p className="text-gray-500">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center group">
            <div className="text-4xl md:text-5xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300">
              50K+
            </div>
            <div className="mt-2 text-gray-500 font-medium">
              Happy Creators
            </div>
          </div>

          <div className="text-center group">
            <div className="text-4xl md:text-5xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300">
              4.9/5
            </div>
            <div className="mt-2 text-gray-500 font-medium">
              Average Rating
            </div>
          </div>

          <div className="text-center group">
            <div className="text-4xl md:text-5xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300">
              100K+
            </div>
            <div className="mt-2 text-gray-500 font-medium">
              Ebooks Created
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;