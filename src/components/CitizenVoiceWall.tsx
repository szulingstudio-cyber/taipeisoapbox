import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Heart, 
  MapPin, 
  Sparkles, 
  Waves, 
  Check, 
  User, 
  Tag 
} from 'lucide-react';
import { TAIPEI_DISTRICTS } from '../data/policies';
import { TaipeiDistrict } from '../types';

interface CitizenMessage {
  id: string;
  name: string;
  role: string;
  districtId: TaipeiDistrict;
  districtName: string;
  message: string;
  likes: number;
  timeAgo: string;
  isUserCreated?: boolean;
}

const INITIAL_MESSAGES: CitizenMessage[] = [
  {
    id: 'msg-1',
    name: '林先生',
    role: '士林租屋工程師',
    districtId: 'shilin',
    districtName: '士林區',
    message: '希望社會住宅輪候制真的能落實！在台北租房子每個月薪水三分之一都沒了，請幫年輕人留下安居的尊嚴！',
    likes: 86,
    timeAgo: '2 小時前'
  },
  {
    id: 'msg-2',
    name: '張媽媽',
    role: '民生社區推車媽媽',
    districtId: 'songshan',
    districtName: '松山區',
    message: '推嬰兒車走在巷子裡真的很危險，非常支持連續性實體人行道，讓老人和小孩走路免於恐懼！',
    likes: 124,
    timeAgo: '4 小時前'
  },
  {
    id: 'msg-3',
    name: '陳同學',
    role: '台大研究生 / 跨市通勤族',
    districtId: 'neihu',
    districtName: '內湖區',
    message: '內科上下班的公車真的太難擠了，AI智慧動態號誌和快巴專用道請一定要推動！',
    likes: 72,
    timeAgo: '昨天'
  },
  {
    id: 'msg-4',
    name: '阿美姐',
    role: '文山區退休長輩',
    districtId: 'wenshan',
    districtName: '文山區',
    message: '一國中學區一日照中心的構想太好了，讓長輩能在熟悉的社區活動，子女也比較放心上班！',
    likes: 95,
    timeAgo: '2 天前'
  }
];

const STORAGE_KEY = 'taipei_citizen_messages_v1';

export const CitizenVoiceWall: React.FC = () => {
  const [messages, setMessages] = useState<CitizenMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [inputName, setInputName] = useState('');
  const [inputRole, setInputRole] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<TaipeiDistrict>('shilin');
  const [inputMessage, setInputMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const districtObj = TAIPEI_DISTRICTS.find((d) => d.id === selectedDistrict);
    const newMsg: CitizenMessage = {
      id: `user-msg-${Date.now()}`,
      name: inputName.trim() || '熱心市民',
      role: inputRole.trim() || `${districtObj?.name || '台北'}在地市民`,
      districtId: selectedDistrict,
      districtName: districtObj?.name || '台北市',
      message: inputMessage.trim(),
      likes: 1,
      timeAgo: '剛剛',
      isUserCreated: true
    };

    setMessages([newMsg, ...messages]);
    setInputMessage('');
    setInputName('');
    setInputRole('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleToggleLike = (id: string) => {
    if (likedIds.includes(id)) {
      setLikedIds(likedIds.filter((mId) => mId !== id));
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, likes: m.likes - 1 } : m))
      );
    } else {
      setLikedIds([...likedIds, id]);
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m))
      );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/90 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-600 mb-1">
            <MessageSquare className="w-4 h-4 text-orange-600" />
            <span>肥皂箱市民留言牆 · 換你站上台發聲</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            換你站上肥皂箱！我想說的是...
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            每一位市民的真實感受，都是推動台北新洋流的重要湧浪。如果有其他市政建議想提出，請至官方「市長，你給我聽好」留言：<a href="https://puma.taipei/taipeispeaksup" target="_blank" rel="noopener noreferrer" className="underline font-bold text-orange-600 hover:text-orange-700">https://puma.taipei/taipeispeaksup</a>
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-orange-50 text-orange-800 border border-orange-200 px-3 py-1 rounded-xl shrink-0">
          累計收到 {messages.length} 則市民心聲
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Form (5 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 bg-neutral-50 p-5 rounded-2xl border border-neutral-200/90 space-y-3.5">
          <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
            站上肥皂箱留言：
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">
                暱稱 / 稱呼
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="例如：陳小姐"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:border-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">
                你的身份 / 角色
              </label>
              <input
                type="text"
                value={inputRole}
                onChange={(e) => setInputRole(e.target.value)}
                placeholder="例如：內科通勤族"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:border-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-600 block mb-1">
              關注行政區
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value as TaipeiDistrict)}
              className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:border-orange-500 focus:outline-hidden font-medium"
            >
              {TAIPEI_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.landmark})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-600 block mb-1">
              你想跟市長說的話（生活痛點或政見期待）：
            </label>
            <textarea
              required
              rows={3}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="分享你在台北的生活觀察、交通心聲、租屋困擾或對城市的期待..."
              className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:border-orange-500 focus:outline-hidden leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>送出我的市民心聲</span>
          </button>

          {isSubmitted && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-1.5 font-bold border border-emerald-200">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>感謝你的發聲！留言已即時發布在下方肥皂箱牆面。</span>
            </div>
          )}
        </form>

        {/* Right Messages Wall (7 cols) */}
        <div className="lg:col-span-7 space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {messages.map((msg) => {
            const hasLiked = likedIds.includes(msg.id);
            return (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl border transition-all ${
                  msg.isUserCreated
                    ? 'bg-orange-50/70 border-orange-300 shadow-2xs'
                    : 'bg-white border-neutral-200 hover:border-orange-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-[10px]">
                      {msg.name.slice(0, 1)}
                    </span>
                    <span>{msg.name}</span>
                    <span className="text-[11px] text-neutral-400 font-normal">
                      · {msg.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-semibold">
                      {msg.districtName}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {msg.timeAgo}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium">
                  {msg.message}
                </p>

                <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                  <span className="text-orange-600 font-semibold flex items-center gap-1">
                    <Waves className="w-3 h-3 text-orange-500" />
                    <span>公民發聲紀錄</span>
                  </span>

                  <button
                    onClick={() => handleToggleLike(msg.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      hasLiked
                        ? 'bg-orange-500 text-white font-bold'
                        : 'bg-neutral-100 hover:bg-orange-100 text-neutral-600 hover:text-orange-800'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${hasLiked ? 'fill-white' : ''}`} />
                    <span>共鳴 ({msg.likes})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
