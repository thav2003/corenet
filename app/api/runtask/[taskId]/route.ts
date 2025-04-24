import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

// Store active intervals for each task
const taskIntervals: {
  [key: string]: { resource: NodeJS.Timeout; progress: NodeJS.Timeout };
} = {};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  try {
    // Start the task
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status: "running" },
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error("Error starting task:", error);
    return NextResponse.json(
      { error: "Failed to start task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  try {
    // Clear intervals if they exist
    if (taskIntervals[taskId]) {
      clearInterval(taskIntervals[taskId].resource);
      clearInterval(taskIntervals[taskId].progress);
      delete taskIntervals[taskId];
    }

    // Update task status to failed
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status: "failed" },
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error("Error canceling task:", error);
    return NextResponse.json(
      { error: "Failed to cancel task" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const headersList = await headers();

  if (headersList.get("accept") === "text/event-stream") {
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    let running = true;
    let isFirst = true;
    let progressStarted = false;

    // Trả response ngay để client nhận kết nối
    const response = new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });

    while (running) {
      const task = await prisma.task.findFirst({
        where: { id: taskId },
      });

      // Check if task was cancelled
      if (task?.status === "failed") {
        writer
          .write(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "log",
                data: "[System] Task was cancelled by user",
              })}\n\n`
            )
          )
          .catch(console.error);
        writer
          .write(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          )
          .catch(console.error);
        writer.close().catch(console.error);
        running = false;
        break;
      }

      if (task?.status === "running" && !progressStarted) {
        progressStarted = true;
        if (isFirst) {
          writer
            .write(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "log",
                  data: "[Setup] Initializing training environment...",
                })}\n\n`
              )
            )
            .catch(console.error);
          writer
            .write(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "log",
                  data: "[Setup] Loading dataset and model architecture...",
                })}\n\n`
              )
            )
            .catch(console.error);
          isFirst = false;
        }

        const resourceInterval = setInterval(() => {
          const resourceUsage = {
            time: new Date().toLocaleTimeString(),
            gpu: 85 + Math.random() * 10,
            memory: 75 + Math.random() * 15,
            cpu: 60 + Math.random() * 20,
          };
          writer
            .write(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "resource",
                  data: resourceUsage,
                })}\n\n`
              )
            )
            .catch(console.error);
        }, 2000);

        let progress = 0;
        const progressInterval = setInterval(async () => {
          progress += 10;
          const log = `[${new Date().toLocaleTimeString()}] Task progress: ${progress}%`;
          writer
            .write(
              encoder.encode(
                `data: ${JSON.stringify({ type: "log", data: log })}\n\n`
              )
            )
            .catch(console.error);

          if (progress >= 100) {
            clearInterval(progressInterval);
            clearInterval(resourceInterval);
            running = false;

            await prisma.task.update({
              where: { id: taskId },
              data: { status: "completed" },
            });

            writer
              .write(
                encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
              )
              .catch(console.error);
            writer.close().catch(console.error);
          }
        }, 6000);

        // Store intervals for potential cancellation
        taskIntervals[taskId] = {
          resource: resourceInterval,
          progress: progressInterval,
        };

        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 10000));
    }

    return response;
  }

  return new Response(JSON.stringify({ error: "Not an SSE request" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}
