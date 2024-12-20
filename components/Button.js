// components/Button.js
import { motion } from 'framer-motion'

export default function Button({ children, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
      className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors ${className}`}
    >
      {children}
    </motion.button>
  )
}
