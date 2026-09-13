//import React from 'react'

import NavBar from "../components/layout/NavBar"
import Footer from "../components/landing/Footer"
import Hero from "../components/landing/Hero"
import Features from "../components/landing/Features"
import Testimonials from "../components/landing/Testimonials"

const LandingPage = () => {
  return (
    <div>
      <NavBar />
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default LandingPage
