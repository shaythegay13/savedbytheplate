
import { Card, CardContent } from "@/components/ui/card";

const MissionSection = () => {
  return (
    <section className="py-16 bg-sbtp-beige">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-sbtp-green-800 mb-4">Our Mission & Vision</h2>
            <div className="w-20 h-1 bg-sbtp-green-500 mx-auto"></div>
          </div>
          
          <Card className="mb-8 border-sbtp-green-300 bg-white">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-sbtp-green-700 mb-3 flex items-center">
                <span className="w-8 h-8 flex items-center justify-center bg-sbtp-green-500 text-white rounded-full mr-3">
                  M
                </span>
                Our Mission
              </h3>
              <p className="text-sbtp-brown-500">
                Saved by the Plate empowers individuals to make informed food choices by connecting them to local food sources and sustainable agriculture education with the long-term goal of shifting consumer food acquisition patterns towards local options like farmers' markets or growing food themselves.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-sbtp-green-300 bg-white">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-sbtp-green-700 mb-3 flex items-center">
                <span className="w-8 h-8 flex items-center justify-center bg-sbtp-green-500 text-white rounded-full mr-3">
                  V
                </span>
                Our Vision
              </h3>
              <p className="text-sbtp-brown-500">
                A future where every community has access to fresh, locally grown food and the knowledge to sustain it.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
