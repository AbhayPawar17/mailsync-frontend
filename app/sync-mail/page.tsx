"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface EmailService {
  icon: string
  title: string
  description: string
  provider: string
  link: string
  color: string
}

export default function SyncMail() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const emailServices: EmailService[] = [
    {
      icon: "https://workolyk.com/wp-content/uploads/2021/09/Outlook-icone.png",
      title: "Connect With Outlook",
      description: "Sync this mail with application to organize mail in Outlook",
      provider: "outlook",
      link: "https://ai.l4it.net/l4mailapp/connect.php",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: "https://www.pngall.com/wp-content/uploads/12/Gmail-Logo-PNG-Images.png",
      title: "Connect With Gmail",
      description: "Sync your Gmail account to manage all your emails",
      provider: "gmail",
      link: "https://ai.l4it.net/l4mailapp/connect.php",
      color: "from-red-400 to-red-600",
    },
    {
      icon: "https://i.pinimg.com/736x/8f/c3/7b/8fc37b74b608a622588fbaa361485f32.jpg",
      title: "Custom Domain Email",
      description: "Connect your business domain email (e.g., yourname@yourcompany.com)",
      provider: "domain",
      link: "https://ai.l4it.net/l4mailapp/connect.php",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: "https://online.iotap.in/content/images/thumbs/0000294_office-365-e3_550.jpeg",
      title: "Office 365 Email",
      description: "Connect your Office 365 business email account",
      provider: "office365",
      link: "https://ai.l4it.net/l4mailapp/connect.php",
      color: "from-orange-400 to-orange-600",
    },
    {
      icon: "https://i0.wp.com/lopezdoriga.com/wp-content/uploads/2015/09/Yahoo-Mail-tendr%C3%A1-nuevas-funciones-de-b%C3%BAsqueda-3.png?fit=1024%2C1024&ssl=1",
      title: "Yahoo Mail",
      description: "Connect your Yahoo Mail account",
      provider: "yahoo",
      link: "https://ai.l4it.net/l4mailapp/connect.php",
      color: "from-yellow-400 to-yellow-600",
    },
  ]

  const handleServiceClick = (provider: string) => {
    setSelectedProvider(provider)
  }

  const handleConfirmSync = () => {
    console.log("Sync confirmed with provider:", selectedProvider)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-6 text-white">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="mb-6 flex justify-center"
            >
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center relative overflow-hidden border-4 border-white/30">
                <Image
                  src="http://mailsync.l4it.net:4000/_next/image?url=%2FLogo.png&w=96&q=75"
                  alt="Sync Icon"
                  width={75}
                  height={60}
                  className="object-contain brightness-200"
                />
              </div>
            </motion.div>

            <h2 className="text-3xl font-bold">Sync Your Email</h2>
            <p className="mt-2 text-white/80">
              Connect your accounts with <span className="font-bold text-yellow-300">L4IT</span> for seamless
              synchronization
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emailServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => handleServiceClick(service.provider)}
                className={`relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer ${
                  selectedProvider === service.provider
                    ? "ring-2 ring-offset-2 ring-violet-500 shadow-lg shadow-violet-200 dark:shadow-violet-900/20"
                    : "border border-gray-100 dark:border-gray-700 hover:shadow-md"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 transition-opacity duration-300 ${
                    selectedProvider === service.provider ? "opacity-10" : "group-hover:opacity-5"
                  }`}
                />

                <div className="flex items-start space-x-4 p-4 relative z-10">
                  <div className="flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-14 h-14 relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-2 shadow-sm"
                    >
                      <Image
                        src={service.icon || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-contain p-1"
                      />
                    </motion.div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{service.description}</p>
                  </div>
                  {selectedProvider === service.provider && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center text-white"
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium cursor-pointer"
            >
              Cancel
            </motion.button>

            <Link href="http://mailsync.l4it.net/api/auth" passHref>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleConfirmSync}
                disabled={!selectedProvider}
                className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                  selectedProvider
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                {selectedProvider ? "Connect Now" : "Select a Provider"}
              </motion.button>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-gray-900 dark:to-gray-800 p-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Powered by{" "}
            <span className="font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              L4IT
            </span>{" "}
            © 2025. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
