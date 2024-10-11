"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { useDebounce } from "@uidotdev/usehooks"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ImageIcon, Github } from "lucide-react"

interface Images {
  prompt: string
  image: {
    b64_json: string
    timings: { inference: number }
  }
}

export default function Component() {
  const [APIKey, setAPIKey] = useState("")
  const [prompt, setPrompt] = useState("")
  const [iterativeMode, setIterativeMode] = useState(false)
  const debouncedPrompt = useDebounce(prompt, 300)
  const [images, setImages] = useState<Images[]>([])
  const [activeIndex, setActiveIndex] = useState<number | undefined>()

  const { data: image, isFetching } = useQuery({
    queryKey: [debouncedPrompt],
    queryFn: async () => {
      const res = await fetch("api/imageGeneration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, APIKey, iterativeMode }),
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }
      return (await res.json()) as Images["image"]
    },
    staleTime: Infinity,
    retry: false,
    enabled: !!debouncedPrompt.trim(),
  })

  useEffect(() => {
    if (image && !images.map((value) => value.image).includes(image)) {
      setImages((images) => [...images, { prompt, image }])
      setActiveIndex(images.length)
    }
  }, [images, image, prompt])

  const activeImage = activeIndex !== undefined ? images[activeIndex].image : undefined

  return (
    <div className="min-h-screen text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
              Cont. Imagen
            </h1>
            <a
              href="https://github.com/webbedpiyush"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="GitHub profile"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
          <div className="w-full max-w-md">
            <label htmlFor="api-key" className="mb-2 block text-sm font-medium">
              Generate your own{" "}
              <a
                href="https://api.together.xyz/settings/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 transition hover:text-blue-400"
              >
                Together API Key & Use it
              </a>
            </label>
            <Input
              id="api-key"
              placeholder="API Key"
              type="password"
              value={APIKey}
              onChange={(e) => setAPIKey(e.target.value)}
              className="text-gray-100 placeholder:text-gray-400"
            />
          </div>
        </header>
        <main className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <form className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="mb-2 block text-sm font-medium">
                    Describe your image
                  </label>
                  <Textarea
                    id="prompt"
                    rows={4}
                    spellCheck={false}
                    placeholder="Enter your prompt here..."
                    required
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="bg-gray-700 text-gray-100 placeholder:text-gray-400"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="consistency-mode"
                      checked={iterativeMode}
                      onCheckedChange={setIterativeMode}
                    />
                    <label htmlFor="consistency-mode" className="text-sm font-medium">
                      Consistency mode
                    </label>
                  </div>
                  {isFetching && !activeImage && (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Generating...</span>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="flex flex-col items-center justify-center space-y-4">
            {!activeImage || !prompt ? (
              <div className="max-w-2xl text-center">
                <ImageIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h2 className="mt-4 text-2xl font-semibold">Generate images in real time</h2>
                <p className="mt-2 text-gray-400">
                  Enter a prompt and generate images in milliseconds as you keep on typing.
                </p>
              </div>
            ) : (
              <div className="w-full max-w-4xl space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={`data:image/png;base64,${activeImage.b64_json}`}
                    alt="Generated image"
                    layout="fill"
                    objectFit="cover"
                    className={isFetching ? "animate-pulse" : ""}
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {images.map((image, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className={`p-1 ${activeIndex === i ? "ring-2 ring-blue-500" : ""}`}
                      onClick={() => setActiveIndex(i)}
                    >
                      <Image
                        src={`data:image/png;base64,${image.image.b64_json}`}
                        alt={`Generated image ${i + 1}`}
                        width={64}
                        height={64}
                        className="rounded"
                      />
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}