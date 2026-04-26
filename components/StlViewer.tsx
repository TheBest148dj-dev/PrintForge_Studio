"use client";

import { useEffect, useRef, useState } from "react";

type Triangle = {
  vertices: [number[], number[], number[]];
  normal: number[];
  depth: number;
};

type ViewerProps = {
  initialUrl?: string;
  allowUpload?: boolean;
  title?: string;
};

function subtract(a: number[], b: number[]) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a: number[], b: number[]) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function normalize(v: number[]) {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function parseAsciiStl(text: string) {
  const lines = text.split(/\r?\n/);
  const triangles: Triangle[] = [];
  let currentNormal = [0, 0, 1];
  let vertices: number[][] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("facet normal")) {
      const parts = line.split(/\s+/).slice(-3).map(Number);
      currentNormal = normalize(parts);
      vertices = [];
    } else if (line.startsWith("vertex")) {
      const parts = line.split(/\s+/).slice(-3).map(Number);
      vertices.push(parts);
    } else if (line.startsWith("endfacet") && vertices.length === 3) {
      triangles.push({
        vertices: [vertices[0], vertices[1], vertices[2]],
        normal: currentNormal,
        depth: 0
      });
      vertices = [];
    }
  }

  return triangles;
}

function parseBinaryStl(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  const faceCount = view.getUint32(80, true);
  const triangles: Triangle[] = [];
  let offset = 84;

  for (let i = 0; i < faceCount; i += 1) {
    const normal = normalize([
      view.getFloat32(offset, true),
      view.getFloat32(offset + 4, true),
      view.getFloat32(offset + 8, true)
    ]);
    offset += 12;

    const vertices: [number[], number[], number[]] = [
      [view.getFloat32(offset, true), view.getFloat32(offset + 4, true), view.getFloat32(offset + 8, true)],
      [view.getFloat32(offset + 12, true), view.getFloat32(offset + 16, true), view.getFloat32(offset + 20, true)],
      [view.getFloat32(offset + 24, true), view.getFloat32(offset + 28, true), view.getFloat32(offset + 32, true)]
    ];
    offset += 36;
    offset += 2;

    triangles.push({ vertices, normal, depth: 0 });
  }

  return triangles;
}

async function loadTriangles(source: string) {
  const response = await fetch(source);
  if (!response.ok) {
    throw new Error("STL kon niet geladen worden.");
  }

  const buffer = await response.arrayBuffer();
  const header = new TextDecoder().decode(buffer.slice(0, 5)).toLowerCase();
  return header.includes("solid") ? parseAsciiStl(new TextDecoder().decode(buffer)) : parseBinaryStl(buffer);
}

function normalizeTriangles(triangles: Triangle[]) {
  const points = triangles.flatMap((triangle) => triangle.vertices);
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  const zs = points.map((point) => point[2]);
  const center = [
    (Math.min(...xs) + Math.max(...xs)) / 2,
    (Math.min(...ys) + Math.max(...ys)) / 2,
    (Math.min(...zs) + Math.max(...zs)) / 2
  ];
  const maxSize = Math.max(
    Math.max(...xs) - Math.min(...xs),
    Math.max(...ys) - Math.min(...ys),
    Math.max(...zs) - Math.min(...zs),
    1
  );

  return triangles.map((triangle) => ({
    ...triangle,
    vertices: triangle.vertices.map((vertex) => [
      (vertex[0] - center[0]) / maxSize,
      (vertex[1] - center[1]) / maxSize,
      (vertex[2] - center[2]) / maxSize
    ]) as [number[], number[], number[]]
  }));
}

export function StlViewer({ initialUrl = "", allowUpload = true, title = "Upload STL-bestand" }: ViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState(
    initialUrl ? "STL laden..." : "Upload een STL-bestand om het model in 3D te bekijken."
  );
  const [sourceUrl, setSourceUrl] = useState(initialUrl);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let rotationX = -0.45;
    let rotationY = 0.6;
    let zoom = 1;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let disposed = false;
    let triangles: Triangle[] = [];

    function resizeCanvas() {
      const width = canvas.clientWidth || 800;
      const height = 520;
      canvas.width = width;
      canvas.height = height;
    }

    function rotatePoint(point: number[]) {
      const [x, y, z] = point;
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const y1 = y;

      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      return [x1, y2, z2];
    }

    function project(point: number[]) {
      const distance = 3.6;
      const scale = 220 * zoom;
      const z = point[2] + distance;
      return [
        canvas.width / 2 + (point[0] / z) * scale,
        canvas.height / 2 - (point[1] / z) * scale,
        z
      ];
    }

    function draw() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#f2ede6";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const light = normalize([0.4, 0.7, 1]);
      const rendered = triangles.map((triangle) => {
        const rotatedVertices = triangle.vertices.map(rotatePoint);
        const edgeOne = subtract(rotatedVertices[1], rotatedVertices[0]);
        const edgeTwo = subtract(rotatedVertices[2], rotatedVertices[0]);
        const normal = normalize(cross(edgeOne, edgeTwo));
        const projected = rotatedVertices.map(project);
        const depth = projected.reduce((sum, point) => sum + point[2], 0) / 3;
        const brightness = Math.max(0.2, normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2]);
        return { projected, depth, brightness };
      });

      rendered.sort((a, b) => b.depth - a.depth);

      for (const triangle of rendered) {
        context.beginPath();
        context.moveTo(triangle.projected[0][0], triangle.projected[0][1]);
        context.lineTo(triangle.projected[1][0], triangle.projected[1][1]);
        context.lineTo(triangle.projected[2][0], triangle.projected[2][1]);
        context.closePath();
        const shade = Math.round(70 + triangle.brightness * 120);
        context.fillStyle = `rgb(${shade}, ${Math.min(220, shade + 20)}, 255)`;
        context.fill();
        context.strokeStyle = "rgba(17, 36, 64, 0.18)";
        context.stroke();
      }
    }

    function onMouseDown(event: MouseEvent) {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
    }

    function onMouseMove(event: MouseEvent) {
      if (!dragging) {
        return;
      }
      rotationY += (event.clientX - lastX) * 0.01;
      rotationX += (event.clientY - lastY) * 0.01;
      lastX = event.clientX;
      lastY = event.clientY;
      draw();
    }

    function stopDragging() {
      dragging = false;
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      zoom = Math.max(0.45, Math.min(3, zoom - event.deltaY * 0.001));
      draw();
    }

    resizeCanvas();
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDragging);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", resizeCanvas);

    async function boot() {
      if (!sourceUrl) {
        draw();
        return;
      }

      try {
        const loaded = await loadTriangles(sourceUrl);
        if (disposed) {
          return;
        }
        triangles = normalizeTriangles(loaded);
        setStatus("STL geladen. Sleep om te roteren en gebruik scroll om te zoomen.");
        draw();
      } catch {
        if (!disposed) {
          setStatus("De STL kon niet geladen worden. Controleer het bestand en probeer opnieuw.");
        }
      }
    }

    boot();

    return () => {
      disposed = true;
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDragging);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [sourceUrl]);

  return (
    <div className="stack">
      {allowUpload ? (
        <label className="field">
          <span>{title}</span>
          <input
            type="file"
            accept=".stl,model/stl"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }
              setStatus("STL laden...");
              setSourceUrl(URL.createObjectURL(file));
            }}
          />
        </label>
      ) : null}
      <canvas ref={canvasRef} className="viewer-canvas-shell" style={{ width: "100%", height: 520 }} />
      <p className="muted" style={{ margin: 0 }}>
        {status}
      </p>
    </div>
  );
}
