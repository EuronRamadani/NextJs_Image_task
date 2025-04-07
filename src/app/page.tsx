'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const generateImages = async () => {
    if (!prompt) return;

    try {
      setLoading(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setImages(data.images.map((img: { url: string }) => img.url));
      setSelectedImage(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate images. Please try again.');
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">AI Image Generator</h1>
        
        <div className="flex gap-4">
          <Input
            placeholder="Enter your image description..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={generateImages}
            disabled={loading || !prompt}
          >
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </div>

        {images.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {images.map((imageUrl, index) => (
                <Card
                  key={index}
                  className={`p-2 cursor-pointer transition-all ${selectedImage === imageUrl ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedImage(imageUrl)}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={imageUrl}
                      alt={`Generated image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </Card>
              ))}
            </div>

            {selectedImage && (
              <div className="flex justify-center">
                <Button onClick={handleDownload}>
                  Download Selected Image
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
