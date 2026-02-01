// src/pages/OrderHistory.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const sortedOrders = storedOrders.sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    setOrders(sortedOrders);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    return order.status.toLowerCase() === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      completed: "#16a34a",
      delivered: "#16a34a",
      pending: "#f59e0b",
      processing: "#3b82f6",
      cancelled: "#dc2626",
    };
    return colors[status.toLowerCase()] || "#6b7280";
  };

  const getStatusBg = (status) => {
    const colors = {
      completed: "#dcfce7",
      delivered: "#dcfce7",
      pending: "#fef3c7",
      processing: "#dbeafe",
      cancelled: "#fee2e2",
    };
    return colors[status.toLowerCase()] || "#f3f4f6";
  };

  return (
    <Wrapper>
      <Header>
        <TitleSection>
          <Title>Order History</Title>
          <Subtitle>Track all your past orders</Subtitle>
        </TitleSection>
        {orders.length > 0 && (
          <OrderCount>{orders.length} total orders</OrderCount>
        )}
      </Header>

      {orders.length > 0 && (
        <FilterSection>
          <FilterButton $active={filter === "all"} onClick={() => setFilter("all")}>
            All ({orders.length})
          </FilterButton>
          <FilterButton $active={filter === "completed"} onClick={() => setFilter("completed")}>
            Completed ({orders.filter(o => o.status.toLowerCase() === "completed").length})
          </FilterButton>
          <FilterButton $active={filter === "pending"} onClick={() => setFilter("pending")}>
            Pending ({orders.filter(o => o.status.toLowerCase() === "pending").length})
          </FilterButton>
          <FilterButton $active={filter === "cancelled"} onClick={() => setFilter("cancelled")}>
            Cancelled ({orders.filter(o => o.status.toLowerCase() === "cancelled").length})
          </FilterButton>
        </FilterSection>
      )}

      {filteredOrders.length === 0 ? (
        <EmptyBox>
          <EmptyIcon>📦</EmptyIcon>
          <EmptyText>
            {orders.length === 0
              ? "No previous orders yet"
              : `No ${filter} orders`}
          </EmptyText>
          <EmptySubtext>
            {orders.length === 0
              ? "Start ordering delicious food from our menu!"
              : "Try selecting a different filter"}
          </EmptySubtext>
          {orders.length === 0 && (
            <BrowseMenuBtn onClick={() => navigate("/menu")}>
              Browse Menu
            </BrowseMenuBtn>
          )}
        </EmptyBox>
      ) : (
        <OrderList>
          {filteredOrders.map((order) => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <OrderLeft>
                  <OrderID>#{order.id}</OrderID>
                  <OrderDate>{order.date}</OrderDate>
                </OrderLeft>
                <OrderRight>
                  <OrderAmount>₹{order.total}</OrderAmount>
                  <OrderStatus
                    $color={getStatusColor(order.status)}
                    $bg={getStatusBg(order.status)}
                  >
                    {order.status}
                  </OrderStatus>
                </OrderRight>
              </OrderHeader>

              <Divider />

              <OrderItems>
                <ItemsTitle>Items Ordered:</ItemsTitle>
                {order.items.map((item, idx) => (
                  <Item key={idx}>
                    <ItemQuantity>{item.quantity}×</ItemQuantity>
                    <ItemName>{item.name}</ItemName>
                    <ItemPrice>₹{item.price * item.quantity}</ItemPrice>
                  </Item>
                ))}
              </OrderItems>

              <Divider />

              <OrderFooter>
                <FooterItem>
                  <FooterLabel>Payment ID:</FooterLabel>
                  <FooterValue>{order.paymentId}</FooterValue>
                </FooterItem>
                <FooterItem>
                  <FooterLabel>Payment Method:</FooterLabel>
                  <FooterValue>{order.paymentMethod || "Online"}</FooterValue>
                </FooterItem>
              </OrderFooter>
            </OrderCard>
          ))}
        </OrderList>
      )}
    </Wrapper>
  );
}

/* ---------- Styled Components ---------- */

const Wrapper = styled.div`
  padding: 30px 20px;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 0;
`;

const OrderCount = styled.div`
  background: #2563eb;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  margin-bottom: 48px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button`
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid ${(props) => (props.$active ? "#2563eb" : "#e5e7eb")};
  color: ${(props) => (props.$active ? "#fff" : "#666")};
  background: ${(props) => (props.$active ? "#2563eb" : "#fff")};
  transition: 0.2s;
`;

const EmptyBox = styled.div`
  background: white;
  padding: 80px 40px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #e5e7eb;
  margin-top: 30px; /* 🔥 added */
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

const BrowseMenuBtn = styled.button`
  padding: 14px 32px;
  background: #2563eb;
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 25px; /* 🔥 added */
`;

const OrderCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const OrderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const OrderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const OrderID = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
`;

const OrderDate = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const OrderAmount = styled.span`
  font-size: 24px;
  font-weight: 800;
  color: #2563eb;
`;

const OrderStatus = styled.span`
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  text-transform: capitalize;
  color: ${(props) => props.$color};
  background: ${(props) => props.$bg};
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 20px 0;
`;

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemsTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 4px;
`;

const Item = styled.div`
  display: flex;
  gap: 12px;
  padding: 10px;
  background: #f9fafb;
  border-radius: 8px;
`;

const ItemQuantity = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #2563eb;
  min-width: 30px;
`;

const ItemName = styled.span`
  flex: 1;
  font-size: 15px;
  font-weight: 600;
`;

const ItemPrice = styled.span`
  font-size: 15px;
  font-weight: 700;
`;

const OrderFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FooterItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FooterLabel = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

const FooterValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  font-family: monospace;
`;
