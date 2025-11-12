import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Lightbulb, Target,  } from 'lucide-react';
import generatedVideo from "../assets/generated-video.mp4"
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const videoRef = React.useRef(null);
  const MotionLink = motion(Link);


  const stats = [
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: Users, value: '10K+', label: 'Happy Customers' },
    { icon: Lightbulb, value: '500+', label: 'Products' },
    { icon: Target, value: '50+', label: 'Countries' },
  ];

  const values = [
    {
      icon: '💎',
      title: 'Quality Excellence',
      description: 'We source only the finest materials and partner with master craftsmen to create lighting solutions that stand the test of time.'
    },
    {
      icon: '🎨',
      title: 'Innovative Design',
      description: 'Our design team pushes boundaries, blending classic elegance with contemporary innovation to illuminate your spaces uniquely.'
    },
    {
      icon: '🌍',
      title: 'Sustainability',
      description: 'We are committed to eco-friendly practices, using energy-efficient LED technology and sustainable materials in our products.'
    },
    {
      icon: '🤝',
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We provide personalized service and support to help you find the perfect lighting solution.'
    }
  ];

  const team = [
    {
      name: 'Sarah Anderson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: '20+ years in luxury interior design'
    },
    {
      name: 'Michael Chen',
      role: 'Chief Designer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Award-winning lighting designer'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Expert in sustainable manufacturing'
    },
    {
      name: 'David Thompson',
      role: 'Customer Success',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      bio: 'Dedicated to exceptional service'
    }
  ];

  const milestones = [
    { year: '2010', event: 'Lumiere founded in New York' },
    { year: '2013', event: 'Expanded to 10 countries worldwide' },
    { year: '2016', event: 'Launched sustainable LED collection' },
    { year: '2020', event: 'Reached 10,000+ satisfied customers' },
    { year: '2023', event: 'Opened flagship stores globally' },
    { year: '2025', event: 'Leading luxury lighting brand' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section with Video Background */}
      <section className="relative h-[80vh] sm:h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={generatedVideo} type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content Over Video */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6"
          >
            Illuminating Lives Since <span className="text-amber-400">2010</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200"
          >
            Crafting luxury lighting solutions that transform spaces and inspire emotions
          </motion.p>

          {/* Video Control Button */}
        
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full mb-3 sm:mb-4">
                    <Icon size={24} className="sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 font-semibold">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Our <span className="text-amber-600">Story</span>
              </h2>
              <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed">
                <p>
                  Founded in 2010, Lumiere was born from a simple yet powerful vision: to create lighting that doesn't just illuminate spaces, but transforms them into works of art.
                </p>
                <p>
                  Our founder, Sarah Anderson, a renowned interior designer with over 20 years of experience, recognized a gap in the market for truly luxurious, handcrafted lighting solutions that combined timeless elegance with cutting-edge technology.
                </p>
                <p>
                  What started in a small New York workshop has grown into a global brand, trusted by designers, architects, and homeowners in over 50 countries. Every piece we create is a testament to our commitment to quality, innovation, and sustainability.
                </p>
                <p>
                  Today, Lumiere stands at the forefront of luxury lighting, continuing to push boundaries and set new standards in design excellence.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800"
                alt="Luxury lighting"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-48 h-48 sm:w-64 sm:h-64 bg-amber-500/20 rounded-2xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Core <span className="text-amber-600">Values</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Lumiere
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-4xl sm:text-5xl mb-4">{value.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-amber-600">Journey</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Milestones that shaped Lumiere
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-600"></div>

            <div className="space-y-8 sm:space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col md:gap-8`}
                >
                  <div
                    className={`flex-1 ${
                      index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                    } text-center mb-4 md:mb-0`}
                  >
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 inline-block">
                      <h3 className="text-xl sm:text-2xl font-bold text-amber-600 mb-2">
                        {milestone.year}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 font-semibold">
                        {milestone.event}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-amber-600">Team</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind Lumiere's success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-amber-600 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Illuminate Your Space?
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-amber-50">
              Discover our collection of luxury lighting solutions crafted just for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MotionLink
                to="/products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-amber-600 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:shadow-2xl transition-all duration-300 text-sm sm:text-base"
              >
                Explore Products
              </MotionLink>
              <MotionLink
                to="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:bg-white hover:text-amber-600 transition-all duration-300 text-sm sm:text-base"
              >
                Contact Us
              </MotionLink>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
