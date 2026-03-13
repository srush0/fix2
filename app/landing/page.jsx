'use client';

import Link from 'next/link';
import { Zap, Droplet, Sparkles, Wind, Wrench, Truck, Shield, Clock, Star, CircleCheck as CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import ServiceCard from '@/components/ServiceCard';
import ChatWidget from '@/components/ChatWidget';
import AudioAssistant from '@/components/AudioAssistant';

const services = [
  { icon: Zap, title: 'Electrician', price: '299', rating: '4.8' },
  { icon: Droplet, title: 'Plumber', price: '249', rating: '4.7' },
  { icon: Sparkles, title: 'Cleaning', price: '499', rating: '4.9' },
  { icon: Wind, title: 'AC Repair', price: '399', rating: '4.6' },
  { icon: Wrench, title: 'Appliance Repair', price: '349', rating: '4.8' },
  { icon: Truck, title: 'Delivery Helper', price: '199', rating: '4.5' },
];

const cities = ['Mumbai', 'Pune', 'Nashik', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'];

const testimonials = [
  {
    name: 'Priya Sharma',
    city: 'Mumbai',
    text: 'Fixoo helped me find a plumber within 30 minutes. Excellent service!',
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    city: 'Pune',
    text: 'Very professional electricians. Fixed my wiring issue quickly.',
    rating: 5,
  },
  {
    name: 'Anita Desai',
    city: 'Nashik',
    text: 'Best cleaning service ever. The team was punctual and thorough.',
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-blue-100 text-[#2D4FE0] rounded-full text-sm font-semibold">
                India's #1 Hyperlocal Service Platform
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-[#111827] leading-tight">
                Find Trusted Local Services
                <span className="text-[#2D4FE0]"> Instantly</span>
              </h1>

              <p className="text-xl text-gray-600">
                Electricians, plumbers, cleaners, and repair experts near you. Book in seconds, get service in minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking">
                  <Button className="bg-[#2D4FE0] hover:bg-[#1e3bc4] text-lg px-8 py-6">
                    Book a Service
                  </Button>
                </Link>
                <Link href="/login-provider">
                  <Button variant="outline" className="text-lg px-8 py-6 border-2">
                    Become a Provider
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-[#2D4FE0]">50K+</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#2D4FE0]">5K+</div>
                  <div className="text-sm text-gray-600">Service Providers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#2D4FE0]">4.8★</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.pexels.com/photos/5691527/pexels-photo-5691527.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Service Professional"
                  className="rounded-3xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#2D4FE0] rounded-full opacity-10 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#8C3CFF] rounded-full opacity-10 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">Popular Services</h2>
            <p className="text-xl text-gray-600">Expert services at your doorstep</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <Link key={idx} href="/booking">
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  price={service.price}
                  rating={service.rating}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#F38C00] to-[#d97a00]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0">
              <h3 className="text-3xl font-bold mb-2">Emergency Service Available 24/7</h3>
              <p className="text-lg opacity-90">Get instant help for urgent repairs</p>
            </div>
            <Link href="/booking">
              <Button className="bg-white text-[#F38C00] hover:bg-gray-100 text-lg px-8 py-6">
                Call Emergency Service
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">How Fixoo Works</h2>
            <p className="text-xl text-gray-600">Simple, fast, and reliable</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle, title: 'Select Service', desc: 'Choose from our wide range of services' },
              { icon: Clock, title: 'Get Matched', desc: 'We connect you with nearby verified professionals' },
              { icon: Shield, title: 'Job Done', desc: 'Service completed with satisfaction guarantee' },
            ].map((step, idx) => (
              <Card key={idx} className="p-8 text-center hover:shadow-xl transition">
                <div className="w-16 h-16 fixoo-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">Cities We Serve</h2>
            <p className="text-xl text-gray-600">Expanding across India</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cities.map((city, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-lg transition cursor-pointer">
                <MapPin className="w-8 h-8 text-[#2D4FE0] mx-auto mb-2" />
                <h3 className="font-semibold text-[#111827]">{city}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real reviews from real people</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="p-6 hover:shadow-xl transition">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.text}</p>
                <div>
                  <h4 className="font-semibold text-[#111827]">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.city}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#111827] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Fixoo</h3>
              <p className="text-gray-400">Your Local Problem Solver</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Electrician</li>
                <li>Plumber</li>
                <li>Cleaning</li>
                <li>AC Repair</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@fixoo.in</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Fixoo. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ChatWidget />
      <AudioAssistant />
    </div>
  );
}
