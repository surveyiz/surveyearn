export interface NavLink {
  name: string;
  path: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  feedback: string;
  rating: number;
  avatar: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}