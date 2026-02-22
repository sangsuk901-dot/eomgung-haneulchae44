
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
let posts: Post[] = [
  {
    id: 'n1',
    category: '공지',
    title: '엄궁 1구역 하늘채 분양 정보 게시판 운영 안내',
    author: '분양본부',
    content: '본 게시판은 분양 관련 상세 정보 안내를 위해 운영됩니다. 실시간 뉴스 및 공식 일정을 가장 먼저 확인하실 수 있습니다.',
    date: '2024.05.20',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'n2',
    category: '공지',
    title: '모델하우스 그랜드 오픈 및 방문 예약 안내',
    author: '분양본부',
    content: '엄궁 1구역 하늘채 모델하우스가 곧 오픈합니다. 쾌적한 관람을 위해 사전 방문 예약제로 운영될 예정이니 참고 부탁드립니다.',
    date: '2024.05.21',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'p1',
    category: '자유',
    title: '여기 주변 교통 여건이 어떤가요?',
    author: '예비청약자',
    content: '직장이 서면 쪽인데 출퇴근하기에 교통편이 괜찮은지 궁금합니다. 지하철역까지 거리가 어느 정도 될까요?',
    date: '2024.05.21',
    replies: [
      { id: 'r1', author: '엄궁주민', content: '버스로 이동하면 금방이에요. 나중에 하단-사상선 개통되면 훨씬 좋아질 겁니다.', date: '2024.05.21' }
    ]
  },
  {
    id: 'p2',
    category: '자유',
    title: '84A 타입 평면도 진짜 잘 뽑았네요',
    author: '인테리어관심',
    content: '평면도 보니까 4베이 구조에 드레스룸도 넓게 잘 나온 것 같아요. 수납공간이 많아서 마음에 듭니다.',
    date: '2024.05.21',
    replies: []
  },
  {
    id: 'p3',
    category: '자유',
    title: '관심고객 등록 완료! 상품권 기대됩니다 ㅎㅎ',
    author: '행운가득',
    content: '등록 절차도 간단하고 정보도 바로바로 준다니 좋네요. 계약까지 성공해서 상품권도 받고 싶어요!',
    date: '2024.05.22',
    replies: []
  },
  {
    id: 'p4',
    category: '자유',
    title: '엄궁동 학군 정보 공유해주실 분 계신가요?',
    author: '학부모님',
    content: '아이 초등학교 입학 앞두고 있어서 학교 위치나 주변 학원가가 궁금합니다. 단지 내에 국공립 어린이집도 들어오나요?',
    date: '2024.05.22',
    replies: []
  },
  {
    id: 'p5',
    category: '자유',
    title: '대단지라 관리비는 좀 저렴하겠죠?',
    author: '알뜰살뜰',
    content: '1,600세대 넘는 대단지면 커뮤니티 시설도 잘 되어 있고 관리비도 세대당 부담이 적을 것 같아 기대 중입니다.',
    date: '2024.05.22',
    replies: []
  },
  {
    id: 'p6',
    category: '자유',
    title: '하단-사상선 연장 소식 들으셨나요?',
    author: '부동산고수',
    content: '엄궁역(가칭) 들어오면 역세권 프리미엄 장난 아닐 것 같아요. 지금이 딱 들어갈 타이밍인 듯.',
    date: '2024.05.23',
    replies: []
  },
  {
    id: 'p7',
    category: '자유',
    title: '숲세권이라 공기는 정말 좋을 것 같아요',
    author: '힐링러버',
    content: '단지 뒤쪽으로 산이 있어서 산책하기도 좋고 미세먼지 걱정도 덜할 것 같네요. 쾌적한 주거환경이 제일 마음에 듭니다.',
    date: '2024.05.23',
    replies: []
  },
  {
    id: 'p8',
    category: '자유',
    title: '분양가 이 정도면 합리적인 수준인가요?',
    author: '고민중',
    content: '요즘 자재값 많이 올랐다는데 주변 시세랑 비교했을 때 어떤가요? 실거주 목적으로 보고 있는데 적당한지 모르겠네요.',
    date: '2024.05.23',
    replies: []
  },
  {
    id: 'p9',
    category: '자유',
    title: '청약 가점 50점대인데 가능성 있을까요?',
    author: '청약도전',
    content: '가점이 애매해서 걱정입니다. 추첨제 물량도 좀 있겠죠? 꼭 당첨되고 싶네요.',
    date: '2024.05.24',
    replies: []
  },
  {
    id: 'p10',
    category: '자유',
    title: '신혼부부 특별공급 노려보려고 합니다',
    author: '새내기부부',
    content: '생애 최초랑 신특 중에 고민인데 경쟁률 어디가 더 낮을까요? 전략을 잘 짜야 할 것 같아요.',
    date: '2024.05.24',
    replies: []
  },
  {
    id: 'p11',
    category: '자유',
    title: '다자녀 특공 경쟁률 많이 높을까요?',
    author: '다둥이아빠',
    content: '아이 셋이라 다자녀 특공 쓰려고 하는데 대단지라 물량이 좀 있을 것 같아 다행입니다.',
    date: '2024.05.24',
    replies: []
  },
  {
    id: 'p12',
    category: '자유',
    title: '엄궁동 재개발 호재가 정말 많네요',
    author: '투자자',
    content: '1구역 시작으로 주변도 계속 개발되면 동네 분위기 자체가 확 바뀔 것 같아요. 미래 가치가 충분해 보입니다.',
    date: '2024.05.25',
    replies: []
  },
  {
    id: 'p13',
    category: '자유',
    title: '하늘채 브랜드 조경이 예쁘기로 유명하죠',
    author: '조경사랑',
    content: '다른 지역 하늘채 가봤는데 단지 내 조경이 공원처럼 잘 되어 있더라고요. 여기도 기대가 큽니다.',
    date: '2024.05.25',
    replies: []
  },
  {
    id: 'p14',
    category: '자유',
    title: '커뮤니티 시설에 수영장도 들어오나요?',
    author: '운동매니아',
    content: '피트니스랑 골프연습장은 기본일 테고 수영장까지 있으면 정말 완벽할 것 같은데 정보 아시는 분?',
    date: '2024.05.25',
    replies: []
  },
  {
    id: 'p15',
    category: '자유',
    title: '주차 공간 넉넉하게 설계되었으면 좋겠어요',
    author: '드라이버',
    content: '요즘 차 두 대인 집도 많은데 주차 대수 1.3대 이상은 되었으면 좋겠네요. 주차 스트레스 없는 아파트가 최고죠.',
    date: '2024.05.26',
    replies: []
  },
  {
    id: 'p16',
    category: '자유',
    title: '다들 몇 평형 신청하실 계획인가요?',
    author: '궁금해요',
    content: '저는 59랑 84 중에 고민인데 가족 구성원 생각하면 84가 맞을 것 같기도 하고... 다들 선호하는 평형이 궁금합니다.',
    date: '2024.05.26',
    replies: []
  },
  {
    id: 'p17',
    category: '자유',
    title: '주변 상권 형성은 잘 되어 있나요?',
    author: '쇼핑왕',
    content: '마트나 병원 같은 편의시설이 가까운지 궁금합니다. 단지 내 상가도 크게 들어오겠죠?',
    date: '2024.05.26',
    replies: []
  },
  {
    id: 'p18',
    category: '자유',
    title: '무주택 기간 계산하는 법 좀 알려주세요',
    author: '초보청약',
    content: '청약 홈에서 확인은 되는데 정확하게 제가 계산해보고 싶어서요. 기준일이 언제인가요?',
    date: '2024.05.27',
    replies: []
  },
  {
    id: 'p19',
    category: '자유',
    title: '하늘채 특화 설계가 적용된다고 하네요',
    author: '기술자',
    content: '스마트 홈 시스템이나 층간소음 저감 설계 같은 최신 기술들이 많이 적용된다고 해서 기대 중입니다.',
    date: '2024.05.27',
    replies: []
  },
  {
    id: 'p20',
    category: '자유',
    title: '청약 일정 나오면 문자 알림 오나요?',
    author: '알림신청',
    content: '관심고객 등록해두면 문자로 일정 보내주는 거죠? 깜빡하고 놓칠까 봐 걱정되네요.',
    date: '2024.05.27',
    replies: [
      { id: 'r2', author: '분양본부', content: '네, 관심고객으로 등록해주신 분들께는 주요 일정을 문자로 신속하게 안내해 드립니다.', date: '2024.05.27', isAdminPost: true }
    ]
  }
];

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  const PORT = 3000;

  // WebSocket logic
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');
    
    // Send initial posts to the new client
    ws.send(JSON.stringify({ type: 'INIT', posts }));

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
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
