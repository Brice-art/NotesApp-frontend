export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now - d);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const COLORS = [
  { name: 'Yellow', value: '#fef3c7' },
  { name: 'Blue', value: '#dbeafe' },
  { name: 'Pink', value: '#fce7f3' },
  { name: 'Green', value: '#dcfce7' },
  { name: 'Purple', value: '#f3e8ff' },
  { name: 'Orange', value: '#fed7aa' },
];