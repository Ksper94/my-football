// components/Testimonial.js

import PropTypes from 'prop-types';
import React from 'react';
import { motion } from 'framer-motion';

const Testimonial = React.memo(function Testimonial({ text, author, role, image, className = '' }) {
  return (
    <motion.blockquote
      className={`bg-white p-6 rounded-lg shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-gray-700 mb-4 italic">"{text}"</p>
      <div className="flex items-center justify-end">
        {image && (
          <img
            src={image}
            alt={`${author} photo`}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
        )}
        <div>
          <footer className="text-gray-900 font-semibold">{author}</footer>
          {role && <p className="text-gray-500 text-sm">{role}</p>}
        </div>
      </div>
    </motion.blockquote>
  );
});

Testimonial.propTypes = {
  text: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  role: PropTypes.string,
  image: PropTypes.string,
  className: PropTypes.string,
};

export default Testimonial;
