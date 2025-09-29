import { useState, useEffect } from 'react';
import { Plus, Search, Pin, Grid, List, Archive, Inbox } from 'lucide-react';
import { notesAPI, authAPI } from '../services/api';
import Header from '../components/Header';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAPI.checkSession();
        setUserName(response.data.user.name);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };
    fetchUser();
  }, []);

  // Fetch notes
  useEffect(() => {
    fetchNotes();
  }, [showArchived]);

  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await notesAPI.getAll({ isArchived: showArchived });
      setNotes(response.data.notes || []);
    } catch (err) {
      setError('Failed to load notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter notes based on search
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const regularNotes = filteredNotes.filter(note => !note.isPinned);

  const handleCreateNote = async (noteData) => {
    try {
      const response = await notesAPI.create(noteData);
      setNotes([response.data.note, ...notes]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create note:', err);
      alert('Failed to create note');
    }
  };

  const handleUpdateNote = async (noteData) => {
    try {
      const response = await notesAPI.update(editingNote._id, noteData);
      setNotes(notes.map(note => 
        note._id === editingNote._id ? response.data.note : note
      ));
      setEditingNote(null);
    } catch (err) {
      console.error('Failed to update note:', err);
      alert('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await notesAPI.delete(noteId);
      setNotes(notes.filter(note => note._id !== noteId));
    } catch (err) {
      console.error('Failed to delete note:', err);
      alert('Failed to delete note');
    }
  };

  const handlePinNote = async (noteId) => {
    try {
      const response = await notesAPI.pin(noteId);
      setNotes(notes.map(note => 
        note._id === noteId ? response.data.note : note
      ));
    } catch (err) {
      console.error('Failed to pin note:', err);
      alert('Failed to pin note');
    }
  };

  const handleArchiveNote = async (noteId) => {
    try {
      const response = await notesAPI.archive(noteId, true);
      setNotes(notes.filter(note => note._id !== noteId));
    } catch (err) {
      console.error('Failed to archive note:', err);
      alert('Failed to archive note');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={userName} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 items-center">
            {/* Archive Toggle */}
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                showArchived 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showArchived ? <Inbox className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
              {showArchived ? 'Active' : 'Archive'}
            </button>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* New Note Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
            >
              <Plus className="w-5 h-5" />
              New Note
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading notes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Notes Display */}
        {!loading && !error && (
          <>
            {/* Pinned Notes */}
            {pinnedNotes.length > 0 && !showArchived && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Pin className="w-5 h-5" />
                  Pinned Notes
                </h2>
                <NotesGrid 
                  notes={pinnedNotes} 
                  viewMode={viewMode} 
                  onEdit={setEditingNote} 
                  onDelete={handleDeleteNote} 
                  onPin={handlePinNote}
                  onArchive={handleArchiveNote}
                />
              </div>
            )}

            {/* Regular Notes */}
            {regularNotes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  {showArchived ? 'Archived Notes' : 'All Notes'}
                </h2>
                <NotesGrid 
                  notes={regularNotes} 
                  viewMode={viewMode} 
                  onEdit={setEditingNote} 
                  onDelete={handleDeleteNote} 
                  onPin={handlePinNote}
                  onArchive={handleArchiveNote}
                />
              </div>
            )}

            {/* Empty State */}
            {filteredNotes.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">
                  {searchQuery ? 'No notes found' : showArchived ? 'No archived notes' : 'No notes yet'}
                </p>
                {!searchQuery && !showArchived && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 text-blue-600 hover:underline font-medium"
                  >
                    Create your first note
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingNote) && (
        <NoteModal
          note={editingNote}
          onSave={editingNote ? handleUpdateNote : handleCreateNote}
          onClose={() => {
            setShowCreateModal(false);
            setEditingNote(null);
          }}
        />
      )}
    </div>
  );
};

// Notes Grid Component
function NotesGrid({ notes, viewMode, onEdit, onDelete, onPin, onArchive }) {
  return (
    <div className={viewMode === 'grid' 
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      : 'space-y-3'
    }>
      {notes.map(note => (
        <NoteCard 
          key={note._id} 
          note={note} 
          viewMode={viewMode}
          onEdit={onEdit}
          onDelete={onDelete}
          onPin={onPin}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}

export default Dashboard;