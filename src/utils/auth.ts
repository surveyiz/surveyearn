import { User } from '../types';

interface RegisterData extends Omit<User, 'id' | 'createdAt'> {
  referredBy?: string | null;
}

// Helper function to clear user-specific data
const clearUserData = () => {
  localStorage.removeItem('completedSurveys');
  localStorage.removeItem('earnings');
  localStorage.removeItem('subscription');
  localStorage.removeItem('paymentMethods');
  localStorage.removeItem('lastPasswordChange');
};

export const registerUser = (userData: RegisterData): User => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Check if email already exists
  const existingUser = users.find((user: User) => user.email.toLowerCase() === userData.email.toLowerCase());
  if (existingUser) {
    throw new Error('An account with this email already exists. Please sign in instead.');
  }

  // Check if referral code is valid
  if (userData.referredBy) {
    const referrer = users.find((user: User) => user.id.slice(0, 8).toUpperCase() === userData.referredBy);
    if (!referrer) {
      throw new Error('Invalid referral code');
    }
  }

  const newUser: User = {
    ...userData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Clear any existing user data before setting new session
  clearUserData();
  
  // Set current user session
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  localStorage.setItem('currentUserEmail', newUser.email.toLowerCase());

  return newUser;
};

export const loginUser = (email: string, password: string): User => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: User) => 
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const currentUserEmail = localStorage.getItem('currentUserEmail');
  
  // If a different user is already logged in, clear their data
  if (currentUserEmail && currentUserEmail !== email.toLowerCase()) {
    clearUserData();
  }

  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('currentUserEmail', user.email.toLowerCase());
  
  return user;
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  
  if (!userStr || !currentUserEmail) {
    return null;
  }
  
  const user = JSON.parse(userStr);
  
  // Verify the stored email matches the current user
  if (user.email.toLowerCase() !== currentUserEmail) {
    logoutUser();
    return null;
  }
  
  return user;
};

export const logoutUser = () => {
  clearUserData();
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentUserEmail');
};