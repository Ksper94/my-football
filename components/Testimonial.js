// components/Testimonial.js
export default function Testimonial({ text, author }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-700 mb-4">"{text}"</p>
        <p className="text-gray-900 font-semibold">- {author}</p>
      </div>
    )
  }
  