import React, { useState } from 'react';
import type { ITodo } from '../Interfaces/Todo';

interface TodoItemProps {
  todo: ITodo;
  onDelete: (id: number) => void;
  onUpdate: (id: number, newText: string) => void;
  onToggleComplete: (id: number) => void;
  isDarkMode: boolean; // YENİ: Gece modu bilgisi
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onUpdate, onToggleComplete, isDarkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim() !== '') {
      onUpdate(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'Spor': return isDarkMode ? 'bg-orange-900/40 text-orange-400 border-orange-800' : 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Ders': return isDarkMode ? 'bg-blue-900/40 text-blue-400 border-blue-800' : 'bg-blue-100 text-blue-700 border-blue-200';
      case 'İş': return isDarkMode ? 'bg-purple-900/40 text-purple-400 border-purple-800' : 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Alışveriş': return isDarkMode ? 'bg-pink-900/40 text-pink-400 border-pink-800' : 'bg-pink-100 text-pink-700 border-pink-200';
      default: return isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 mb-4 rounded-2xl border transition-all duration-300 ${
      todo.isCompleted && !isEditing 
        ? (isDarkMode ? 'bg-emerald-900/20 border-emerald-800 opacity-60' : 'bg-emerald-50 border-emerald-200 opacity-70') 
        : (isDarkMode ? 'bg-slate-800 border-slate-700 shadow-md hover:shadow-lg hover:border-slate-600' : 'bg-white border-slate-200 shadow-sm hover:shadow-md')
    }`}>
      
      <div className="flex items-start gap-4 flex-1 mb-4 sm:mb-0 w-full">
        <button 
          onClick={() => onToggleComplete(todo.id)}
          disabled={isEditing}
          className={`mt-1 w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full border-2 transition-colors ${
            isEditing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          } ${
            todo.isCompleted 
              ? 'bg-emerald-500 border-emerald-500' 
              : (isDarkMode ? 'border-slate-500 hover:border-emerald-500' : 'border-slate-300 hover:border-emerald-400')
          }`}
        >
          {todo.isCompleted && <span className="text-white text-sm">✓</span>}
        </button>
        
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${getCategoryStyle(todo.category)}`}>
              {todo.category}
            </span>
            {todo.duration && todo.duration !== 'Belirtilmedi' && (
              <span className={`text-xs flex items-center gap-1 font-medium px-2 py-0.5 rounded-md ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'text-slate-500 bg-slate-100'}`}>
                ⏱ {todo.duration}
              </span>
            )}
          </div>
          
          {isEditing ? (
            <div className="mt-1 w-full max-w-md">
              <input 
                type="text" 
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors shadow-inner ${
                  isDarkMode ? 'bg-slate-900 border-indigo-500 text-white focus:border-indigo-400' : 'bg-indigo-50 border-indigo-300 text-slate-800 focus:border-indigo-600'
                }`}
                autoFocus
              />
            </div>
          ) : (
            <span className={`text-lg font-medium transition-all duration-300 break-words ${
              todo.isCompleted 
                ? 'line-through text-slate-500' 
                : (isDarkMode ? 'text-slate-100' : 'text-slate-800')
            }`}>
              {todo.text}
            </span>
          )}

          <span className={`text-xs font-medium mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Oluşturulma: {todo.date}
          </span>
        </div>
      </div>
      
      <div className="flex gap-2 shrink-0 self-end sm:self-auto">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors cursor-pointer">
              Kaydet
            </button>
            <button onClick={handleCancel} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              İptal
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
              ✎ Düzenle
            </button>
            <button onClick={() => onDelete(todo.id)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'bg-rose-900/30 text-rose-400 hover:bg-rose-900/60' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}>
              Sil
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;