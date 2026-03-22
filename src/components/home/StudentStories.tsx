import { Link } from "react-router-dom";
import { Quote, ArrowRight } from "lucide-react";
import studentStoriesImage from "@/assets/student-stories.jpg";

const testimonials = [
  {
    quote: "Before this program, I didn't know you could grow food in the city. Now I help my family grow tomatoes on our fire escape!",
    name: "Student, Age 14",
    program: "6-Week Garden Program, Brooklyn",
  },
  {
    quote: "I learned about composting and why some neighborhoods don't have grocery stores. It changed how I see my block.",
    name: "Student, Age 16",
    program: "Food Justice Workshop, The Bronx",
  },
  {
    quote: "Jane helped me figure out what to plant in my school garden. We grew kale and peppers and shared them with the cafeteria.",
    name: "Student, Age 13",
    program: "Ask Jane AI Garden Planner",
  },
];

const StudentStories = () => {
  return (
    <section className="py-12 sm:py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-3">
            Stories from the Garden
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real voices from students who've experienced the power of growing their own food.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Photo */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src={studentStoriesImage}
              alt="Students working together in a NYC community garden"
              className="w-full h-72 sm:h-80 object-cover"
              loading="lazy"
            />
          </div>

          {/* Testimonials */}
          <div className="space-y-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-5 shadow-sm border border-green-100"
              >
                <Quote className="h-5 w-5 text-green-400 mb-2" />
                <p className="text-foreground italic leading-relaxed mb-3">
                  "{t.quote}"
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-green-800">{t.name}</span>
                  <span className="text-muted-foreground">{t.program}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/education"
            className="inline-flex items-center text-green-700 font-semibold hover:text-green-800 transition-colors"
          >
            Learn about our programs
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StudentStories;
