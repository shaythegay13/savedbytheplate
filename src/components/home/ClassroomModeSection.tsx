import { Monitor, Award, Users, Mic } from "lucide-react";

const ClassroomModeSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-green-50 to-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <Monitor className="h-4 w-4" />
              New: Classroom Mode
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">
              Turn Your Garden Into a<br />Collaborative Classroom
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Classroom Mode lets teachers broadcast Jane's gardening advice to the whole group. 
              Students report their plant's progress back to the AI, earn digital badges for milestones, 
              and learn together — whether they're in the garden or in the classroom.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mic className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">Group Voice Sessions</h4>
                  <p className="text-sm text-gray-600">
                    Broadcast Jane's advice to the whole class. Students ask questions hands-free while gardening.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">Digital Badges & Progress</h4>
                  <p className="text-sm text-gray-600">
                    Students earn badges for planting, composting, and harvest milestones — making learning visible and rewarding.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">Collaborative Learning Loop</h4>
                  <p className="text-sm text-gray-600">
                    Students report their plant's progress to Jane. The AI learns from the whole class and gives better, localized advice over time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-green-100">
            <div className="bg-green-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Monitor className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-green-800">Classroom Mode — Live</span>
                <span className="ml-auto text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">● Active</span>
              </div>
              <div className="bg-white rounded-lg p-4 mb-3 border border-green-200">
                <p className="text-sm text-gray-600 italic">
                  "Great question, class! Tomatoes need at least 6 hours of sunlight. Let's check your garden plot — 
                  which side gets the most afternoon sun?"
                </p>
                <p className="text-xs text-green-600 mt-2 font-medium">— Jane, AI Garden Assistant</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="h-3 w-3" />
                <span>24 students listening</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <Award className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-green-800">First Seed</p>
                <p className="text-xs text-gray-500">12 earned</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <Award className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-green-800">Soil Scientist</p>
                <p className="text-xs text-gray-500">8 earned</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <Award className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-green-800">Harvest Hero</p>
                <p className="text-xs text-gray-500">3 earned</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassroomModeSection;
