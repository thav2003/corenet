"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { HeroSection } from "@/components/layout/hero-section";
import { FeaturesSection } from "@/components/layout/feature-section";
import { HowItWorksSection } from "@/components/layout/work-section";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { ModelCards } from "@/components/layout/modal-cards";
import { signOut } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getCsrfToken, signIn } from "next-auth/react";
import { SigninMessage } from "@/lib/auth";
import bs58 from "bs58";
export default function Home() {
  // Animation controls for each section
  const heroControls = useAnimation();
  const featuresControls = useAnimation();
  const workControls = useAnimation();
  const footerControls = useAnimation();
  const { signMessage, publicKey, disconnect, connected } = useWallet();
  // Refs to detect when sections are in view
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [workRef, workInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [footerRef, footerInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Trigger animations when sections come into view
  useEffect(() => {
    if (heroInView) {
      heroControls.start("visible");
    }
    if (featuresInView) {
      featuresControls.start("visible");
    }
    if (workInView) {
      workControls.start("visible");
    }
    if (footerInView) {
      footerControls.start("visible");
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
  ]);

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
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const handleDisconnect = async () => {
    try {
      // Disconnect wallet first
      await disconnect();
      // Then sign out from next-auth
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const handleSignIn = async () => {
    try {
      if (!connected) {
        return;
      }

      const csrf = await getCsrfToken();
      if (!publicKey || !csrf || !signMessage) return;

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      });

      const data = new TextEncoder().encode(message.prepare());
      const signature = await signMessage(data);
      const serializedSignature = bs58.encode(signature);

      await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature: serializedSignature,
      });
    } catch (error) {
      handleDisconnect();
      console.log(error);
    }
  };

  useEffect(() => {
    if (connected && status === "unauthenticated") {
      handleSignIn();
    }
  }, [connected]);
  return (
    <main className="min-h-screen flex flex-col bg-black">
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
      <motion.div ref={heroRef} animate={heroControls} initial="hidden" variants={fadeInUp} style={{backgroundImage: `linear-gradient(to right, #111323 0%, #0e0e19 100%)`}}>
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
