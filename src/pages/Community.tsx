
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Sample Discord channels
const channels = [
  {
    name: "Farming",
    description: "Discuss traditional and modern farming techniques for both rural and urban settings.",
    memberCount: 1240,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-600"><path d="M4 11.5V6a1 1 0 0 1 1-1h5"></path><path d="M20 11.5V6a1 1 0 0 0-1-1h-5"></path><path d="M12 6v3.5"></path><path d="m3 21 8.5-8.5"></path><path d="m13 12 8.5 8.5"></path><path d="M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path><path d="M15 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path></svg>
    )
  },
  {
    name: "Gardening",
    description: "Exchange gardening tips, tricks, and best practices for growing your own food.",
    memberCount: 2340,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-600"><path d="M7 20h10"></path><path d="M10 20c1.5 0 3.485-2.857 4-6.5"></path><path d="M14 20c-1.5 0-2.5-5.5-2.5-9s1-7 3-8c1 1 2 2 2.5 5s.5 4 .5 7-1 5-3 5Z"></path></svg>
    )
  },
  {
    name: "Educational Q&A",
    description: "Ask questions and get answers about sustainable agriculture and local food systems.",
    memberCount: 1875,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-green-600"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z"></path><path d="M10 7v10"></path><path d="m15 7-3 5 3 5"></path></svg>
    )
  }
];

// Sample regional channels
const regions = [
  {
    name: "Northeast",
    description: "Connect with community members from the Northeastern United States.",
    memberCount: 890,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-blue"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="M9 15v-3"></path><path d="M9 15h3"></path><path d="m15 9-3 3"></path></svg>
    )
  },
  {
    name: "Southeast",
    description: "Connect with community members from the Southeastern United States.",
    memberCount: 1050,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-blue"><circle cx="12" cy="12" r="10"></circle><path d="m15 15-6-6"></path><path d="M15 9v6"></path><path d="M9 15h6"></path></svg>
    )
  },
  {
    name: "Central",
    description: "Connect with community members from the Central United States.",
    memberCount: 780,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-blue"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>
    )
  },
  {
    name: "Northwest",
    description: "Connect with community members from the Northwestern United States.",
    memberCount: 920,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-blue"><circle cx="12" cy="12" r="10"></circle><path d="m9 9 6 6"></path><path d="M15 9v6"></path><path d="M9 9h6"></path></svg>
    )
  },
  {
    name: "Southwest",
    description: "Connect with community members from the Southwestern United States.",
    memberCount: 750,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sbtp-blue"><circle cx="12" cy="12" r="10"></circle><path d="m9 15 6-6"></path><path d="M9 15v-6"></path><path d="M15 9h-6"></path></svg>
    )
  }
];

const Community = () => {
  return (
    <div className="min-h-screen bg-sbtp-beige">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sbtp-green-700 to-sbtp-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Join Our Community</h1>
            <p className="text-xl mb-6">
              Connect with like-minded individuals passionate about sustainable food systems and local agriculture.
            </p>
            <div className="bg-white/10 p-6 rounded-lg inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M7.5 7.2c.3-.4 2.9-2.5 4.5-2.5 1.6.1 3 .7 4.9 2.5"></path><path d="M7.5 16.8c.3.4 2.9 2.5 4.5 2.5 1.6-.1 3-.7 4.9-2.5"></path><path d="M15.5 17c.3 1.3.2 2.5-1.5 4.5"></path><path d="M8.5 17c-.3 1.3-.2 2.5 1.5 4.5"></path><path d="M12 4v16"></path><path d="M20 10c0-4.4-1.8-6-4-6-2 0-4.5 2-4.5 2-1 .5-5 .5-6 0 0 0-2.5-2-4.5-2-2.5 0-4 2-4 6 0 4.1 2 8 2 8 1.4 1.4 4.5 3 7.5 3v-3h2v3c3 0 6.1-1.6 7.5-3 0 0 2-3.9 2-8z"></path></svg>
              <div className="text-left">
                <h3 className="font-semibold">Discord Community</h3>
                <p className="text-sm opacity-80">5,000+ members and growing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topic Channels Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-sbtp-green-800 mb-2">Topic Channels</h2>
            <p className="text-sbtp-brown-500 mb-8">Join discussions organized by specific topics related to sustainable agriculture.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {channels.map((channel, index) => (
                <Card key={index} className="border-sbtp-green-200">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="bg-sbtp-green-100 p-3 rounded-full">
                        {channel.icon}
                      </div>
                      <div>
                        <CardTitle className="text-sbtp-green-700 text-xl">{channel.name}</CardTitle>
                        <CardDescription className="text-xs text-sbtp-brown-500">
                          {channel.memberCount.toLocaleString()} members
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sbtp-brown-500 text-sm">{channel.description}</p>
                    <Button asChild className="w-full mt-4 bg-sbtp-green-500 hover:bg-sbtp-green-600">
                      <a href="https://discord.com" target="_blank" rel="noopener noreferrer">Join Channel</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="text-3xl font-bold text-sbtp-green-800 mb-2">Regional Channels</h2>
            <p className="text-sbtp-brown-500 mb-8">Connect with people in your geographic region to discuss local growing conditions and resources.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region, index) => (
                <Card key={index} className="border-sbtp-green-200">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="bg-sbtp-blue/20 p-3 rounded-full">
                        {region.icon}
                      </div>
                      <div>
                        <CardTitle className="text-sbtp-green-700 text-xl">{region.name}</CardTitle>
                        <CardDescription className="text-xs text-sbtp-brown-500">
                          {region.memberCount.toLocaleString()} members
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sbtp-brown-500 text-sm">{region.description}</p>
                    <Button asChild className="w-full mt-4 bg-sbtp-blue hover:bg-sbtp-blue/80">
                      <a href="https://discord.com" target="_blank" rel="noopener noreferrer">Join Region</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join Discord CTA */}
      <section className="py-12 bg-sbtp-green-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-sbtp-green-800 mb-6">Ready to Join the Conversation?</h2>
            <p className="text-lg text-sbtp-brown-700 mb-8">
              Our Discord server is a vibrant community of gardeners, farmers, educators, and food enthusiasts sharing knowledge and inspiration.
            </p>
            <Button asChild className="bg-sbtp-green-600 hover:bg-sbtp-green-700 text-white text-lg py-6 px-10">
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 inline-block"><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M7.5 7.2c.3-.4 2.9-2.5 4.5-2.5 1.6.1 3 .7 4.9 2.5"></path><path d="M7.5 16.8c.3.4 2.9 2.5 4.5 2.5 1.6-.1 3-.7 4.9-2.5"></path><path d="M15.5 17c.3 1.3.2 2.5-1.5 4.5"></path><path d="M8.5 17c-.3 1.3-.2 2.5 1.5 4.5"></path><path d="M12 4v16"></path><path d="M20 10c0-4.4-1.8-6-4-6-2 0-4.5 2-4.5 2-1 .5-5 .5-6 0 0 0-2.5-2-4.5-2-2.5 0-4 2-4 6 0 4.1 2 8 2 8 1.4 1.4 4.5 3 7.5 3v-3h2v3c3 0 6.1-1.6 7.5-3 0 0 2-3.9 2-8z"></path></svg>
                Join our Discord
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
