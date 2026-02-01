// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to load cart from localStorage
  const loadCart = () => {
    try {
      const stored = localStorage.getItem("cart");
      const parsedCart = stored ? JSON.parse(stored) : [];
      console.log("📦 Cart loaded:", parsedCart); // Debug log
      setCart(parsedCart);
    } catch (error) {
      console.error("Error loading cart:", error);
      setCart([]);
    }
  };

  // Load cart on mount and whenever route changes
  useEffect(() => {
    loadCart();
  }, [location]);

  // Also reload when window gains focus (tab switch)
  useEffect(() => {
    const handleFocus = () => {
      loadCart();
    };
    
    window.addEventListener("focus", handleFocus);
    
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("💾 Cart saved:", cart); // Debug log
    }
  }, [cart]);

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.id !== id);
      // Update localStorage immediately
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    navigate("/payment");
  };

  const handleBackToMenu = () => {
    navigate("/menu");
  };

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={handleBackToMenu}>
          ← Back to Menu
        </BackButton>
        <Title>Your Cart</Title>
        {cart.length > 0 && (
          <CartCount>{cart.length} {cart.length === 1 ? 'item' : 'items'}</CartCount>
        )}
      </Header>

      {cart.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🛒</EmptyIcon>
          <EmptyText>Your cart is empty</EmptyText>
          <EmptySubtext>Add some delicious items from our menu!</EmptySubtext>
          <BackToMenuBtn onClick={handleBackToMenu}>
            Browse Menu
          </BackToMenuBtn>
        </EmptyState>
      ) : (
        <>
          <CartList>
            {cart.map((item) => (
              <CartItem key={item.id}>
                <ItemImage src={item.image} alt={item.name} />
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>₹{item.price} each</ItemPrice>
                  <QtyControl>
                    <QtyBtn onClick={() => changeQty(item.id, -1)}>−</QtyBtn>
                    <QtyText>{item.quantity}</QtyText>
                    <QtyBtn onClick={() => changeQty(item.id, 1)}>+</QtyBtn>
                  </QtyControl>
                </ItemDetails>
                <ItemRight>
                  <ItemSubtotal>₹{item.quantity * item.price}</ItemSubtotal>
                  <RemoveBtn onClick={() => removeItem(item.id)}>
                    🗑️ Remove
                  </RemoveBtn>
                </ItemRight>
              </CartItem>
            ))}
          </CartList>

          <Summary>
            <TotalText>Total:</TotalText>
            <TotalPrice>₹{total}</TotalPrice>
          </Summary>

          <CheckoutButton onClick={handlePayment}>
            Proceed to Payment
          </CheckoutButton>
        </>
      )}
    </Wrapper>
  );
}

/* Styled Components */

const Wrapper = styled.div`
  padding: 30px 20px;
  max-width: 900px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  gap: 16px;
  flex-wrap: wrap;
`;

const BackButton = styled.button`
  background: white;
  border: 2px solid #e5e7eb;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #2563eb;
    color: #2563eb;
    transform: translateX(-4px);
  }
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  flex: 1;
`;

const CartCount = styled.div`
  background: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

const CartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const CartItem = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  gap: 20px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  background: #f3f4f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ItemDetails = styled.div`
  flex: 2;
  min-width: 150px;
`;

const ItemName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
`;

const ItemPrice = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 12px;
  width: fit-content;
`;

const QtyBtn = styled.button`
  width: 36px;
  height: 36px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: #1d4ed8;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const QtyText = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  min-width: 30px;
  text-align: center;
`;

const ItemRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`;

const ItemSubtotal = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: #2563eb;
  white-space: nowrap;
`;

const RemoveBtn = styled.button`
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #fecaca;
    transform: scale(1.05);
  }
`;

const Summary = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  border-top: 2px solid #e5e7eb;
  margin-top: 24px;
  padding-top: 20px;
`;

const TotalText = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
`;

const TotalPrice = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #2563eb;
`;

const CheckoutButton = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 18px;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(37, 99, 235, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const EmptyIcon = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyText = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const EmptySubtext = styled.div`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 30px;
`;

const BackToMenuBtn = styled.button`
  padding: 14px 32px;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
  }
`;
