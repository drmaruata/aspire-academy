import { AdmissionBanner } from "@/components/layout/admission-banner";
import { TopBar } from "@/components/layout/top-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";

import { Hero } from "@/components/sections/hero";
import { OurCoursesMini } from "@/components/sections/our-courses-mini";
import { Courses } from "@/components/sections/courses";
import { WhyChoose } from "@/components/sections/why-choose";
import { Testimonials } from "@/components/sections/testimonials";
import { WebinarRoadmap } from "@/components/sections/webinar-roadmap";
import { Resources } from "@/components/sections/resources";
import { VideoStats } from "@/components/sections/video-stats";
import { Videos } from "@/components/sections/videos";
import { Newsletter } from "@/components/sections/newsletter";
import { Contact } from "@/components/sections/contact";

import { getCourses } from "@/lib/content/courses";
import { getTestimonials } from "@/lib/content/testimonials";
import { getVideos } from "@/lib/content/videos";
import { getResources } from "@/lib/content/resources";

export default async function HomePage() {
  const [courses, testimonials, videos, resources] = await Promise.all([
    getCourses(),
    getTestimonials(),
    getVideos(),
    getResources(),
  ]);

  return (
    <>
      <AdmissionBanner />
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <OurCoursesMini />
        <Courses courses={courses} />
        <WhyChoose />
        <Testimonials testimonials={testimonials} />
        <WebinarRoadmap />
        <Resources resources={resources} />
        <VideoStats />
        <Videos videos={videos} />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
