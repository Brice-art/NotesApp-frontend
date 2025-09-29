import { useState } from 'react';
import { Pin, Edit2, Trash2, Archive } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const NoteCard = ({ note, viewMode, onEdit, onDelete, onPin, onArchive }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`relative bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 ${
        viewMode === 'list' ? 'flex items-start' : ''
      }`}
      style={{ borderTopColor: note.color, borderTopWidth: '4px' }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-lg pr-8">{note.title}</h3>
          {note.isPinned && (
            <Pin className="w-4 h-4 text-blue-600 fill-blue-600" />
          )}
        </div>
        <p className="text-gray-600 text-sm mb-3 whitespace-pre-wrap line-clamp-4">
          {note.content}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded">{note.category}</span>
          <span>{formatDate(note.createdAt)}</span>
        </div>
      </div>

      {showActions && (
        <div className="absolute top-2 right-2 flex gap-1 bg-white rounded-lg shadow-lg p-1">
          <button
            onClick={() => onPin(note._id)}
            className={`p-2 hover:bg-blue-50 rounded transition ${
              note.isPinned ? 'text-blue-600' : 'text-gray-400'
            }`}
            title={note.isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(note)}
            className="p-2 hover:bg-green-50 rounded text-green-600 transition"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {!note.isArchived && (
            <button
              onClick={() => onArchive(note._id)}
              className="p-2 hover:bg-yellow-50 rounded text-yellow-600 transition"
              title="Archive"
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(note._id)}
            className="p-2 hover:bg-red-50 rounded text-red-600 transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteCard;