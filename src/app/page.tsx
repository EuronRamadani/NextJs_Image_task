'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const generateImages = async (regenerateStyle = false) => {
    if (!prompt) return;

    try {
      setLoading(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt, 
          regenerateStyle 
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setImages(data.images.map((img: { url: string }) => img.url));
      if (!regenerateStyle) {
        setSelectedImage(null);
        setSelectedImageIndex(null);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setSelectedImageIndex(index);
  };

  const handleRegenerateWithStyle = () => {
    if (!selectedImage) return;
    generateImages(true);
  };

  const handleDownload = async () => {
    if (!selectedImage) return;

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-center">AI Image Generator</h1>
          <p className="text-gray-500 dark:text-gray-400">Generate and select your favorite AI images</p>
        </div>
        
        <Card className="p-4 shadow-md">
          <CardContent className="p-0 pt-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter your image description..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => generateImages(false)}
                disabled={loading || !prompt}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {images.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {images.map((imageUrl, index) => (
                <Card
                  key={index}
                  className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${selectedImageIndex === index ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' : ''}`}
                >
                  <div 
                    className="relative aspect-square cursor-pointer"
                    onClick={() => handleImageSelect(imageUrl, index)}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Generated image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {selectedImage && (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download Selected Image
                </Button>
                <Button 
                  onClick={handleRegenerateWithStyle}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Generate Similar Style
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
