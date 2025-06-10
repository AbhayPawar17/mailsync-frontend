"use client"
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  X,
  Sparkles,
  Brain,
  Zap,
  Shield,
  ArrowRight,
  Star,
  Mail,
  Clock,
  Filter,
  MessageSquare,
  Calendar,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AIEmailLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [testimonialDirection, setTestimonialDirection] = useState(1)
  
  // Refs for scroll animations
  const featuresRef = useRef(null)
  const howItWorksRef = useRef(null)
  const testimonialsRef = useRef(null)
  const faqRef = useRef(null)
  const ctaRef = useRef(null)
  
  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      image: "https://admissionsight.com/wp-content/uploads/2023/09/shutterstock_2212201005.jpg",
      quote: "EmailSync AI has transformed how I manage my inbox. I save at least 2 hours every day with their smart categorization and AI replies.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Startup Founder",
      company: "InnovateLabs",
      image: "https://img.freepik.com/premium-photo/woman-smiling-while-wearing-hat-standing-sunset_961147-10745.jpg",
      quote: "As a founder, I receive hundreds of emails daily. This AI tool has been a game-changer for my productivity and response time.",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Sales Executive",
      company: "GlobalSales Inc.",
      image: "https://tse4.mm.bing.net/th/id/OIP.rQnbppbz72t-E08T3kPd0QHaGx?w=700&h=640&rs=1&pid=ImgDetMain",
      quote: "The priority inbox feature ensures I never miss important client emails. The AI suggestions for replies are surprisingly personal and accurate.",
      rating: 5
    },
    {
      name: "David Rodriguez",
      role: "Operations Manager",
      company: "LogiFlow",
      image: "https://thetyee.ca/WhatWorks/2023/11/14/MassTimberJustinBrown.JPG",
      quote: "The automation features have reduced my email processing time by 70%. I can finally focus on strategic work instead of inbox management.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Product Manager",
      company: "DesignHub",
      image: "https://richardsonlab.mcdb.ucsb.edu/sites/default/files/styles/medium_square/public/2021-07/Katie-web.jpg?itok=RufcKzo7",
      quote: "The AI's ability to understand context and suggest relevant replies is incredible. It feels like having a personal assistant for email.",
      rating: 5
    }
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3)
    }, 3000)

    // Enhanced testimonial animation
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => {
        const next = (prev + testimonialDirection + testimonials.length) % testimonials.length
        return next
      })
    }, 4000)

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px"
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
          entry.target.classList.remove('opacity-0')
          entry.target.classList.add('opacity-100')
        }
      })
    }, observerOptions)

    // Observe all sections
    const sections = [
      featuresRef.current,
      howItWorksRef.current,
      testimonialsRef.current,
      faqRef.current,
      ctaRef.current
    ]

    sections.forEach(section => {
      if (section) observer.observe(section)
    })

    return () => {
      clearInterval(interval)
      clearInterval(testimonialInterval)
      observer.disconnect()
    }
  }, [testimonialDirection , testimonials.length])

  const aiFeatures = [
    {
      title: "Smart Categorization",
      description: "AI automatically sorts emails into Work, Personal, Promotions, and Custom categories",
      emails: [
        { subject: "Q4 Budget Review", category: "Work", priority: "high" },
        { subject: "Weekend Plans", category: "Personal", priority: "low" },
        { subject: "50% Off Sale", category: "Promotions", priority: "medium" },
      ],
    },
    {
      title: "AI Suggestions",
      description: "Get intelligent recommendations for replies, actions, and email management",
      suggestions: [
        "Schedule meeting for next Tuesday",
        "Mark as important and follow up",
        "Auto-reply with vacation message",
      ],
    },
    {
      title: "Priority Inbox",
      description: "AI learns your patterns and highlights the most important emails first",
      priorities: [
        { from: "CEO@company.com", subject: "Urgent: Board Meeting", score: 95 },
        { from: "client@bigcorp.com", subject: "Project Deadline", score: 88 },
        { from: "team@startup.com", subject: "Weekly Update", score: 72 },
      ],
    },
  ]

  const features = [
    {
      title: "Smart Email Categorization",
      description: "Our AI automatically sorts your emails into relevant categories, helping you focus on what matters most.",
      icon: <Filter className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-100"
    },
    {
      title: "AI-Powered Replies",
      description: "Generate intelligent responses with a single click, saving you time while maintaining your personal tone.",
      icon: <MessageSquare className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-100"
    },
    {
      title: "Priority Inbox",
      description: "Our AI learns what's important to you and prioritizes emails that need your immediate attention.",
      icon: <Star className="w-6 h-6 text-amber-500" />,
      color: "bg-amber-100"
    },
    {
      title: "Calendar Integration",
      description: "Automatically detect meeting requests and add them to your calendar with smart scheduling suggestions.",
      icon: <Calendar className="w-6 h-6 text-green-500" />,
      color: "bg-green-100"
    },
    {
      title: "Email Summaries",
      description: "Get concise AI-generated summaries of long emails so you can quickly grasp the key points.",
      icon: <Mail className="w-6 h-6 text-red-500" />,
      color: "bg-red-100"
    },
    {
      title: "Time-Saving Automation",
      description: "Create custom rules and workflows that automate repetitive email tasks based on your preferences.",
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      color: "bg-orange-100"
    }
  ]

  const howItWorks = [
    {
      title: "Connect Your Email Accounts",
      description: "Securely link your Gmail, Outlook, Yahoo, or Office 365 accounts with just a few clicks.",
      step: "01"
    },
    {
      title: "AI Analyzes Your Patterns",
      description: "Our AI learns your email habits, priorities, and preferences to provide personalized assistance.",
      step: "02"
    },
    {
      title: "Experience Email Automation",
      description: "Let the AI handle email sorting, prioritization, and suggested replies while you focus on what matters.",
      step: "03"
    }
  ]

  const faqs = [
    {
      question: "How secure is my email data?",
      answer: "We use bank-level encryption and never store your email content. Our AI processes emails in real-time without saving sensitive information. All connections use OAuth 2.0 for maximum security."
    },
    {
      question: "Which email providers are supported?",
      answer: "EmailSync AI supports Gmail, Outlook, Yahoo Mail, Office 365, and most IMAP-enabled email providers. We're constantly adding support for more providers based on user requests."
    },
    {
      question: "How does the AI learn my preferences?",
      answer: "Our AI analyzes your email patterns, response times, and actions to understand your priorities. It learns from your behavior without accessing personal content, ensuring privacy while improving accuracy."
    },
    {
      question: "Can I use this on mobile devices?",
      answer: "Yes! EmailSync AI works seamlessly across all devices. We have dedicated mobile apps for iOS and Android, plus a responsive web interface that works perfectly on tablets and phones."
    },
    {
      question: "What happens if I want to cancel?",
      answer: "You can cancel anytime with just one click. There are no cancellation fees, and you'll retain access to your account until the end of your billing period. We also offer a 14-day free trial."
    },
    {
      question: "How accurate are the AI suggestions?",
      answer: "Our AI achieves 95%+ accuracy in email categorization and 90%+ accuracy in reply suggestions. The system continuously learns from your feedback to improve over time."
    }
  ]

  // Company logos data
const companyLogos = [
  { name: "Adobe", logo: "ADOBE" },
  { name: "Airtable", logo: "AIRTABLE" },
  { name: "Amazon", logo: "AMAZON" },
  { name: "Box", logo: "BOX" },
  { name: "ByteDance", logo: "BYTEDANCE" },
  { name: "Chase", logo: "CHASE" },
  { name: "CloudBees", logo: "CLOUDBEES" },
  { name: "Heroku", logo: "HEROKU" },
  { name: "BMW", logo: "BMW" },
  { name: "Burton", logo: "BURTON" },
  { name: "BuildKite", logo: "BUILDKITE" },
  { name: "CouchBase", logo: "COUCHBASE" },
  { name: "DailyMotion", logo: "DAILYMOTION" },
  { name: "Deliveroo", logo: "DELIVEROO" },
]

  const toggleFAQ = (index : number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const nextTestimonial = () => {
    setTestimonialDirection(1)
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setTestimonialDirection(-1)
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div
          className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-3xl transform transition-all duration-2000 ${isVisible ? "translate-x-0 translate-y-0" : "translate-x-full -translate-y-full"}`}
        />
        <div
          className={`absolute top-32 left-0 w-80 h-80 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 blur-3xl transform transition-all duration-2000 delay-300 ${isVisible ? "translate-x-0" : "-translate-x-full"}`}
        />
        <div
          className={`absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-3xl transform transition-all duration-2000 delay-500 ${isVisible ? "translate-x-0 translate-y-0" : "translate-x-full translate-y-full"}`}
        />

        {/* Floating AI Elements */}
        <div className="absolute top-20 left-1/4 animate-pulse">
          <Sparkles className="w-6 h-6 text-blue-400 opacity-60" />
        </div>
        <div className="absolute top-40 right-1/3 animate-pulse delay-1000">
          <Brain className="w-8 h-8 text-purple-400 opacity-60" />
        </div>
        <div className="absolute bottom-32 left-1/3 animate-pulse delay-2000">
          <Zap className="w-5 h-5 text-green-400 opacity-60" />
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EmailSync AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              How It Works
            </a>
            <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              FAQ
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Testimonials
            </a>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              Sign In
            </Button>
            <Link href="/sync-mail">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-4 py-2 rounded cursor-pointer">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl border-t z-30 rounded-b-2xl">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block py-2 text-gray-700 font-medium">
                Features
              </a>
              <a href="#how-it-works" className="block py-2 text-gray-700 font-medium">
                How It Works
              </a>
              <a href="#faq" className="block py-2 text-gray-700 font-medium">
                FAQ
              </a>
              <a href="#testimonials" className="block py-2 text-gray-700 font-medium">
                Testimonials
              </a>
              <div className="pt-4 space-y-2">
                <Button variant="ghost" className="w-full">
                  Sign In
                </Button>
                <Link href="/sync-mail">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-4 py-2 rounded cursor-pointer">
                Get Started
              </button>
            </Link>
            </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div
              className={`transform transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
              <div className="mb-6">
                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 mb-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Email Management
                </Badge>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
                Email chaos
                <br />
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    solved by AI
                  </span>
                  <div className="absolute bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
                Connect your Gmail, Outlook, Yahoo, or Office 365. Our AI automatically categorizes emails, suggests
                smart replies, and prioritizes what matters most to you.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Bank-level Security</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Instant Setup</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Smart AI Learning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Auto-Suggestions</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                <Input
                  placeholder="Enter your email to get started..."
                  className="flex-1 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-4">Free 14-day trial • No credit card required • Cancel anytime</p>
            </div>

            {/* Right Content - AI Email Dashboard */}
            <div
              className={`relative transform transition-all duration-1000 delay-500 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
            >
              <div className="relative mx-auto max-w-lg">
                {/* Main Dashboard */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transform hover:scale-105 transition-all duration-500 relative before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-blue-500/10 before:to-purple-500/10 before:blur-xl before:-z-10">
                  {/* Dashboard Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">AI Email Assistant</span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Connected Accounts</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg border border-red-100">
                          <div className="w-9 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm">
 <Image
    src="https://workolyk.com/wp-content/uploads/2021/09/Outlook-icone.png"
    alt="Outlook Icon"
    width={36}  
    height={36} 
    className="object-cover"
  />                          </div>
                          <span className="text-sm font-medium">Outlook</span>
                        </div>
                        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              <Image
                                src="https://i.pinimg.com/736x/8f/c3/7b/8fc37b74b608a622588fbaa361485f32.jpg"
                                alt="Custom Domain Icon"
                                width={36}  
                                height={36} 
                                className="object-cover rounded-lg"
                              />
                          </div>
                          <span className="text-sm font-medium">Custom Domain</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Features Showcase */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">AI Insights</h4>
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                                currentStep === i ? "bg-blue-500 scale-125" : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Dynamic AI Feature Display with Fixed Height */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 min-h-[200px] relative overflow-hidden">
                        <div className="flex items-start space-x-3 h-full">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div key={currentStep} className="animate-in fade-in-0 slide-in-from-right-4 duration-500">
                              <h5 className="font-medium text-gray-900 mb-1">{aiFeatures[currentStep].title}</h5>
                              <p className="text-sm text-gray-600 mb-3">{aiFeatures[currentStep].description}</p>

                              <div className="space-y-2">
                                {currentStep === 0 && (
                                  <div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
                                    {aiFeatures[0]?.emails?.map((email, i) => (
                                      <div
                                        key={i}
                                        className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                      >
                                        <span className="text-xs font-medium truncate flex-1 mr-2">
                                          {email.subject}
                                        </span>
                                        <Badge
                                          className={`text-xs flex-shrink-0 ${
                                            email.category === "Work"
                                              ? "bg-blue-100 text-blue-700 border-blue-200"
                                              : email.category === "Personal"
                                                ? "bg-green-100 text-green-700 border-green-200"
                                                : "bg-orange-100 text-orange-700 border-orange-200"
                                          }`}
                                        >
                                          {email.category}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {currentStep === 1 && (
                                  <div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
                                    {aiFeatures[1]?.suggestions?.map((suggestion, i) => (
                                      <div
                                        key={i}
                                        className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                      >
                                        <Zap className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                        <span className="text-xs flex-1">{suggestion}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {currentStep === 2 && (
                                  <div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
                                    {aiFeatures[2]?.priorities?.map((email, i) => (
                                      <div
                                        key={i}
                                        className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                      >
                                        <div className="flex-1 min-w-0 mr-3">
                                          <div className="text-xs font-medium truncate">{email.subject}</div>
                                          <div className="text-xs text-gray-500 truncate">{email.from}</div>
                                        </div>
                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                          <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000 ease-out"
                                              style={{ width: `${email.score}%` }}
                                            />
                                          </div>
                                          <span className="text-xs font-medium w-8 text-right">{email.score}%</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              {/* Floating Email Provider Icons */}
             <div className="fixed inset-0 pointer-events-none z-20 overflow-visible">
                {/* Gmail - Top */}
                <div className="absolute -top-[10vh] right-[0vw] animate-float delay-100">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-2xl hover:scale-125 transition-all cursor-pointer">
                    <Image 
                      src="https://www.pngall.com/wp-content/uploads/12/Gmail-Logo-PNG-Images.png" 
                      alt="Gmail Logo" 
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                    <div className="absolute inset-0 bg-red-400 rounded-xl animate-ping opacity-20" />
                  </div>
                </div>

                {/* Yahoo - Right */}
                <div className="absolute top-[60vh] -right-[5vw] animate-float delay-300">
                  <div className="w-12 h-12 bg rounded-xl flex items-center justify-center shadow-1xl hover:scale-125 transition-all cursor-pointer">
                    <Image 
                      src="https://i0.wp.com/lopezdoriga.com/wp-content/uploads/2015/09/Yahoo-Mail-tendr%C3%A1-nuevas-funciones-de-b%C3%BAsqueda-3.png?fit=1024%2C1024&ssl=1" 
                      alt="Yahoo Mail Logo" 
                      width={48}
                      height={48}
                      className="w-12 h-12"
                    />
                    <div className="absolute inset-0 bg-purple-400 rounded-xl animate-ping opacity-20" />
                  </div>
                </div>

                {/* Office 365 - Bottom */}
                <div className="absolute bottom-[10vh] left-[50vw] animate-float delay-700">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-2xl hover:scale-125 transition-all cursor-pointer">
                    <Image 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg/1200px-Microsoft_Office_logo_%282019%E2%80%93present%29.svg.png" 
                      alt="Office 365 Logo" 
                      width={40}
                      height={40}
                      className="w-10 h-10"
                    />
                    <div className="absolute inset-0 bg-orange-400 rounded-xl animate-ping opacity-20" />
                  </div>
                </div>

                {/* Outlook - Left */}
                <div className="absolute bottom-[20vh] -left-[5vw] animate-float delay-500">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-2xl hover:scale-125 transition-all cursor-pointer">
                    <Image 
                      src="https://workolyk.com/wp-content/uploads/2021/09/Outlook-icone.png" 
                      alt="Outlook Logo" 
                      width={64}
                      height={48}
                      className="w-16 h-12"
                    />
                    <div className="absolute inset-0 bg-blue-400 rounded-xl animate-ping opacity-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

    {/* Trusted Companies Section */}
<section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50 relative z-10 overflow-hidden">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-8">
      <p className="text-gray-600 font-medium">Trusted by teams at leading companies</p>
    </div>
    
    {/* First row - moving left */}
    <div className="relative overflow-hidden mb-8">
      <div className="flex animate-scroll-left space-x-12 whitespace-nowrap">
        {[...companyLogos, ...companyLogos].map((company, index) => (
          <div
            key={`${company.name}-${index}`}
            className="flex-shrink-0 flex items-center justify-center"
          >
            <Image
              src={`https://logo.clearbit.com/${company.name.toLowerCase()}.com`} 
              alt={company.name}
              height={32}
              width={100}
              className="h-8 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"

            />
          </div>
        ))}
      </div>
    </div>

    {/* Second row - moving right */}
    <div className="relative overflow-hidden">
      <div className="flex animate-scroll-right space-x-12 whitespace-nowrap">
        {[...companyLogos.reverse(), ...companyLogos].map((company, index) => (
          <div
            key={`${company.name}-reverse-${index}`}
            className="flex-shrink-0 flex items-center justify-center"
          >
            <Image 
              src={`https://logo.clearbit.com/${company.name.toLowerCase()}.com`} 
              alt={company.name}
              width={100}
              height={32}
              className="h-8 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"

            />
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative z-10">
        <div 
          ref={featuresRef}
          className="max-w-7xl mx-auto opacity-0 transition-all duration-1000 transform translate-y-8"
        >
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Email Management</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent features help you take control of your inbox and save hours every week.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-blue-100 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50 relative z-10">
        <div 
          ref={howItWorksRef}
          className="max-w-7xl mx-auto opacity-0 transition-all duration-1000 transform translate-y-8"
        >
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How EmailSync AI Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our simple three-step process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div 
                key={step.title}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute -right-4 -top-4 text-8xl font-bold text-gray-100">{step.step}</div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 mb-6">{step.description}</p>
                  <div className="flex items-center text-blue-600 font-medium">
                    <span>Learn more</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50 relative z-10">
        <div 
          ref={testimonialsRef}
          className="max-w-7xl mx-auto opacity-0 transition-all duration-1000 transform translate-y-8"
        >
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 mb-4">
              <Star className="w-4 h-4 mr-2" />
              Testimonials
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of professionals who have transformed their email workflow.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Testimonial Cards Container */}
            <div className="relative overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.name} className="w-full flex-shrink-0">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-blue-100 mx-2">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-blue-100">
                          <Image
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            width={500}  // Set appropriate width
                            height={500} // Set appropriate height
                          />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <div className="flex items-center justify-center md:justify-start mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                          <p className="text-xl md:text-2xl text-gray-700 italic mb-6 leading-relaxed">
                            "{testimonial.quote}"
                          </p>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-1">{testimonial.name}</h4>
                            <p className="text-gray-600 font-medium">{testimonial.role}</p>
                            <p className="text-blue-600 font-semibold">{testimonial.company}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeTestimonial === index 
                      ? 'bg-blue-600 scale-125 shadow-lg' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-6 max-w-xs mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-1 rounded-full transition-all duration-700 ease-in-out"
                  style={{ width: `${((activeTestimonial + 1) / testimonials.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

     

        {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative z-10">
        <div 
          ref={faqRef}
          className="max-w-4xl mx-auto opacity-0 transition-all duration-1000 transform translate-y-8"
        >
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 mb-4">
              <MessageSquare className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Got Questions? We've Got Answers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about EmailSync AI and how it can transform your email workflow.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? (
                      <Minus className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Contact Support
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EmailSync AI</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="text-center mt-8 text-sm">
            <p>&copy; {new Date().getFullYear()} EmailSync AI. All rights reserved.</p>
          </div>
        </div>
      </footer>


      {/* Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }

        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 35s linear infinite;
        }

        .animate-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 3.5s ease-in-out infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
      `}</style>
    </div>
  )
}
