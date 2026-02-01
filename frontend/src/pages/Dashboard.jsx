// src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function Dashboard() {
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (!token || !isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const userPhone = localStorage.getItem("userPhone");

  // Quick stats data
  const stats = [
    { label: "Available Items", value: "24", color: "#2563eb" },
    { label: "Cart Items", value: "3", color: "#10b981" },
    { label: "Total Orders", value: "8", color: "#f59e0b" },
    { label: "Pending", value: "1", color: "#ef4444" },
  ];

  // Quick actions
  const quickActions = [
    { 
      title: "Browse Menu", 
      description: "View available items",
      path: "/menu",
      color: "#2563eb"
    },
    { 
      title: "View Cart", 
      description: "Review your selections",
      path: "/cart",
      color: "#10b981"
    },
    { 
      title: "Order History", 
      description: "Track your orders",
      path: "/orders",
      color: "#f59e0b"
    },
  ];

  return (
    <Container>
      {/* Welcome Section */}
      <WelcomeSection>
        <WelcomeContent>
          <Greeting>Welcome back!</Greeting>
          <UserInfo>{userPhone}</UserInfo>
          <Subtitle>Manage your orders and browse the menu</Subtitle>
        </WelcomeContent>
      </WelcomeSection>

      {/* Stats Grid */}
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} $color={stat.color}>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      {/* Quick Actions */}
      <SectionTitle>Quick Actions</SectionTitle>
      <ActionsGrid>
        {quickActions.map((action, index) => (
          <ActionCard 
            key={index} 
            onClick={() => navigate(action.path)}
            $color={action.color}
          >
            <ActionTitle>{action.title}</ActionTitle>
            <ActionDescription>{action.description}</ActionDescription>
            <ActionArrow>→</ActionArrow>
          </ActionCard>
        ))}
      </ActionsGrid>

      {/* Recent Activity */}
      <SectionTitle>Recent Activity</SectionTitle>
      <ActivityCard>
        <ActivityItem>
          <ActivityDot $color="#10b981" />
          <ActivityContent>
            <ActivityTitle>Order Delivered</ActivityTitle>
            <ActivityTime>2 hours ago</ActivityTime>
          </ActivityContent>
        </ActivityItem>
        <ActivityItem>
          <ActivityDot $color="#f59e0b" />
          <ActivityContent>
            <ActivityTitle>Order in Progress</ActivityTitle>
            <ActivityTime>5 hours ago</ActivityTime>
          </ActivityContent>
        </ActivityItem>
        <ActivityItem>
          <ActivityDot $color="#2563eb" />
          <ActivityContent>
            <ActivityTitle>New Item Added to Menu</ActivityTitle>
            <ActivityTime>1 day ago</ActivityTime>
          </ActivityContent>
        </ActivityItem>
      </ActivityCard>
    </Container>
  );
}

/* ------------ Styled Components ------------ */

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  padding: 40px 30px;
  border-radius: 16px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
`;

const WelcomeContent = styled.div`
  color: white;
`;

const Greeting = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
`;

const UserInfo = styled.p`
  font-size: 18px;
  margin: 0 0 8px 0;
  opacity: 0.9;
  color: white;
`;

const Subtitle = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
  color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  border-left: 4px solid ${props => props.$color};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const ActionCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.$color};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.$color};
  }
`;

const ActionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
`;

const ActionDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
`;

const ActionArrow = styled.div`
  font-size: 24px;
  color: #d1d5db;
  transition: all 0.2s;

  ${ActionCard}:hover & {
    color: #2563eb;
    transform: translateX(4px);
  }
`;

const ActivityCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
`;

const ActivityDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color};
  margin-top: 4px;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const ActivityTime = styled.div`
  font-size: 13px;
  color: #9ca3af;
`;
