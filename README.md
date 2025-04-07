# AI Image Generator

A Next.js application that generates AI images using DALL-E 3. You can generate multiple images from a text prompt, select your favorite one, and download it.

## Features

- Generate 4 images at once using DALL-E 3
- Modern UI with shadcn components
- Image selection and download functionality
- Responsive design

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser

## Usage

1. Enter a descriptive prompt in the input field
2. Click 'Generate' to create 4 images
3. Click on your preferred image to select it
4. Click 'Download Selected Image' to save it to your device

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new). When deploying, make sure to add your `OPENAI_API_KEY` to the environment variables in your Vercel project settings.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui components
- OpenAI API (DALL-E 3)
