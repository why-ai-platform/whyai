import { motion } from 'motion/react';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Mail,
  Facebook,
  Instagram
} from 'lucide-react';
import { Button } from '../ui/button';
import logo from '../../logo.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: 'https://x.com/whyyai', label: 'Twitter' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/why-a-i/', label: 'LinkedIn' },
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61582832198293', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/whyai.co.in/', label: 'Instagram' },
  ];

  const footerLinks = {
    product: [
      { label: 'Courses', href: '#' },
      { label: 'Practice Problems', href: '#' },
      { label: 'Contests', href: '#' },
      { label: 'Learning Path', href: '#' },
    ],
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' },
    ],
    resources: [
      { label: 'Documentation', href: '#' },
      { label: 'Tutorials', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Support', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Disclaimer', href: '#' },
    ],
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <motion.img
                  src={logo}
                  alt="WhyAi Logo"
                  className="h-6 w-16 rounded-lg object-contain"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-gray-400 max-w-sm">
                Your comprehensive platform to master Artificial Intelligence, Machine Learning, 
                and Deep Learning. From basics to advanced, we empower learners worldwide to 
                understand and practice AI technologies.
              </p>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <a href="mailto:whyai@whyai.co.in" className="text-gray-400 hover:text-blue-400 transition-colors">
                  whyai@whyai.co.in
                </a>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-bold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Follow us:</span>
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-blue-400 hover:bg-gray-800"
                  asChild
                >
                  <a href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">
                    <social.icon className="w-5 h-5" />
                  </a>
                </Button>
              ))}
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                Join our community of 1000+ AI learners worldwide
              </p>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} WhyAi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
