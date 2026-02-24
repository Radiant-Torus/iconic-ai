import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  company: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  result: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "John Martinez",
    company: "Martinez HVAC Solutions",
    role: "Owner",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    content:
      "Radiant Torus transformed our lead generation. We went from 2-3 leads per week to 15-20 qualified leads. The quality is incredible and our close rate improved by 40%.",
    rating: 5,
    result: "15-20 leads/week",
  },
  {
    id: 2,
    name: "Sarah Thompson",
    company: "Thompson Plumbing Co",
    role: "Operations Manager",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content:
      "The Google Maps audit alone saved us thousands in wasted ad spend. We optimized our presence and saw a 35% increase in phone calls within the first month.",
    rating: 5,
    result: "+35% phone calls",
  },
  {
    id: 3,
    name: "Mike Chen",
    company: "Chen's Electrical Services",
    role: "Marketing Director",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    content:
      "The Meta ads audit revealed we were hemorrhaging money on the wrong audiences. After implementing the recommendations, our ROAS improved from 2:1 to 5:1 in 30 days.",
    rating: 5,
    result: "ROAS: 2:1 → 5:1",
  },
  {
    id: 4,
    name: "Lisa Rodriguez",
    company: "Rodriguez HVAC Group",
    role: "CEO",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    content:
      "Best investment we made for our business. The AI-powered insights are like having a team of consultants working 24/7. Our revenue increased by 60% in 3 months.",
    rating: 5,
    result: "+60% revenue",
  },
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Loved by HVAC & Service Businesses
          </h2>
          <p className="text-xl text-slate-600">
            See how Radiant Torus helped real businesses grow their revenue
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-slate-200">
          {/* Rating */}
          <div className="flex gap-1 mb-4">
            {[...Array(currentTestimonial.rating)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>

          {/* Quote */}
          <p className="text-xl text-slate-700 mb-6 leading-relaxed italic">
            "{currentTestimonial.content}"
          </p>

          {/* Result Highlight */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-6 border border-pink-200">
            <p className="text-sm text-slate-600 font-semibold">
              RESULT ACHIEVED
            </p>
            <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {currentTestimonial.result}
            </p>
          </div>

          {/* Author */}
          <div className="flex items-center gap-4">
            <img
              src={currentTestimonial.image}
              alt={currentTestimonial.name}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-slate-900">
                {currentTestimonial.name}
              </p>
              <p className="text-sm text-slate-600">
                {currentTestimonial.role} at {currentTestimonial.company}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            onClick={goToPrevious}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 w-8"
                    : "bg-slate-300 w-2"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={goToNext}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Counter */}
        <p className="text-center text-sm text-slate-600 mt-4">
          {currentIndex + 1} of {testimonials.length}
        </p>
      </div>
    </section>
  );
}
