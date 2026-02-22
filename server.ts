
import express from "express";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import path from "path";

interface Reply {
  id: string;
  author: string;
  content: string;
  date: string;
  password?: string;
  isAdminPost?: boolean;
}

interface Post {
  id: string;
  category: '공지' | '안내' | '자유';
  title: string;
  author: string;
  content: string;
  date: string;
  password?: string;
  isAdminPost?: boolean;
  replies?: Reply[];
}

// In-memory store for posts
let posts: Post[] = [];

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  const PORT = Number(process.env.PORT) || 3000;
  
  // WebSocket logic
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');
    
    // Send initial posts to the new client
    ws.send(JSON.stringify({ type: 'INIT', posts }));

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'GET_INIT':
            ws.send(JSON.stringify({ type: 'INIT', posts }));
            break;
          case 'ADD_POST':
            posts = [message.post, ...posts];
            broadcast({ type: 'UPDATE_POSTS', posts });
            break;
          case 'DELETE_POST':
            posts = posts.filter(p => p.id !== message.postId);
            broadcast({ type: 'UPDATE_POSTS', posts });
            break;
          case 'ADD_REPLY':
            posts = posts.map(p => {
              if (p.id === message.postId) {
                return { ...p, replies: [...(p.replies || []), message.reply] };
              }
              return p;
            });
            broadcast({ type: 'UPDATE_POSTS', posts });
            break;
          case 'DELETE_REPLY':
            posts = posts.map(p => {
              if (p.id === message.postId) {
                return { ...p, replies: p.replies?.filter(r => r.id !== message.replyId) };
              }
              return p;
            });
            broadcast({ type: 'UPDATE_POSTS', posts });
            break;
        }
      } catch (e) {
        console.error('Error processing message:', e);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  function broadcast(data: any) {
    const message = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist", "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
