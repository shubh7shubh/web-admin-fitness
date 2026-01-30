'use client';

import { motion } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Instagram,
  Mail,
  RefreshCw,
  TrendingUp,
  Trophy,
  Crown,
  Zap,
  Clock,
  Calendar,
  Check,
  Sparkles,
  Send,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Header, Footer } from '@/components/marketing';
import { useState } from 'react';

const cycles = [
  { label: 'Bulk', weight: '75kg', type: 'gain' },
  { label: 'Cut', weight: '60kg', type: 'loss' },
  { label: 'Bulk', weight: '75kg', type: 'gain' },
];

const contactOptions = [
  {
    icon: Instagram,
    title: 'Instagram DM',
    subtitle: 'Fastest Response',
    description: 'Slide into my DMs for quick questions and daily motivation.',
    responseTime: '< 2 hours',
    cta: 'Message @shhubh7',
    href: 'https://www.instagram.com/shhubh7?igsh=MXN2ZWx1eWo5OXBzZw==',
    gradient: 'from-purple-500 via-pink-500 to-orange-500',
    external: true,
  },
  {
    icon: Mail,
    title: 'Email',
    subtitle: 'Detailed Questions',
    description: 'For longer questions, plan customization, or technical issues.',
    responseTime: '< 24 hours',
    cta: 'shhubh7shhubh@gmail.com',
    href: 'mailto:shhubh7shhubh@gmail.com',
    gradient: 'from-emerald-500 to-cyan-500',
    external: false,
  },
  {
    icon: MessageCircle,
    title: 'Community',
    subtitle: 'Learn Together',
    description: 'Join others on the same journey. Share wins and stay motivated.',
    responseTime: 'Active 24/7',
    cta: 'Join Now',
    href: '/onboarding',
    gradient: 'from-blue-500 to-indigo-500',
    external: false,
  },
];

const premiumBenefits = [
  { icon: MessageCircle, title: 'Priority DM Access', description: 'Jump to the front of the queue' },
  { icon: Calendar, title: 'Weekly Check-ins', description: 'Personalized progress reviews' },
  { icon: Zap, title: 'Plan Adjustments', description: 'Diet & workout tweaks on demand' },
];

export default function SupportPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create mailto link with form data
    const subject = encodeURIComponent(`Support Request from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoLink = `mailto:shhubh7shhubh@gmail.com?subject=${subject}&body=${body}`;

    // Open email client
    window.location.href = mailtoLink;

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    }, 500);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-emerald-900 to-cyan-900 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full filter blur-[100px]" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500 rounded-full filter blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/50 border border-emerald-500/50 rounded-full mb-8"
            >
              <Heart className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Real Support, Real People</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-6xl font-bold text-white mb-6"
            >
              You're Not Alone
              <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                In This Journey
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Every question answered. Every doubt cleared.
              <span className="text-emerald-400 font-semibold"> Direct access to someone who's been there.</span>
            </motion.p>
          </div>
        </section>

        {/* Creator Journey Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Meet Your Guide</h2>
              <p className="text-gray-600">Not a faceless brand. A real person who's done what you're trying to do.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border-2 border-purple-100"
            >
              <div className="text-center mb-8">
                <RefreshCw className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  "Did it Again. And Again."
                </h3>
              </div>

              {/* Cycle Visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-8"
              >
                {cycles.map((cycle, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`px-4 py-2 rounded-xl ${
                        cycle.type === 'gain'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      <span className="text-xs font-medium block">{cycle.label}</span>
                      <span className="text-xl font-bold">{cycle.weight}</span>
                    </div>
                    {index < cycles.length - 1 && (
                      <TrendingUp
                        className={`w-5 h-5 mx-2 ${
                          cycles[index + 1].type === 'gain' ? 'text-emerald-500' : 'text-orange-500 rotate-180'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </motion.div>

              <div className="text-center mb-8">
                <p className="text-lg text-gray-700 mb-2">
                  Bulked to 75kg, cut to 60kg, back to 75kg —
                  <span className="font-bold text-purple-600"> 3 complete cycles.</span>
                </p>
                <p className="text-gray-600">
                  Same system every time.
                  <span className="font-semibold text-gray-900"> That's how I know it works.</span>
                </p>
              </div>

              <div className="text-center">
                <Link
                  href="https://www.instagram.com/shhubh7?igsh=MXN2ZWx1eWo5OXBzZw=="
                  target="_blank"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white px-8 py-6 text-lg rounded-xl font-semibold shadow-lg shadow-purple-500/25 transition-all hover:scale-105"
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    @shhubh7 - See My Full Journey
                  </Button>
                </Link>
                <p className="text-sm text-gray-500 mt-3">Real transformations. Real timeline. No filters.</p>
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              {[
                { icon: Trophy, text: '3x Transformation' },
                { icon: TrendingUp, text: '45kg to 75kg Journey' },
              ].map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md"
                >
                  <badge.icon className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Options Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Want Instant Results? <span className="text-emerald-600">Connect.</span>
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Choose how you want to reach out. Every message gets a personal response.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {contactOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${option.gradient} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{option.title}</h3>
                  <span className="text-sm text-gray-500">{option.subtitle}</span>
                  <p className="text-gray-600 text-sm mt-3 mb-4">{option.description}</p>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      Response: <span className="font-semibold text-gray-700">{option.responseTime}</span>
                    </span>
                  </div>
                  <Link href={option.href} target={option.external ? '_blank' : undefined}>
                    <Button variant="outline" className="w-full font-semibold">
                      {option.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Quick Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Send a Quick Message</h3>
                <p className="text-gray-600 text-center mb-6 text-sm">
                  Join and message for full personalized guidance
                </p>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Message Sent!</h4>
                    <p className="text-gray-600 text-sm">I'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white"
                        required
                      />
                    </div>
                    <Textarea
                      placeholder="How can I help you today?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-white min-h-[100px]"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white py-6 font-semibold"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Message
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Premium Support CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-purple-900 to-emerald-900">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full mb-6">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-300">Premium Support</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Get Personalized Help</h2>
              <p className="text-gray-300 max-w-xl mx-auto">
                Want dedicated attention? Premium members get direct access to customized guidance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid sm:grid-cols-3 gap-6 mb-12"
            >
              {premiumBenefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm">{benefit.description}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <Link href="/premium">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-10 py-7 text-lg rounded-xl font-bold shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Premium Support
                </Button>
              </Link>
              <p className="text-gray-400 text-sm mt-4">100% money-back guarantee if you're not satisfied</p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
