import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShapeCard from "@/components/shape-card";
import { shapeData } from "@/lib/learning-data";

export default function Shapes() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Link href="/">
          <Button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-2xl font-bold text-xl mb-6 btn-3d">
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Button>
        </Link>
        
        <h2 className="text-4xl md:text-5xl font-kid font-bold text-kidnavy mb-4">
          🔺 Shapes & Colors
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Click shapes to change colors and play matching games!
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {shapeData.map((shape, index) => (
          <motion.div
            key={shape.shape}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <ShapeCard
              shape={shape.shape}
              emoji={shape.emoji}
              initialColor={shape.color}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="bg-white rounded-3xl p-8 shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-3xl font-kid font-bold text-kidnavy text-center mb-6">
          🎯 Shape Color Match
        </h3>
        <p className="text-xl text-center mb-6">Match each shape with its color!</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-2xl font-kid font-bold text-center">Shapes</h4>
            <div className="space-y-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="card-3d bg-gray-200 hover:bg-gray-300 rounded-2xl p-4 flex items-center justify-center cursor-move"
                draggable
                data-testid="drag-red-circle"
              >
                <div className="w-16 h-16 bg-gray-400 rounded-full mr-4"></div>
                <span className="text-xl font-bold">Circle</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="card-3d bg-gray-200 hover:bg-gray-300 rounded-2xl p-4 flex items-center justify-center cursor-move"
                draggable
                data-testid="drag-blue-square"
              >
                <div className="w-16 h-16 bg-gray-400 mr-4"></div>
                <span className="text-xl font-bold">Square</span>
              </motion.div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-2xl font-kid font-bold text-center">Colors</h4>
            <div className="space-y-3">
              <div className="border-4 border-dashed border-gray-400 rounded-2xl p-6 text-center bg-red-100 hover:bg-red-200 transition-colors">
                <div className="text-2xl font-bold text-red-600">Red</div>
              </div>
              <div className="border-4 border-dashed border-gray-400 rounded-2xl p-6 text-center bg-blue-100 hover:bg-blue-200 transition-colors">
                <div className="text-2xl font-bold text-blue-600">Blue</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
