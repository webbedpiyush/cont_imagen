# Cont. Imagen

Cont. Imagen is a real-time image generation application built with Next.js, React, and TypeScript. It uses the Together AI API to generate images based on text prompts.

## Features

- Real-time image generation as you type
- Consistency mode for iterative image creation
- Support for custom Together AI API keys
- Responsive design for desktop and mobile
- Image gallery to view and select previously generated images

## Demo

[Link to live demo](https://cont-imagen.vercel.app/)

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/webbedpiyush/cont_imagen.git
   cd cont_imagen
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   TOGETHER_API_KEY=your_together_ai_api_key
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   ```

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Enter your Together AI API key in the input field at the top of the page (optional).
2. Type your image prompt in the text area.
3. Toggle the "Consistency mode" switch if you want to generate iterative images.
4. Watch as images are generated in real-time as you type.
5. Click on the generated thumbnails to view full-size images.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Together AI](https://www.together.ai/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## Contact

Twitter - [@webbedpiyush](https://x.com/_webbedpiyush) 
