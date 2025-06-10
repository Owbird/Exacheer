import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=32&width=32"
              width={32}
              height={32}
              alt="Exacheer Logo"
              className="rounded-md bg-purple-600"
            />
            <span className="text-xl font-bold">
              Exacheer<span className="text-purple-600">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#"
              className="text-sm font-medium hover:text-purple-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium hover:text-purple-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-purple-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium hover:text-purple-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div>
            <Link href="/sign-in">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your AI Co-Pilot for{" "}
                <span className="text-purple-600">Examiners</span>
              </h1>
              <p className="text-lg text-slate-600">
                Exacheer helps examiners create, collaborate, and secure exams
                faster with AI-powered question generation and automation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Get Started for Free
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] w-full">
              <Image
                src="/images/hero-illustration.png"
                fill
                alt="AI assistant helping a teacher with exam creation"
                className="object-contain"
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-center items-center">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Watch Our Demo
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              See Exacheer in action and discover how it can transform your exam
              creation process.
            </p>
          </div>

          <iframe
            style={{
              borderRadius: 25,
              marginTop: 25,
              boxShadow: "5px 10px 10px blue",
            }}
            width="560"
            height="315"
            src="https://www.youtube.com/embed/DQ49w8iJ6n0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </section>

        {/* Feature Highlights */}
        <section id="features" className="bg-white py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built for Educators Who Deserve Better Tools
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Powerful features designed to make exam creation efficient,
                collaborative, and secure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="py-20 bg-gradient-to-b from-slate-50 to-white"
        >
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Three simple steps to transform your exam creation process
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm h-full flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                      <span className="text-xl font-bold text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Educators Are Saying
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Trusted by examiners across institutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      {testimonial.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-slate-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-600 italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-2xl mx-auto">
              Let Exacheer handle the heavy lifting so you can focus on
              teaching.
            </h2>
            <Button
              size="lg"
              className="bg-white text-purple-700 hover:bg-slate-100"
            >
              Start Setting Exams Smarter
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-slate-900 text-slate-300 py-12">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Image
                    src="/placeholder.svg?height=32&width=32"
                    width={32}
                    height={32}
                    alt="Exacheer Logo"
                    className="rounded-md bg-purple-600"
                  />
                  <span className="text-xl font-bold text-white">
                    Exacheer<span className="text-purple-400">AI</span>
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  AI-powered platform for smarter exam creation and management.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-sm hover:text-purple-400 transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#features"
                      className="text-sm hover:text-purple-400 transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm hover:text-purple-400 transition-colors"
                    >
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm hover:text-purple-400 transition-colors"
                    >
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Contact</h4>
                <ul className="space-y-2 text-sm">
                  <li>hello@exacheer.com</li>
                  <li>+1 (555) 123-4567</li>
                  <li>123 Education Ave, Suite 100</li>
                  <li>San Francisco, CA 94107</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Newsletter</h4>
                <p className="text-sm text-slate-400 mb-4">
                  Stay updated with the latest features and releases.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Your email"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 mt-12 pt-6 text-center text-sm text-slate-500">
              © 2025 Exacheer. Built with love for educators.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Data
const features = [
  {
    title: "AI Question Generator",
    description:
      "Generate high-quality questions from your syllabus or topic with a single click.",
    icon: ({ className }: { className?: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2H2v10h10V2Z" />
        <path d="M5 5h4" />
        <path d="M5 8h4" />
        <path d="M18.5 2.5 2 19" />
        <path d="M18 9.24A6.16 6.16 0 0 1 22 14.5c0 3.59-3.13 6.5-7 6.5-3.17 0-5.92-2.13-6.75-5.09" />
      </svg>
    ),
  },
  {
    title: "Collaborative Exam Builder",
    description:
      "Work together with colleagues to create and review exams in real-time.",
    icon: ({ className }: { className?: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Smart Difficulty Tuning",
    description:
      "Automatically adjust question difficulty to match your desired exam level.",
    icon: ({ className }: { className?: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20v-6" />
        <path d="M6 20V10" />
        <path d="M18 20V4" />
      </svg>
    ),
  },
  {
    title: "Secure Question Shuffling",
    description:
      "Create multiple exam versions with randomized questions to prevent cheating.",
    icon: ({ className }: { className?: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
      </svg>
    ),
  },
  {
    title: "Instant Grading & Analytics",
    description:
      "Automatically grade exams and gain insights into student performance.",
    icon: ({ className }: { className?: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    title: "Customizable Templates",
    description:
      "Choose from a variety of exam templates or create your own custom design.",
    icon: ({ className }: { className?: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
];

const steps = [
  {
    title: "Input topic or upload syllabus",
    description:
      "Simply enter your exam topic or upload your syllabus document to get started.",
  },
  {
    title: "Review AI-generated questions",
    description:
      "Our AI generates high-quality questions that you can review, edit, or regenerate.",
  },
  {
    title: "Publish or assign your exam securely",
    description:
      "Distribute your exam securely to students with multiple versions to prevent cheating.",
  },
];

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "University Professor",
    initials: "SJ",
    quote:
      "Exacheer has cut my exam preparation time in half while improving the quality of my assessments.",
  },
  {
    name: "Mark Williams",
    role: "High School Teacher",
    initials: "MW",
    quote:
      "The AI question generator is remarkable. It creates questions I wouldn't have thought of myself.",
  },
  {
    name: "Prof. Lisa Chen",
    role: "Department Head",
    initials: "LC",
    quote:
      "Our entire department now uses Exacheer. The collaborative features have transformed how we work.",
  },
];
