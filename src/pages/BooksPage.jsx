import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  QrCode,
  Calendar,
  User
} from 'lucide-react';
import { bookApi } from '../api/bookApi';
import { reservationApi } from '../api/reservationApi';
import { authApi } from '../api/authApi';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const BooksPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const { hasRole, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: bookApi.getAllBooks
  });

  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: !!user // Only run if user is authenticated
  });

  const addBookMutation = useMutation({
    mutationFn: bookApi.addBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      setIsAddModalOpen(false);
      toast.success('Book added successfully!');
    }
  });

  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }) => bookApi.updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      setIsEditModalOpen(false);
      setSelectedBook(null);
      toast.success('Book updated successfully!');
    }
  });

  const deleteBookMutation = useMutation({
    mutationFn: bookApi.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      toast.success('Book deleted successfully!');
    }
  });

  const reserveBookMutation = useMutation({
    mutationFn: ({ userId, bookId }) => reservationApi.create(userId, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      toast.success('Book reserved successfully!');
    }
  });

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  const handleReserveBook = async (bookId) => {
    if (!user) {
      toast.error('Please login to reserve a book');
      return;
    }
    
    if (!currentUser?.id) {
      toast.error('Loading user information... Please try again in a moment.');
      return;
    }

    try {
      reserveBookMutation.mutate({ userId: currentUser.id, bookId });
    } catch (error) {
      toast.error('Failed to reserve book. Please try again.');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBookMutation.mutate(bookId);
    }
  };

  if (booksLoading || userLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader size="large" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Books</h1>
            <p className="text-gray-600">Manage your library collection</p>
          </div>
          {hasRole('LIBRARIAN') && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Add Book
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Book Image */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center">
                {book.imageUrl ? (
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookOpen className="h-16 w-16 text-gray-400" />
                )}
              </div>

              {/* Book Details */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">by {book.author}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>ISBN: {book.isbn}</span>
                  {book.qrCodeUrl && (
                    <QrCode className="h-4 w-4" />
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Available: {book.availableCopies}/{book.totalCopies}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    book.availableCopies > 0 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {!hasRole('LIBRARIAN') && !hasRole('GLOBAL_ADMIN') && (
                    book.availableCopies > 0 ? (
                      <Button
                        size="small"
                        onClick={() => handleReserveBook(book.id)}
                        disabled={reserveBookMutation.isLoading || userLoading}
                        className="flex-1"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        {userLoading ? 'Loading...' : 'Reserve'}
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        disabled
                        variant="secondary"
                        className="flex-1"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Out of Stock
                      </Button>
                    )
                  )}
                  
                  {(hasRole('LIBRARIAN') || hasRole('GLOBAL_ADMIN')) && (
                    <>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          setSelectedBook(book);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDeleteBook(book.id)}
                        disabled={deleteBookMutation.isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Book Modal */}
        <AddBookModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(bookData) => addBookMutation.mutate(bookData)}
          isLoading={addBookMutation.isLoading}
        />

        {/* Edit Book Modal */}
        <EditBookModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedBook(null);
          }}
          book={selectedBook}
          onSubmit={(bookData) => updateBookMutation.mutate({ id: selectedBook.id, data: bookData })}
          isLoading={updateBookMutation.isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

// Add Book Modal Component
const AddBookModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    totalCopies: 1,
    availableCopies: 1,
    category: '',
    imageUrl: ''
  });

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      totalCopies: 1,
      availableCopies: 1,
      category: '',
      imageUrl: ''
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Book"
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              required
              value={formData.isbn}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Copies
            </label>
            <input
              type="number"
              name="totalCopies"
              required
              min="1"
              value={formData.totalCopies}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available Copies
            </label>
            <input
              type="number"
              name="availableCopies"
              required
              min="0"
              max={formData.totalCopies}
              value={formData.availableCopies}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL (Optional)
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            isLoading={isLoading}
            className="flex-1"
          >
            Add Book
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Edit Book Modal Component
const EditBookModal = ({ isOpen, onClose, book, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    totalCopies: 1,
    availableCopies: 1,
    category: '',
    imageUrl: ''
  });

  // Initialize form data when book changes
  React.useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        totalCopies: book.totalCopies || 1,
        availableCopies: book.availableCopies || 1,
        category: book.category || '',
        imageUrl: book.imageUrl || ''
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!book) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Book"
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              required
              value={formData.isbn}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Copies
            </label>
            <input
              type="number"
              name="totalCopies"
              required
              min="1"
              value={formData.totalCopies}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available Copies
            </label>
            <input
              type="number"
              name="availableCopies"
              required
              min="0"
              max={formData.totalCopies}
              value={formData.availableCopies}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL (Optional)
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            isLoading={isLoading}
            className="flex-1"
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BooksPage;