import React, { useState, useEffect } from 'react';
import type { ITodo } from '../Interfaces/Todo';
import TodoItem from '../Components/TodoItem';

// --- YENİ: KENDİ YAZDIĞIMIZ ANİMASYON SİHRİ ---
const customStyles = `
  @keyframes slideInUp {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-in-up {
    animation: slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<ITodo[]>(() => {
    const saved = localStorage.getItem('pro-takip-verileri');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('pro-takip-darkmode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'add'>('list');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState('Kişisel');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    localStorage.setItem('pro-takip-verileri', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('pro-takip-darkmode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const showToast = (message: string, type: 'success' | 'danger' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() === '') return;
    
    const timeNow = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const newTodo: ITodo = {
      id: Date.now(),
      text: inputValue,
      isCompleted: false,
      date: timeNow,
      category: category,
      duration: duration || 'Belirtilmedi',
    };
    
    setTodos([newTodo, ...todos]);
    setInputValue(''); setDuration(''); setCategory('Kişisel');
    setCurrentView('list'); setFilter('all');
    showToast('Görev başarıyla eklendi! 🚀', 'success');
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    showToast('Görev silindi! 🗑️', 'danger');
  };

  const handleUpdateTodo = (id: number, newText: string) => {
    setTodos(todos.map((todo) => todo.id === id ? { ...todo, text: newText } : todo));
    showToast('Görev güncellendi! ✏️', 'info');
  };

  const handleToggleComplete = (id: number) => {
    setTodos(todos.map((todo) => {
      if (todo.id === id) {
        const isNowCompleted = !todo.isCompleted;
        isNowCompleted ? showToast('Harika! Görev tamamlandı. 🎉', 'success') : showToast('Görev geri alındı.', 'info');
        return { ...todo, isCompleted: isNowCompleted };
      }
      return todo;
    }));
  };

  const handleClearAll = () => {
    if (window.confirm('Tüm görevleri silmek istediğinize emin misiniz?')) {
      setTodos([]);
      setIsMenuOpen(false);
      showToast('Tüm görevler temizlendi! ✨', 'danger');
    }
  };

  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.isCompleted).length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.isCompleted;
    if (filter === 'completed') return todo.isCompleted;
    return true; 
  });

  return (
    <div className={`min-h-screen flex overflow-hidden relative transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      
      {/* SİHİRLİ ANİMASYON STİLLERİMİZİ İÇERİ YÜKLÜYORUZ */}
      <style>{customStyles}</style>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 transition-opacity backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
      )}

      {/* SOL MENÜ */}
      <div className={`fixed inset-y-0 left-0 w-64 text-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out flex flex-col ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isDarkMode ? 'bg-slate-950 border-r border-slate-800' : 'bg-indigo-900'}`}>
        <div className="p-6 flex-1">
          <h2 className={`text-2xl font-bold mb-8 border-b pb-4 transition-colors duration-300 ${isDarkMode ? 'text-slate-200 border-slate-800' : 'text-indigo-100 border-indigo-700'}`}>Menü</h2>
          <nav className="space-y-4">
            <button onClick={() => { setCurrentView('list'); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${currentView === 'list' ? (isDarkMode ? 'bg-indigo-600 font-bold shadow-lg shadow-indigo-900/50' : 'bg-indigo-700 font-bold shadow-lg') : (isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-indigo-800')}`}>
              📋 Görevlerim
            </button>
            <button onClick={() => { setCurrentView('add'); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${currentView === 'add' ? (isDarkMode ? 'bg-indigo-600 font-bold shadow-lg shadow-indigo-900/50' : 'bg-indigo-700 font-bold shadow-lg') : (isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-indigo-800')}`}>
              ➕ Yeni Görev Ekle
            </button>
            <button onClick={handleClearAll} className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 mt-8 ${isDarkMode ? 'text-rose-400 hover:bg-rose-900/50 hover:text-rose-200' : 'text-rose-200 hover:bg-rose-600 hover:text-white'}`}>
              🗑️ Tümünü Temizle
            </button>
          </nav>
        </div>
        
        <div className={`p-6 border-t transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-indigo-800'}`}>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
              isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700 hover:scale-105' : 'bg-indigo-800 text-indigo-100 hover:bg-indigo-950 hover:scale-105'
            }`}
          >
            {isDarkMode ? '☀️ Gündüz Modu' : '🌙 Gece Modu'}
          </button>
        </div>
      </div>

      {/* ANA İÇERİK ALANI */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        <header className={`${isDarkMode ? 'bg-slate-950 border-b border-slate-800' : 'bg-indigo-600'} text-white shadow-md sticky top-0 z-30 transition-colors duration-500`}>
          <div className="px-4 py-4 flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(true)} className={`p-2 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-indigo-700'}`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Günlük Takip Paneli</h1>
          </div>
          
          {currentView === 'list' && (
            <div className={`px-6 py-4 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/50' : 'bg-indigo-700'}`}>
              <div className={`flex justify-between text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-indigo-100'}`}>
                <span>Günlük İlerleme</span>
                <span>{progressPercent}% ({completedTasks}/{totalTasks})</span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-indigo-900'}`}>
                <div className={`h-full rounded-full transition-all duration-1000 ease-out ${isDarkMode ? 'bg-indigo-500' : 'bg-emerald-400'}`} style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          )}
        </header>

        <main className="p-4 sm:p-8 flex-1 flex justify-center items-start">
          <div className="w-full max-w-3xl">
            
            {/* YENİ EKLEME FORMU */}
            {currentView === 'add' && (
              <div className={`rounded-3xl shadow-xl p-6 sm:p-10 border transition-all duration-500 animate-slide-in-up ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`} style={{ opacity: 0 }}>
                <h2 className={`text-3xl font-extrabold mb-8 border-b pb-4 ${isDarkMode ? 'text-white border-slate-700' : 'text-slate-800 border-slate-200'}`}>Yeni Görev Oluştur</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Ne yapacaksın?</label>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Örn: 10 sayfa kitap oku..."
                      className={`w-full px-5 py-4 rounded-xl border-2 focus:outline-none text-lg transition-colors duration-300 ${
                        isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500 placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Kategori</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`w-full px-4 py-4 rounded-xl border-2 focus:outline-none cursor-pointer transition-colors duration-300 ${
                          isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500'
                        }`}
                      >
                        <option value="Kişisel">Kişisel</option>
                        <option value="Spor">Spor</option>
                        <option value="Ders">Ders</option>
                        <option value="İş">İş</option>
                        <option value="Alışveriş">Alışveriş</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Ne kadar sürecek?</label>
                      <input
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Örn: 45 Dk, 2 Saat..."
                        className={`w-full px-4 py-4 rounded-xl border-2 focus:outline-none transition-colors duration-300 ${
                          isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500 placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddTodo}
                    className={`w-full mt-6 py-4 font-bold text-lg text-white rounded-xl shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                      isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/50' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300'
                    }`}
                  >
                    🚀 Görevi Kaydet
                  </button>
                </div>
              </div>
            )}

            {/* GÖREV LİSTESİ */}
            {currentView === 'list' && (
              <div>
                {todos.length > 0 && (
                  <div className={`flex justify-center mb-8 p-1.5 rounded-2xl w-full max-w-md mx-auto transition-colors duration-500 animate-slide-in-up ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200/50'}`} style={{ opacity: 0 }}>
                    {['all', 'active', 'completed'].map((f) => (
                      <button 
                        key={f}
                        onClick={() => setFilter(f as any)} 
                        className={`flex-1 px-4 py-2 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 ${
                          filter === f 
                            ? (isDarkMode ? 'bg-slate-600 text-white shadow-md transform scale-105' : 'bg-white text-indigo-700 shadow-md transform scale-105') 
                            : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')
                        }`}
                      >
                        {f === 'all' ? 'Tümü' : f === 'active' ? 'Devam Edenler' : 'Tamamlananlar'}
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-1">
                  {todos.length === 0 ? (
                    <div className={`rounded-3xl p-12 text-center shadow-sm border mt-10 transition-all duration-500 animate-slide-in-up ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`} style={{ opacity: 0 }}>
                      <div className="text-6xl mb-4 animate-bounce">✨</div>
                      <p className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Harika görünüyorsun!</p>
                      <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Şu an hiçbir görevin yok. Sol üstteki menüden hemen yeni bir görev ekleyebilirsin.</p>
                    </div>
                  ) : filteredTodos.length === 0 ? (
                    <div className={`text-center py-10 mt-6 rounded-3xl border shadow-sm transition-all duration-500 animate-slide-in-up ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`} style={{ opacity: 0 }}>
                      <div className="text-4xl mb-3">🔍</div>
                      <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Bu sekmede gösterilecek görev bulunamadı.</p>
                    </div>
                  ) : (
                    // YENİ: GÖREVLERİN SIRAYLA (STAGGERED) EKRANA GELMESİ
                    filteredTodos.map((todo, index) => (
                      <div 
                        key={todo.id} 
                        className="animate-slide-in-up"
                        style={{ 
                          opacity: 0, 
                          animationDelay: `${index * 0.08}s` // Her bir eleman 0.08 saniye gecikmeli gelir
                        }}
                      >
                        <TodoItem
                          todo={todo}
                          onDelete={handleDeleteTodo}
                          onUpdate={handleUpdateTodo}
                          onToggleComplete={handleToggleComplete}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce">
          <div className={`px-6 py-4 rounded-xl shadow-2xl text-white font-bold flex items-center gap-3 transition-all duration-300 ${
            toast.type === 'success' ? 'bg-emerald-500' : 
            toast.type === 'danger' ? 'bg-rose-500' : 'bg-indigo-500'
          }`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default TodoApp;