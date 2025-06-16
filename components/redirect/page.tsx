"use client"

import { motion, useAnimation } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import Cookies from "js-cookie"
import { Mail, CheckCircle, Sparkles, Zap, Shield } from "lucide-react"
import Customloader from "../custom-loader/customloader"

interface RedirectComponentProps {
  provider?: string
}

const BASE_URI = process.env.NEXT_PUBLIC_BASE_URI;

export default function RedirectComponent({ provider }: RedirectComponentProps) {
  const controls = useAnimation()
  const progressControls = useAnimation()
  const [token, setToken] = useState<string>("")
  const [progress, setProgress] = useState<number>(0)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isApiCalled, setIsApiCalled] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Use refs to prevent multiple API calls
  const apiCallRef = useRef(false)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const steps = [
    { icon: Shield, text: "Authenticating...", color: "from-blue-500 to-cyan-500" },
    { icon: Zap, text: "Syncing mail data...", color: "from-purple-500 to-pink-500" },
    { icon: Sparkles, text: "Finalizing setup...", color: "from-green-500 to-emerald-500" },
    { icon: CheckCircle, text: "Complete!", color: "from-emerald-500 to-teal-500" },
  ]

  // Handle token extraction - separate useEffect
  useEffect(() => {
    const tokenFromURL = searchParams.get("token")
    if (tokenFromURL) {
      setToken(tokenFromURL)
      Cookies.set("authToken", tokenFromURL, {
        expires: 7,
        secure: false,
        sameSite: "Lax",
        path: "/",
      })
    } else {
      console.log("Token missing")
    }
  }, [searchParams])

  // Handle animations and API call - separate useEffect that runs only once when token is available
  useEffect(() => {
    if (!token || apiCallRef.current) return

    apiCallRef.current = true

    const sequence = async () => {
      await controls.start({
        scale: [1, 1.05, 1],
        rotate: [0, 2, -2, 0],
        transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
      })
    }

    const progressSequence = async () => {
      await progressControls.start({
        width: "100%",
        transition: { duration: 4, ease: "easeInOut" },
      })

      // Make API call only once
      if (!isApiCalled) {
        setIsApiCalled(true)
        try {
          const response = await fetch(`${BASE_URI}/update_mail`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const result = await response.json();

          if (result.status) {
            setTimeout(() => {
              router.push("/dashboard");
            }, 500);
          } else {
            // Handle API error
            setTimeout(() => {
              router.push("/dashboard");
            }, 500);
          }
        } catch (error) {
          console.error('Error:', error);
          // Fallback redirect if API fails
          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
        }
      }
    }

    const startProgressTracking = () => {
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1.5

          // Update current step based on progress
          if (newProgress >= 25 && currentStep < 1) setCurrentStep(1)
          if (newProgress >= 50 && currentStep < 2) setCurrentStep(2)
          if (newProgress >= 85 && currentStep < 3) setCurrentStep(3)

          if (newProgress >= 100) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current)
              progressIntervalRef.current = null
            }
            return 100
          }
          return newProgress
        })
      }, 80)
    }

    sequence()
    progressSequence()
    startProgressTracking()

    // Cleanup function
    return () => {
      controls.stop()
      progressControls.stop()
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }
    }, [token]) // eslint-disable-line react-hooks/exhaustive-deps


  // Handle progress-based step updates
  useEffect(() => {
    if (progress >= 25 && currentStep < 1) setCurrentStep(1)
    if (progress >= 50 && currentStep < 2) setCurrentStep(2)
    if (progress >= 85 && currentStep < 3) setCurrentStep(3)
  }, [progress, currentStep])

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="relative">
          {/* Animated background rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-0 w-16 h-16 border-2 border-violet-500/30 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-2 w-12 h-12 border-2 border-fuchsia-500/40 rounded-full"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full mx-auto"
          />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="ml-6 text-white/80 font-medium"
          >
            <Customloader/>
          </motion.p>
        </div>
      </div>
    )
  }

  const CurrentIcon = steps[currentStep]?.icon || Mail

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center relative z-10"
      >
        {/* Main animated icon container */}
        <motion.div animate={controls} className="relative mx-auto mb-8">
          {/* Outer glow ring */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 rounded-full blur-xl"
          />

          {/* Middle ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-2 w-28 h-28 border-2 border-gradient-to-r from-cyan-400/40 to-purple-400/40 rounded-full"
          />

          {/* Main icon container */}
          <div className="relative w-32 h-32 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <CurrentIcon className="w-12 h-12 text-white drop-shadow-lg" />
            </motion.div>
          </div>

          {/* Orbiting particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: `linear-gradient(45deg, ${i % 2 === 0 ? "#06b6d4, #3b82f6" : "#f59e0b, #ef4444"})`,
              }}
              animate={{
                x: [0, Math.cos((i * 45 * Math.PI) / 180) * 60],
                y: [0, Math.sin((i * 45 * Math.PI) / 180) * 60],
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Enhanced title with gradient text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-3"
        >
          Syncing Your Email
        </motion.h1>

        {/* Dynamic subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-purple-200/80 mb-12 text-lg"
        >
          {provider ? `Connecting to ${provider}...` : "Setting up your mail synchronization..."}
        </motion.p>

        {/* Enhanced progress section */}
        <div className="w-96 max-w-full mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <motion.span
              key={Math.round(progress)}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-sm font-bold text-cyan-400"
            >
              {Math.round(progress)}%
            </motion.span>
          </div>

          {/* Progress bar with enhanced styling */}
          <div className="relative h-4 bg-slate-800/50 rounded-full overflow-hidden shadow-inner backdrop-blur-sm border border-purple-500/20">
            <motion.div
              animate={progressControls}
              initial={{ width: "0%" }}
              className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-full shadow-lg relative"
            >
              {/* Animated shine effect */}
              <motion.div
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            </motion.div>
          </div>
        </div>

        {/* Enhanced status messages with icons */}
        <motion.div
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="space-y-3"
        >
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center space-x-3"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className={`w-3 h-3 rounded-full bg-gradient-to-r ${steps[currentStep]?.color || "from-violet-500 to-purple-500"}`}
            />
            <span className="text-white/90 font-medium text-lg">{steps[currentStep]?.text || "Initializing..."}</span>
          </motion.div>
        </motion.div>

        {/* Enhanced footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <motion.p
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="text-sm text-purple-300/60"
          >
            Powered by{" "}
            <span className="font-bold bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              L4IT
            </span>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}