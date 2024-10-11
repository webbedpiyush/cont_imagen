import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Together from "together-ai";
import { z } from "zod";

let ratelimit: Ratelimit | undefined;

if (process.env.UPSTASH_REDIS_REST_URL) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.fixedWindow(300, "1440 m"),
    analytics: true,
    prefix: "contimagen",
  });
}

export async function POST(req: Request) {
  const data = await req.json();
  const { prompt, iterativeMode, APIKey } = z
    .object({
      prompt: z.string(),
      iterativeMode: z.boolean(),
      APIKey: z.string().optional(),
    })
    .parse(data);

  const together = new Together();
  if (APIKey) {
    together.apiKey = APIKey ?? process.env.TOGETHER_API_KEY;
  }

  if (ratelimit && !APIKey) {
    const ipAddr = IdentifyMf();

    const { success } = await ratelimit.limit(ipAddr);

    if (!success) {
      return NextResponse.json(
        "Everything is over between you and me for 24hours , Give your own api-key",
        {
          status: 429,
        }
      );
    }
  }

  let res;
  try {
    res = await together.images.create({
      prompt,
      model: "black-forest-labs/FLUX.1-schnell",
      width: 1024,
      height: 768,
      seed: iterativeMode ? 123 : undefined,
      steps: 4,
      // @ts-expect-error
      response_format: "base64",
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        error: e.toString(),
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(res.data[0]);
}

function IdentifyMf() {
  const fallback = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? fallback;
  }

  return headers().get("x-real-ip") ?? fallback;
}
