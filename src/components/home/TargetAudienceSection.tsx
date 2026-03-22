
import { Card, CardContent } from "@/components/ui/card";

const audiences = [
  {
    title: "Urban & Suburban Individuals",
    description: "People interested in food justice and sustainable living in cities and suburbs.",
    iconColor: "bg-sbtp-green-500"
  },
  {
    title: "Schools & Educators",
    description: "Teachers and institutions seeking curriculum-aligned resources on sustainable agriculture.",
    iconColor: "bg-sbtp-blue"
  },
  {
    title: "Local Farmers & Producers",
    description: "Food producers looking to connect directly with consumers in their communities.",
    iconColor: "bg-sbtp-brown-300"
  },
  {
    title: "Community Organizations",
    description: "Groups promoting local food systems and community-based agriculture initiatives.",
    iconColor: "bg-sbtp-yellow"
  },
  {
    title: "Social Media Users",
    description: "Individuals interested in sharing and learning about localizing food consumption.",
    iconColor: "bg-sbtp-green-600"
  }
];

const TargetAudienceSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-sbtp-green-800 mb-4">Who We Serve</h2>
          <p className="text-sbtp-brown-500 max-w-2xl mx-auto">
            Saved by the Plate Inc. brings together diverse communities interested in sustainable food systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <Card key={index} className="border-sbtp-green-200 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className={`${audience.iconColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sbtp-green-700 mb-2">{audience.title}</h3>
                    <p className="text-sm text-sbtp-brown-500">{audience.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;
