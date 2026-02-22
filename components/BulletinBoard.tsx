
import React, { useState, useEffect } from 'react';
import '../types';

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

interface BulletinBoardProps {
  isAdmin: boolean;
  isRegistered: boolean;
}

const DEFAULT_NOTICES: Post[] = [
  {
    id: 'notice-20',
    category: '공지',
    title: '[청약Q&A] 당첨 후 계약 체결 시 필요 서류 목록 안내',
    author: '분양본부',
    content: '당첨을 축하드립니다! 계약 시에는 신분증, 인감도장, 인감증명서, 주민등록표 등·초본, 가족관계증명서 등이 필요하며, 특별공급의 경우 자격 증빙 서류가 추가됩니다. 상세 목록은 공고문을 확인해 주세요.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-19',
    category: '공지',
    title: '[청약Q&A] 모델하우스 방문 예약 및 관람 수칙',
    author: '분양본부',
    content: '쾌적한 관람을 위해 사전 예약제로 운영됩니다. 예약하신 시간에 맞춰 방문해 주시고, 내부 사진 촬영은 제한될 수 있으니 양해 부탁드립니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-18',
    category: '공지',
    title: '[청약Q&A] 중도금 대출 및 잔금 대출 안내',
    author: '분양본부',
    content: '중도금 대출은 통상 분양가의 60% 범위 내에서 가능하며, 개인의 신용도 및 대출 규제에 따라 달라질 수 있습니다. 자세한 사항은 지정 은행을 통해 상담받으실 수 있습니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-17',
    category: '공지',
    title: '[청약Q&A] 분양권 전매 절차 및 양도소득세 안내',
    author: '분양본부',
    content: '전매 제한 기간이 종료된 후 전매가 가능하며, 양도소득세 신고 의무가 발생합니다. 세율은 보유 기간에 따라 차등 적용되니 세무 전문가와 상의하시기 바랍니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-16',
    category: '공지',
    title: '[청약Q&A] 오피스텔/도시형생활주택 청약 시 유의사항',
    author: '분양본부',
    content: '오피스텔은 청약 통장이 필요 없으며 재당첨 제한도 적용되지 않습니다. 하지만 주택 수 포함 여부는 취득세 및 양도세 기준에 따라 다를 수 있으니 주의가 필요합니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-15',
    category: '공지',
    title: '[청약Q&A] 1순위 청약 자격 요건 (당해지역 vs 기타지역)',
    author: '분양본부',
    content: '해당 주택건설지역 거주자에게 우선 공급권이 부여됩니다. 거주 기간 요건을 충족해야 당해지역 1순위로 인정되며, 미달 시 기타지역으로 기회가 넘어갑니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-14',
    category: '공지',
    title: '[청약Q&A] 예비당첨자 순번 및 추첨 방식 안내',
    author: '분양본부',
    content: '부적격 및 계약 포기 물량 발생 시 예비 순번대로 기회가 주어집니다. 예비당첨자 동호수 추첨은 별도의 일정에 따라 진행됩니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-13',
    category: '공지',
    title: '[청약Q&A] 부적격 당첨 시 불이익 및 대처 방법',
    author: '분양본부',
    content: '부적격 당첨 시 일정 기간(최대 1년) 청약 신청이 제한됩니다. 단순 계산 착오라면 소명 기간 내에 증빙 서류를 제출하여 자격을 입증해야 합니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-12',
    category: '공지',
    title: '[청약Q&A] 청약 홈 이용 방법 및 인증서 안내',
    author: '분양본부',
    content: '청약 신청은 한국부동산원 "청약홈" 홈페이지나 앱을 통해 가능합니다. 공동인증서, 금융인증서 또는 네이버/카카오 등 간편인증서가 반드시 필요합니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-11',
    category: '공지',
    title: '[청약Q&A] 전매 제한 및 거주 의무 기간 확인',
    author: '분양본부',
    content: '본 단지는 분양가 상한제 적용 여부 및 지역 규제에 따라 전매 제한 기간이 설정됩니다. 정확한 기간은 입주자 모집 공고문을 참조해 주세요.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-10',
    category: '공지',
    title: '[청약Q&A] 재당첨 제한 기간 확인 방법',
    author: '분양본부',
    content: '과거 당첨 이력이 있는 경우 청약홈의 "청약제한사항 확인" 메뉴에서 본인의 재당첨 제한 기간을 조회할 수 있습니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-09',
    category: '공지',
    title: '[청약Q&A] 청약 예치금액 기준 (지역별/면적별)',
    author: '분양본부',
    content: '입주자 모집 공고일 전일까지 본인 거주지 및 신청 평형에 맞는 예치금이 통장에 입금되어 있어야 합니다. 서울/부산은 85㎡ 이하 기준 300만 원입니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-08',
    category: '공지',
    title: '[청약Q&A] 일반공급 가점제와 추첨제 비율 안내',
    author: '분양본부',
    content: '전용면적 85㎡ 이하는 가점제 40%, 추첨제 60%로 진행되며(비규제지역 기준), 가점제 낙첨자는 별도 신청 없이 추첨제 대상으로 자동 전환됩니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-07',
    category: '공지',
    title: '[청약Q&A] 노부모 부양 특별공급 자격 요건',
    author: '분양본부',
    content: '만 65세 이상의 직계존속을 3년 이상 계속하여 부양하고 있는 무주택 세대주여야 합니다. 피부양자와 그 배우자도 모두 무주택이어야 인정됩니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-06',
    category: '공지',
    title: '[청약Q&A] 다자녀 특별공급 배점 기준 안내',
    author: '분양본부',
    content: '미성년 자녀 수, 영유아 자녀 수, 세대 구성, 무주택 기간, 해당 지역 거주 기간 등을 합산하여 고득점자 순으로 당첨자를 선정합니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-05',
    category: '공지',
    title: '[청약Q&A] 신혼부부 특별공급 소득 기준',
    author: '분양본부',
    content: '전년도 도시근로자 가구당 월평균 소득의 140%(맞벌이 160%) 이하인 세대가 대상입니다. 소득 기준 초과 시 자산 기준을 충족하면 추첨제 물량에 도전 가능합니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-04',
    category: '공지',
    title: '[청약Q&A] 생애최초 특별공급 자격 요건',
    author: '분양본부',
    content: '세대에 속한 모든 구성원이 과거 주택 소유 이력이 없어야 하며, 현재 혼인 중이거나 미혼 자녀가 있어야 합니다. 또한 5년 이상 소득세를 납부한 실적이 필요합니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-03',
    category: '공지',
    title: '[청약Q&A] 부양가족 수 계산 시 유의사항',
    author: '분양본부',
    content: '본인을 제외한 배우자, 직계존속(3년 이상 동일 등본), 직계비속(미혼 자녀)이 포함됩니다. 부모님이 주택을 소유하신 경우 부양가족에서 제외되니 주의하세요.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-02',
    category: '공지',
    title: '[청약Q&A] 무주택 기간 산정 기준 안내',
    author: '분양본부',
    content: '만 30세가 되는 날부터 산정하며, 30세 이전에 혼인한 경우 혼인신고일부터 계산합니다. 주택을 소유한 적이 있다면 처분 후 무주택자가 된 날부터 다시 계산합니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  },
  {
    id: 'notice-01',
    category: '공지',
    title: '[청약Q&A] 청약통장 가입 기간 및 납입 횟수 확인 방법',
    author: '분양본부',
    content: '가입하신 은행 홈페이지나 앱, 또는 청약홈의 "청약통장 순위확인서 발급" 메뉴에서 정확한 가입일과 납입 인정 횟수를 확인하실 수 있습니다.',
    date: '2024.05.28',
    isAdminPost: true,
    replies: []
  }
];

const BulletinBoard: React.FC<BulletinBoardProps> = ({ isAdmin, isRegistered }) => {
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>(DEFAULT_NOTICES);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '자유' as '자유' | '공지', password: '', author: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7;
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'post' | 'reply', postId: string, replyId?: string, targetObj: Post | Reply } | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState(false);
  const [replyInput, setReplyInput] = useState<{ [postId: string]: { content: string, password: string } }>({});
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    let ws: WebSocket;

    const connect = () => {
      setConnectionStatus('connecting');
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('Connected to Bulletin Board Server');
        setSocket(ws);
        setConnectionStatus('connected');
        // 서버에 초기 데이터 요청
        ws.send(JSON.stringify({ type: 'GET_INIT' }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'INIT' || data.type === 'UPDATE_POSTS') {
            // 서버 데이터와 기본 공지사항 합치기 (중복 제거)
            const serverPosts = data.posts as Post[];
            const mergedPosts = [...serverPosts];
            
            DEFAULT_NOTICES.forEach(notice => {
              if (!mergedPosts.find(p => p.id === notice.id)) {
                mergedPosts.push(notice);
              }
            });
            
            setPosts(mergedPosts);
          }
        } catch (e) {
          console.error('Failed to parse socket message', e);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from server. Retrying...');
        setSocket(null);
        setConnectionStatus('disconnected');
        setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error', err);
        ws.close();
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleWritePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      alert('서버와 연결이 끊어졌습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해 주세요.');
      return;
    }

    setLoading(true);
    const authorName = isAdmin ? '분양본부' : (newPost.author.trim() || '방문자');
    const postDate = new Date().toLocaleDateString('ko-KR').slice(0, -1);
    const post: Post = {
      id: Date.now().toString(),
      category: isAdmin ? newPost.category : '자유',
      title: newPost.title,
      content: newPost.content,
      author: authorName,
      date: postDate,
      password: newPost.password,
      isAdminPost: isAdmin,
      replies: []
    };
    
    socket.send(JSON.stringify({ type: 'ADD_POST', post }));
    
    setLoading(false);
    setShowWriteModal(false);
    setNewPost({ title: '', content: '', category: '자유', password: '', author: '' });
    setCurrentPage(1);
  };

  const confirmDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteTarget || !socket) return;
    const { type, postId, replyId, targetObj } = deleteTarget;
    if (isAdmin || (targetObj.password === deletePassword)) {
      if (type === 'post') {
        socket.send(JSON.stringify({ type: 'DELETE_POST', postId }));
      } else {
        socket.send(JSON.stringify({ type: 'DELETE_REPLY', postId, replyId }));
      }
      setDeleteTarget(null);
      setDeletePassword('');
      setDeleteError(false);
      alert('삭제되었습니다.');
    } else {
      setDeleteError(true);
      setTimeout(() => setDeleteError(false), 2000);
    }
  };

  const handleWriteReply = (postId: string) => {
    const input = replyInput[postId];
    if (!input || !input.content.trim()) return;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      alert('서버와 연결이 끊어졌습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    const authorName = isAdmin ? '분양본부' : '방문자';
    const replyDate = new Date().toLocaleDateString('ko-KR').slice(0, -1);
    const newReply: Reply = {
      id: Date.now().toString(),
      author: authorName,
      content: input.content,
      date: replyDate,
      password: input.password,
      isAdminPost: isAdmin
    };
    
    socket.send(JSON.stringify({ type: 'ADD_REPLY', postId, reply: newReply }));
    
    setReplyInput({ ...replyInput, [postId]: { content: '', password: '' } });
  };

  const noticePosts = posts.filter(p => p.category === '공지').sort((a, b) => {
    const idA = parseInt(a.id.replace(/[^0-9]/g, '')) || 0;
    const idB = parseInt(b.id.replace(/[^0-9]/g, '')) || 0;
    return idB - idA;
  });
  const freePosts = posts.filter(p => p.category !== '공지').sort((a, b) => {
    const idA = parseInt(a.id.replace(/[^0-9]/g, '')) || 0;
    const idB = parseInt(b.id.replace(/[^0-9]/g, '')) || 0;
    return idB - idA;
  });
  const totalPages = Math.max(1, Math.ceil(freePosts.length / postsPerPage));
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentFreePosts = freePosts.slice(indexOfFirstPost, indexOfLastPost);
  const displayedPosts = [...noticePosts, ...currentFreePosts];

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    const target = document.querySelector('#bulletin');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="bulletin" className="py-20 md:py-32 px-6 bg-white scroll-mt-20 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16 reveal px-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black tracking-widest uppercase mb-4">
              Community Space
              <span className="inline-flex items-center gap-1 ml-2 border-l border-indigo-200 pl-2">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 
                  connectionStatus === 'connecting' ? 'bg-amber-500 animate-bounce' : 'bg-red-500'
                }`}></span>
                <span className="opacity-70">
                  {connectionStatus === 'connected' ? 'LIVE' : 
                   connectionStatus === 'connecting' ? 'CONNECTING...' : 'OFFLINE'}
                </span>
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-neutral-900 tracking-tight break-keep">하늘채 정보 공유 게시판</h2>
          </div>
          <button 
            onClick={() => setShowWriteModal(true)} 
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 text-white rounded-xl md:rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
          >
            <iconify-icon icon="solar:pen-new-square-bold" className="text-xl"></iconify-icon>
            글쓰기
          </button>
        </div>

        <div className="divide-y divide-neutral-100 border-t border-neutral-100 reveal">
          {displayedPosts.map((post) => (
            <div 
              key={post.id} 
              className={`transition-all duration-300 ${
                post.category === '공지' ? 'bg-indigo-50/20' : 'hover:bg-neutral-50/40'
              }`}
            >
              <div className={`flex flex-col md:flex-row gap-4 md:gap-6 items-start px-4 transition-all ${
                post.category === '공지' ? 'py-8 md:py-10' : 'py-6'
              }`}>
                {/* Category & Date Column */}
                <div className="w-full md:w-32 shrink-0 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-2">
                  <span className={`inline-block text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    post.category === '공지' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-neutral-100 text-neutral-400'
                  }`}>
                    {post.category}
                  </span>
                  <div className="text-[10px] font-bold text-neutral-400 tracking-tighter">
                    {post.date}
                  </div>
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0 cursor-pointer w-full" onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}>
                  <h4 className={`font-bold mb-2 tracking-tight transition-all flex items-center flex-wrap gap-2 ${
                    post.category === '공지' 
                    ? 'text-lg md:text-xl text-neutral-900' 
                    : 'text-base md:text-lg text-neutral-800'
                  }`}>
                    {post.title}
                    {post.category === '공지' && (
                      <iconify-icon icon="solar:pin-bold" className="text-indigo-400"></iconify-icon>
                    )}
                    {post.replies && post.replies.length > 0 && (
                      <span className="text-[10px] text-indigo-500 font-black bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        {post.replies.length}
                      </span>
                    )}
                  </h4>
                  <p className={`text-neutral-500 leading-relaxed break-all ${
                    post.category === '공지' ? 'text-sm' : 'text-[13px]'
                  } ${expandedPostId === post.id ? '' : 'line-clamp-1'}`}>
                    {post.content}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-[10px] font-bold text-neutral-400">{post.author}</span>
                  </div>
                </div>

                {/* Action Column */}
                <div className="w-full md:w-auto flex justify-end items-center gap-3 md:gap-2 pt-2 md:pt-0">
                   {(isAdmin || !post.isAdminPost) && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: 'post', postId: post.id, targetObj: post }); }} 
                      className="w-10 h-10 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-all border border-neutral-100 md:border-none"
                      title="삭제"
                    >
                      <iconify-icon icon="solar:trash-bin-minimalistic-bold" className="text-lg md:text-base"></iconify-icon>
                    </button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setExpandedPostId(expandedPostId === post.id ? null : post.id); }}
                    className={`w-10 h-10 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-all border border-neutral-100 md:border-none ${expandedPostId === post.id ? 'bg-neutral-900 text-white border-neutral-900' : 'text-neutral-300 hover:bg-neutral-100'}`}
                  >
                     <iconify-icon icon={expandedPostId === post.id ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} className="text-xl md:text-lg"></iconify-icon>
                  </button>
                </div>
              </div>

              {/* Expanded Area: Replies */}
              {expandedPostId === post.id && (
                <div className="bg-neutral-50/50 border-t border-neutral-100 p-4 md:p-8 space-y-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-4">
                    {post.replies?.map((reply) => (
                      <div key={reply.id} className="flex gap-2 md:gap-3 group/reply">
                        <div className="mt-1 text-neutral-300 shrink-0">
                          <iconify-icon icon="solar:subdirectory-right-bold" className="text-base md:text-lg"></iconify-icon>
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-neutral-100 relative">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black ${reply.isAdminPost ? 'text-indigo-600' : 'text-neutral-600'}`}>
                                {reply.author}
                              </span>
                              <span className="text-[9px] text-neutral-400 font-medium">{reply.date}</span>
                            </div>
                            {(isAdmin || !reply.isAdminPost) && (
                              <button 
                                onClick={() => setDeleteTarget({ type: 'reply', postId: post.id, replyId: reply.id, targetObj: reply })}
                                className="text-neutral-300 hover:text-red-500 transition-colors p-1"
                              >
                                <iconify-icon icon="solar:close-circle-bold" className="text-lg md:text-base"></iconify-icon>
                              </button>
                            )}
                          </div>
                          <p className="text-[13px] text-neutral-600 leading-relaxed whitespace-pre-wrap break-all">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                    {(!post.replies || post.replies.length === 0) && (
                      <p className="text-center text-[10px] text-neutral-400 py-2 font-medium italic">아직 답글이 없습니다.</p>
                    )}
                  </div>

                  <div className="bg-white p-4 md:p-5 rounded-xl border border-neutral-200/50 shadow-sm">
                    <div className="space-y-3">
                      <textarea 
                        value={replyInput[post.id]?.content || ''}
                        onChange={(e) => setReplyInput({ ...replyInput, [post.id]: { ...(replyInput[post.id] || { password: '' }), content: e.target.value } })}
                        placeholder="답글을 남겨주세요."
                        rows={2}
                        className="w-full bg-neutral-50 border border-neutral-100 rounded-lg p-3 text-[13px] outline-none focus:border-indigo-400 focus:bg-white transition-all resize-none"
                      ></textarea>
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        {!isAdmin && (
                          <input 
                            type="password"
                            value={replyInput[post.id]?.password || ''}
                            onChange={(e) => setReplyInput({ ...replyInput, [post.id]: { ...(replyInput[post.id] || { content: '' }), password: e.target.value } })}
                            placeholder="비밀번호"
                            className="w-full sm:w-28 bg-neutral-50 border border-neutral-100 rounded-lg px-3 py-2.5 md:py-1.5 text-[12px] md:text-[11px] outline-none focus:border-indigo-400"
                          />
                        )}
                        <button 
                          onClick={() => handleWriteReply(post.id)}
                          className="w-full sm:w-auto px-6 py-3 bg-neutral-900 text-white rounded-lg text-sm md:text-[11px] font-bold hover:bg-indigo-600 transition-all active:scale-95"
                        >
                          등록
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {posts.length === 0 && (
            <div className="py-24 md:py-32 text-center">
               <iconify-icon icon="solar:clipboard-list-linear" className="text-5xl text-neutral-100 mb-4"></iconify-icon>
               <p className="text-neutral-400 font-bold">등록된 게시글이 없습니다.</p>
            </div>
          )}
        </div>

        {freePosts.length > 0 && (
          <div className="mt-12 flex justify-center items-center gap-2 reveal flex-wrap">
            <button 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-50 text-neutral-400 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <iconify-icon icon="solar:alt-arrow-left-linear" className="text-xl"></iconify-icon>
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => handlePageChange(idx + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                  currentPage === idx + 1 
                  ? 'bg-neutral-900 text-white shadow-lg' 
                  : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-50 text-neutral-400 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <iconify-icon icon="solar:alt-arrow-right-linear" className="text-xl"></iconify-icon>
            </button>
          </div>
        )}
      </div>

      {showWriteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 md:px-6">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setShowWriteModal(false)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-neutral-100 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6 md:mb-8 sticky top-0 bg-white z-10 pb-2">
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900">게시글 작성</h3>
                <button onClick={() => setShowWriteModal(false)} className="text-neutral-300 hover:text-neutral-900">
                  <iconify-icon icon="solar:close-circle-bold" className="text-3xl"></iconify-icon>
                </button>
             </div>
             <form onSubmit={handleWritePost} className="space-y-5 md:space-y-6">
                {isAdmin && (
                  <div className="flex gap-2">
                    {['자유', '공지'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewPost({...newPost, category: cat as any})}
                        className={`px-6 py-2 rounded-xl font-bold text-xs border ${
                          newPost.category === cat ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-400 border-neutral-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Author</label>
                    <input 
                      type="text" 
                      required={!isAdmin}
                      disabled={isAdmin}
                      value={isAdmin ? '분양본부' : newPost.author} 
                      onChange={(e) => setNewPost({...newPost, author: e.target.value})} 
                      className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold text-neutral-900 disabled:opacity-60" 
                      placeholder="작성자 이름" 
                    />
                  </div>
                  {!isAdmin && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Password</label>
                      <input type="password" required value={newPost.password} onChange={(e) => setNewPost({...newPost, password: e.target.value})} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm" placeholder="삭제용 비밀번호" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Title</label>
                  <input type="text" required value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold text-neutral-900" placeholder="제목" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Content</label>
                  <textarea required rows={5} value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none resize-none focus:border-indigo-500 transition-all text-sm text-neutral-700" placeholder="내용"></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full py-4.5 md:py-4.5 bg-neutral-900 text-white rounded-xl md:rounded-[1.5rem] font-bold hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50">
                  {loading ? '등록 중...' : '게시글 등록하기'}
                </button>
             </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => { setDeleteTarget(null); setDeletePassword(''); setDeleteError(false); }}></div>
          <div className="relative w-full max-w-xs bg-white rounded-[2rem] shadow-2xl p-8 border border-neutral-100">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <iconify-icon icon="solar:trash-bin-trash-bold" className="text-2xl"></iconify-icon>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">삭제 확인</h3>
              <p className="text-neutral-400 text-[10px] mt-1 font-medium leading-relaxed">
                {isAdmin ? '관리자 권한으로 삭제합니다.' : '삭제 비밀번호를 입력해 주세요.'}
              </p>
            </div>
            <form onSubmit={confirmDelete} className="space-y-4">
              {!isAdmin && (
                <div className="relative">
                  <input 
                    type="password" 
                    autoFocus
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="비밀번호"
                    className={`w-full bg-neutral-50 border ${deleteError ? 'border-red-400 bg-red-50' : 'border-neutral-200'} rounded-xl px-4 py-3 text-center font-bold outline-none focus:border-indigo-500 transition-all`}
                  />
                  {deleteError && (
                    <p className="text-[10px] text-red-500 font-bold text-center mt-2">비밀번호 불일치</p>
                  )}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setDeleteTarget(null); setDeletePassword(''); setDeleteError(false); }} className="flex-1 py-3 bg-neutral-100 text-neutral-500 rounded-lg font-bold text-xs hover:bg-neutral-200">취소</button>
                <button type="submit" className="flex-1 py-3 bg-red-500 text-white rounded-lg font-bold text-xs hover:bg-red-600 shadow-lg">삭제</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default BulletinBoard;
