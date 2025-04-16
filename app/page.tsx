"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { HeroSection } from "@/components/layout/hero-section"
import { FeaturesSection } from "@/components/layout/feature-section"
import { HowItWorksSection } from "@/components/layout/work-section"
import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import { ModelCards } from "@/components/layout/modal-cards"
export default function Home() {
  // Animation controls for each section
  const heroControls = useAnimation()
  const featuresControls = useAnimation()
  const workControls = useAnimation()
  const footerControls = useAnimation()

  // Refs to detect when sections are in view
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [workRef, workInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [footerRef, footerInView] = useInView({ threshold: 0.1, triggerOnce: true })

  // Trigger animations when sections come into view
  useEffect(() => {
    if (heroInView) {
      heroControls.start("visible")
    }
    if (featuresInView) {
      featuresControls.start("visible")
    }
    if (workInView) {
      workControls.start("visible")
    }
    if (footerInView) {
      footerControls.start("visible")
    }
  }, [
    heroInView,
    featuresInView,
    workInView,
    footerInView,
    heroControls,
    featuresControls,
    workControls,
    footerControls,
  ])

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <main className="min-h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Header />
      </motion.div>

      <motion.div ref={heroRef} animate={heroControls} initial="hidden" variants={fadeInUp}>
        <HeroSection />
      </motion.div>
      <motion.div ref={heroRef} animate={heroControls} initial="hidden" variants={fadeInUp}>
        <ModelCards />
      </motion.div>

      <motion.div ref={featuresRef} animate={featuresControls} initial="hidden" variants={staggerContainer}>
        <FeaturesSection />
      </motion.div>

      <motion.div ref={workRef} animate={workControls} initial="hidden" variants={staggerContainer}>
        <HowItWorksSection />
      </motion.div>

      <motion.div ref={footerRef} animate={footerControls} initial="hidden" variants={fadeInUp}>
        <Footer />
      </motion.div>
    </main>
  )
}
