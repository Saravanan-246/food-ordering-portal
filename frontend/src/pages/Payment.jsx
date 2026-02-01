// src/pages/Payment.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    
    if (storedCart.length === 0) {
      navigate("/menu");
    }
  }, [navigate]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handleBackToCart = () => {
    navigate("/cart");
  };

  const handlePay = () => {
    if (total <= 0) return;
    setLoading(true);

    if (paymentMethod === "cod") {
      setTimeout(() => {
        createOrder("COD-" + Date.now(), "Cash on Delivery");
        setLoading(false);
      }, 1000);
      return;
    }

    if (paymentMethod === "upi") {
      setTimeout(() => {
        createOrder("UPI-" + Date.now(), "UPI Payment");
        setLoading(false);
      }, 1500);
      return;
    }

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID",
      amount: total * 100,
      currency: "INR",
      name: "Student Canteen",
      description: "Order Payment",
      image: "https://cdn-icons-png.flaticon.com/512/3703/3703377.png",
      handler: function (response) {
        createOrder(response.razorpay_payment_id, "Razorpay");
        setLoading(false);
      },
      prefill: {
        name: "Student",
        email: "student@example.com",
        contact: "9999999999",
      },
      theme: { color: "#2563eb" },
      modal: {
        ondismiss: function() {
          setLoading(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const createOrder = (paymentId, method) => {
    const existing = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrder = {
      id: Date.now(),
      items: cart,
      total,
      subtotal,
      deliveryFee,
      tax,
      date: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      timestamp: new Date().toISOString(),
      paymentId,
      paymentMethod: method,
      status: method === "Cash on Delivery" ? "Pending" : "Completed",
    };

    const updated = [...existing, newOrder];
    localStorage.setItem("orders", JSON.stringify(updated));
    localStorage.removeItem("cart");
    alert(`Payment Successful! 🎉\nPayment ID: ${paymentId}`);
    navigate("/orders");
  };

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={handleBackToCart}>← Back to Cart</BackButton>
        <Title>Payment</Title>
      </Header>

      <ContentGrid>
        <OrderSummary>
          <SectionTitle>Order Summary</SectionTitle>
          
          <ItemsList>
            {cart.map((item) => (
              <OrderItem key={item.id}>
                <ItemImage src={item.image} alt={item.name} />
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  <ItemQty>{item.quantity} × ₹{item.price}</ItemQty>
                </ItemDetails>
                <ItemTotal>₹{item.price * item.quantity}</ItemTotal>
              </OrderItem>
            ))}
          </ItemsList>

          <Divider />

          <PriceRow>
            <PriceLabel>Subtotal</PriceLabel>
            <PriceValue>₹{subtotal}</PriceValue>
          </PriceRow>
          
          <PriceRow>
            <PriceLabel>Delivery Fee</PriceLabel>
            <PriceValue>₹{deliveryFee}</PriceValue>
          </PriceRow>
          
          <PriceRow>
            <PriceLabel>Tax (5%)</PriceLabel>
            <PriceValue>₹{tax}</PriceValue>
          </PriceRow>

          <Divider />

          <TotalRow>
            <TotalLabel>Total Amount</TotalLabel>
            <TotalValue>₹{total}</TotalValue>
          </TotalRow>
        </OrderSummary>

        <PaymentSection>
          <SectionTitle>Payment Method</SectionTitle>

          <PaymentOptions>
            <PaymentOption 
              $active={paymentMethod === "razorpay"}
              onClick={() => setPaymentMethod("razorpay")}
            >
              <OptionRadio $checked={paymentMethod === "razorpay"}>
                {paymentMethod === "razorpay" && <RadioDot />}
              </OptionRadio>
              <OptionContent>
                <OptionIcon>💳</OptionIcon>
                <OptionDetails>
                  <OptionTitle>Razorpay</OptionTitle>
                  <OptionDesc>Credit/Debit Card, UPI, Wallet</OptionDesc>
                </OptionDetails>
              </OptionContent>
            </PaymentOption>

            <PaymentOption 
              $active={paymentMethod === "upi"}
              onClick={() => setPaymentMethod("upi")}
            >
              <OptionRadio $checked={paymentMethod === "upi"}>
                {paymentMethod === "upi" && <RadioDot />}
              </OptionRadio>
              <OptionContent>
                <OptionIcon>📱</OptionIcon>
                <OptionDetails>
                  <OptionTitle>UPI Payment</OptionTitle>
                  <OptionDesc>Google Pay, PhonePe, Paytm</OptionDesc>
                </OptionDetails>
              </OptionContent>
            </PaymentOption>

            <PaymentOption 
              $active={paymentMethod === "cod"}
              onClick={() => setPaymentMethod("cod")}
            >
              <OptionRadio $checked={paymentMethod === "cod"}>
                {paymentMethod === "cod" && <RadioDot />}
              </OptionRadio>
              <OptionContent>
                <OptionIcon>💵</OptionIcon>
                <OptionDetails>
                  <OptionTitle>Cash on Delivery</OptionTitle>
                  <OptionDesc>Pay when you receive</OptionDesc>
                </OptionDetails>
              </OptionContent>
            </PaymentOption>
          </PaymentOptions>

          <PayButton onClick={handlePay} disabled={loading}>
            {loading ? "Processing..." : `Pay ₹${total}`}
          </PayButton>

          <SecureNote>
            🔒 Your payment information is secure and encrypted
          </SecureNote>
        </PaymentSection>
      </ContentGrid>
    </Wrapper>
  );
}

/* Enhanced Styled Components */

const Wrapper = styled.div`
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  animation: slideDown 0.4s ease;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const BackButton = styled.button`
  background: white;
  border: 2px solid #e5e7eb;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(37, 99, 235, 0.1);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:hover {
    border-color: #2563eb;
    color: #2563eb;
    transform: translateX(-4px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  }
  
  &:hover::before {
    width: 300px;
    height: 300px;
  }
  
  &:active {
    transform: translateX(-2px);
  }
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.5px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  animation: fadeIn 0.5s ease 0.2s backwards;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.6);
  height: fit-content;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }
`;

const SectionTitle = styled.h3`
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 3px solid #2563eb;
  display: inline-block;
  letter-spacing: -0.3px;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 12px;
  background: #f9fafb;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f3f4f6;
    transform: translateX(4px);
  }
`;

const ItemImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 12px;
  object-fit: cover;
  background: #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  ${OrderItem}:hover & {
    transform: scale(1.05);
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
  line-height: 1.3;
`;

const ItemQty = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const ItemTotal = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #2563eb;
  white-space: nowrap;
`;

const Divider = styled.div`
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #e5e7eb 20%, #e5e7eb 80%, transparent 100%);
  margin: 20px 0;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9fafb;
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 8px;
  }
`;

const PriceLabel = styled.span`
  font-size: 15px;
  color: #6b7280;
  font-weight: 500;
`;

const PriceValue = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  margin-top: 8px;
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(37, 99, 235, 0);
    }
  }
`;

const TotalLabel = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.3px;
`;

const TotalValue = styled.span`
  font-size: 28px;
  font-weight: 900;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PaymentSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.6);
  height: fit-content;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border: 2px solid ${props => props.$active ? "#2563eb" : "#e5e7eb"};
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.$active ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" : "white"};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    border-color: #2563eb;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(-2px);
  }
`;

const OptionRadio = styled.div`
  width: 26px;
  height: 26px;
  border: 3px solid ${props => props.$checked ? "#2563eb" : "#cbd5e1"};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  
  ${PaymentOption}:hover & {
    border-color: #2563eb;
    transform: scale(1.1);
  }
`;

const RadioDot = styled.div`
  width: 14px;
  height: 14px;
  background: #2563eb;
  border-radius: 50%;
  animation: dotPop 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @keyframes dotPop {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;

const OptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
`;

const OptionIcon = styled.div`
  font-size: 32px;
  transition: transform 0.3s ease;
  
  ${PaymentOption}:hover & {
    transform: scale(1.2) rotate(5deg);
  }
`;

const OptionDetails = styled.div`
  flex: 1;
`;

const OptionTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
  letter-spacing: -0.2px;
`;

const OptionDesc = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  border-radius: 16px;
  border: none;
  font-size: 19px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
  
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(37, 99, 235, 0.45);
  }
  
  &:hover:not(:disabled)::before {
    width: 600px;
    height: 600px;
  }
  
  &:active:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(37, 99, 235, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecureNote = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
  animation: fadeIn 0.5s ease 0.4s backwards;
`;
