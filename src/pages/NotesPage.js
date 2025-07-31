import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, Save, X, BookOpen, Lightbulb, Heart } from 'lucide-react';

const NotesPage = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('productivity-notes');
    if (savedNotes) {
      return JSON.parse(savedNotes);
    }
    return [
      {
        id: 1,
        title: 'Welcome to Notes!',
        content: 'This is your personal note-taking space. You can create, edit, and organize all your thoughts here.',
        category: 'personal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Daily Journal Entry',
        content: 'Today I started building my productivity app. It feels great to learn something new!',
        category: 'journal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'personal' });

  useEffect(() => {
    localStorage.setItem('productivity-notes', JSON.stringify(notes));
  }, [notes]);

  const categories = [
    { value: 'all', label: 'All Notes', icon: BookOpen, color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
    { value: 'personal', label: 'Personal', icon: Heart, color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
    { value: 'work', label: 'Work', icon: Lightbulb, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { value: 'journal', label: 'Journal', icon: BookOpen, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    { value: 'ideas', label: 'Ideas', icon: Lightbulb, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }
  ];

  const createNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note = {
        id: Date.now(),
        ...newNote,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '', category: 'personal' });
      setIsCreating(false);
    }
  };

  const updateNote = (id, updatedNote) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, ...updatedNote, updatedAt: new Date().toISOString() }
        : note
    ));
    setEditingId(null);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryConfig = (category) => {
    return categories.find(cat => cat.value === category) || categories[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const NoteCard = ({ note }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(note.title);
    const [editContent, setEditContent] = useState(note.content);
    const [editCategory, setEditCategory] = useState(note.category);

    const handleSave = () => {
      updateNote(note.id, {
        title: editTitle,
        content: editContent,
        category: editCategory
      });
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditCategory(note.category);
      setIsEditing(false);
    };

    const categoryConfig = getCategoryConfig(note.category);
    const Icon = categoryConfig.icon;

    return (
      <div className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-xl font-semibold border-none outline-none focus:ring-2 focus:ring-purple-500 rounded-lg p-2 dark:bg-gray-900 dark:text-white"
              placeholder="Note title..."
            />
            
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-900 dark:text-white"
            >
              {categories.slice(1).map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-32 resize-none border-none outline-none focus:ring-2 focus:ring-purple-500 rounded-lg p-2 dark:bg-gray-900 dark:text-white"
              placeholder="Write your note..."
            />
            
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon size={18} className="text-gray-600 dark:text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{note.title}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${categoryConfig.color}`}>
              {categoryConfig.label}
            </span>
            
            <p className="text-gray-600 dark:text-gray-200 leading-relaxed mb-4 whitespace-pre-wrap">
              {note.content.length > 200 ? `${note.content.substring(0, 200)}...` : note.content}
            </p>
            
            <div className="text-xs text-gray-400 dark:text-gray-400">
              <div>Created: {formatDate(note.createdAt)}</div>
              {note.updatedAt !== note.createdAt && (
                <div>Updated: {formatDate(note.updatedAt)}</div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            📝 Notes & Journal
          </h1>
          <p className="text-white/80 text-lg">Capture your thoughts, ideas, and daily reflections</p>
        </div>

        {/* Controls */}
        <div className="bg-white/95 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors dark:bg-gray-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      selectedCategory === category.value
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="font-medium text-sm">{category.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Add Note Button */}
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus size={20} />
              <span className="font-semibold">New Note</span>
            </button>
          </div>
        </div>

        {/* Create Note Modal */}
        {isCreating && (
          <div className="bg-white/95 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Create New Note</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors dark:bg-gray-900 dark:text-white"
              />
              
              <select
                value={newNote.category}
                onChange={(e) => setNewNote({...newNote, category: e.target.value})}
                className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white"
              >
                {categories.slice(1).map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              
              <textarea
                placeholder="Write your note..."
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                className="w-full h-32 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none resize-none transition-colors dark:bg-gray-900 dark:text-white"
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={createNote}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Save size={18} />
                  <span>Save Note</span>
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewNote({ title: '', content: '', category: 'personal' });
                  }}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {searchTerm || selectedCategory !== 'all' ? 'No matching notes' : 'No notes yet'}
            </h3>
            <p className="text-white/80 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter'
                : 'Start by creating your first note!'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <button
                onClick={() => setIsCreating(true)}
                className="px-6 py-3 bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 dark:hover:bg-gray-700 transition-colors"
              >
                Create Your First Note
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;