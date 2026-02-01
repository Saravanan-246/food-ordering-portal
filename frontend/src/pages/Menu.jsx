// src/pages/Menu.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function Menu() {
  const navigate = useNavigate();

  // Load cart from localStorage (first load)
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Professional menu items with real food data
  const menuItems = [
    { 
      id: 1, 
      name: "Masala Dosa", 
      price: 45, 
      category: "Breakfast",
      description: "Crispy dosa with potato masala",
      image: "https://myfoodstory.com/wp-content/uploads/2025/08/Mysore-Masala-Dosa-Recipe-3-500x375.jpg",
      rating: 4.5,
      popular: true
    },
    { 
      id: 2, 
      name: "Idli Sambar", 
      price: 35, 
      category: "Breakfast",
      description: "Steamed rice cakes with sambar",
      image: "https://www.shutterstock.com/image-photo/traditional-breakfast-south-india-idly-260nw-2460311521.jpg",
      rating: 4.3
    },
    { 
      id: 3, 
      name: "Vada Sambar", 
      price: 30, 
      category: "Breakfast",
      description: "Crispy vada with hot sambar",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVMFV57HoBznF7uj4vR-ZBeWp5PSDT7XxrAw&s",
      rating: 4.2
    },
    { 
      id: 4, 
      name: "Coffee", 
      price: 15, 
      category: "Beverages",
      description: "Hot filter coffee",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
      rating: 4.7,
      popular: true
    },
    { 
      id: 5, 
      name: "Tea", 
      price: 10, 
      category: "Beverages",
      description: "Fresh Indian masala tea",
      image: "https://www.munatycooking.com/wp-content/uploads/2024/04/Three-glasses-filled-with-karak-chai.jpg",
      rating: 4.4
    },
    { 
      id: 6, 
      name: "Vegetable Biryani", 
      price: 120, 
      category: "Meals",
      description: "Aromatic rice with mixed vegetables",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
      rating: 4.6,
      popular: true
    },
    { 
      id: 7, 
      name: "Paneer Butter Masala", 
      price: 140, 
      category: "Meals",
      description: "Paneer in rich tomato gravy",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop",
      rating: 4.8
    },
    { 
      id: 8, 
      name: "Fried Rice", 
      price: 80, 
      category: "Meals",
      description: "Chinese style fried rice",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
      rating: 4.1
    },
    { 
      id: 9, 
      name: "Veg Sandwich", 
      price: 50, 
      category: "Snacks",
      description: "Grilled sandwich with veggies",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
      rating: 4.3
    },
    { 
      id: 10, 
      name: "Samosa", 
      price: 20, 
      category: "Snacks",
      description: "Crispy samosa with chutney",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
      rating: 4.5
    },
  ];

  const categories = ["All", "Breakfast", "Meals", "Snacks", "Beverages"];

  // Sync cart with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add to cart - STAYS ON MENU PAGE
  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    // No navigation - user stays on menu to continue shopping
  };

  // Remove from cart
  const removeFromCart = (itemId) => {
    const existingItem = cart.find((cartItem) => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    } else {
      setCart(cart.filter((cartItem) => cartItem.id !== itemId));
    }
  };

  // Get cart total
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Handle checkout → go to CART
  const handleCheckout = () => {
    if (cartCount === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/cart");
  };

  return (
    <Container>
      {/* Header Section */}
      <Header>
        <HeaderContent>
          <Title>Our Menu</Title>
          <Subtitle>Fresh food prepared daily</Subtitle>
        </HeaderContent>
      </Header>

      {/* Fixed Filter Section */}
      <FixedFilterSection>
        {/* Search Bar */}
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="Search for dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchSection>

        {/* Category Filter */}
        <CategorySection>
          {categories.map((category) => (
            <CategoryChip
              key={category}
              $active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryChip>
          ))}
        </CategorySection>
      </FixedFilterSection>

      {/* Menu Grid */}
      <MenuGrid>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const cartItem = cart.find((c) => c.id === item.id);
            return (
              <MenuCard key={item.id}>
                {item.popular && <PopularBadge>Popular</PopularBadge>}
                <ImageContainer>
                  <ItemImage src={item.image} alt={item.name} />
                  <ImageOverlay />
                </ImageContainer>

                <CardContent>
                  <ItemHeader>
                    <ItemName>{item.name}</ItemName>
                    <Rating>⭐ {item.rating}</Rating>
                  </ItemHeader>
                  <ItemDescription>{item.description}</ItemDescription>
                  <ItemFooter>
                    <PriceTag>₹{item.price}</PriceTag>
                    {cartItem ? (
                      <QuantityControl>
                        <QuantityButton
                          onClick={() => removeFromCart(item.id)}
                        >
                          −
                        </QuantityButton>
                        <QuantityText>{cartItem.quantity}</QuantityText>
                        <QuantityButton onClick={() => addToCart(item)}>
                          +
                        </QuantityButton>
                      </QuantityControl>
                    ) : (
                      <AddButton onClick={() => addToCart(item)}>
                        Add to Cart
                      </AddButton>
                    )}
                  </ItemFooter>
                </CardContent>
              </MenuCard>
            );
          })
        ) : (
          <NoResults>
            <NoResultsIcon>🔍</NoResultsIcon>
            <NoResultsText>No items found</NoResultsText>
            <NoResultsSubtext>
              Try searching for something else
            </NoResultsSubtext>
          </NoResults>
        )}
      </MenuGrid>

      {/* Floating Cart Button → goes to Cart page */}
      {cartCount > 0 && (
        <FloatingCart onClick={handleCheckout}>
          <CartIcon>🛒</CartIcon>
          <CartDetails>
            <CartCount>{cartCount} items</CartCount>
            <CartTotal>₹{cartTotal}</CartTotal>
          </CartDetails>
          <CheckoutText>View Cart →</CheckoutText>
        </FloatingCart>
      )}
    </Container>
  );
}

/* ------------ Styled Components ------------ */

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 120px;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const HeaderContent = styled.div`
  display: inline-block;
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 0;
`;

/* FIXED FILTER SECTION - STAYS ON TOP WITH BETTER SPACING */
const FixedFilterSection = styled.div`
  position: sticky;
  top: 0;
  background: white;
  z-index: 50;
  padding: 24px 20px;
  margin: 0 -20px 40px -20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
`;

const SearchSection = styled.div`
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 24px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
  background: white;
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    transform: translateY(-2px);
  }
  &::placeholder {
    color: #9ca3af;
  }
`;

const CategorySection = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px 0 12px 0;
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
  }
`;

const CategoryChip = styled.button`
  padding: 12px 24px;
  border: 2px solid ${(props) => (props.$active ? "#2563eb" : "#e5e7eb")};
  background: ${(props) => (props.$active ? "#2563eb" : "white")};
  color: ${(props) => (props.$active ? "white" : "#4b5563")};
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  flex-shrink: 0;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #2563eb;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const MenuCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
`;

const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
  ${MenuCard}:hover & {
    transform: scale(1.1);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.3),
    transparent
  );
`;

const CardContent = styled.div`
  padding: 20px;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 8px;
`;

const ItemName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  flex: 1;
`;

const Rating = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #f59e0b;
  white-space: nowrap;
  margin-left: 8px;
`;

const ItemDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const ItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const PriceTag = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #2563eb;
`;

const AddButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
  }
  &:active {
    transform: translateY(0);
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 12px;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #1d4ed8;
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.95);
  }
`;

const QuantityText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  min-width: 24px;
  text-align: center;
`;

const FloatingCart = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  left: 30px;
  max-width: 600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  border: none;
  padding: 20px 28px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.4);
  transition: all 0.3s;
  z-index: 100;
  animation: slideUp 0.4s ease;
  
  @keyframes slideUp {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(37, 99, 235, 0.5);
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    left: 16px;
    right: 16px;
    bottom: 20px;
  }
`;

const CartIcon = styled.div`
  font-size: 32px;
`;

const CartDetails = styled.div`
  flex: 1;
  text-align: left;
`;

const CartCount = styled.div`
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 2px;
`;

const CartTotal = styled.div`
  font-size: 22px;
  font-weight: 800;
`;

const CheckoutText = styled.div`
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
`;

const NoResults = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
`;

const NoResultsIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const NoResultsText = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
`;

const NoResultsSubtext = styled.div`
  font-size: 14px;
  color: #9ca3af;
`;
