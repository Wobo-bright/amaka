export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Headphones",
    price: 299.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    available: true,
    description: "High-quality wireless headphones with noise cancellation"
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    price: 449.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    available: true,
    description: "Advanced fitness tracking and smart notifications"
  },
  {
    id: "3",
    name: "Leather Backpack",
    price: 189.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    available: true,
    description: "Handcrafted genuine leather backpack"
  },
  {
    id: "4",
    name: "Running Shoes",
    price: 159.99,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
    available: false,
    description: "Lightweight performance running shoes"
  },
  {
    id: "5",
    name: "Minimalist Wallet",
    price: 79.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop",
    available: true,
    description: "Slim RFID-blocking leather wallet"
  },
  {
    id: "6",
    name: "Wireless Speaker",
    price: 199.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
    available: true,
    description: "Portable Bluetooth speaker with 20hr battery"
  }
];

export const categories = ["All", "Electronics", "Accessories", "Footwear"];
