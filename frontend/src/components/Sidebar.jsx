import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SidebarContext } from "../App";
import styled, { keyframes } from "styled-components";
import {
  FaHome,
  FaUtensils,
  FaShoppingCart,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUserCircle,
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const [open, setOpen] = useState(sidebarOpen);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const userPhone = localStorage.getItem("userPhone");

  // Sync local state with context
  useEffect(() => {
    setOpen(sidebarOpen);
  }, [sidebarOpen]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) setOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Menu", path: "/menu", icon: <FaUtensils /> },
    { name: "Cart", path: "/cart", icon: <FaShoppingCart /> },
    { name: "Orders", path: "/orders", icon: <FaClipboardList /> },
  ];

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  
  const handleConfirmLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("isLoggedIn");
    setShowLogoutConfirm(false);
    navigate("/login", { replace: true });
  };
  
  const handleCancelLogout = () => setShowLogoutConfirm(false);
  
  const handleNavClick = () => {
    if (isMobile) {
      setOpen(false);
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    const newOpen = !open;
    setOpen(newOpen);
    setSidebarOpen(newOpen);
  };

  return (
    <>
      {isMobile && !open && (
        <MobileToggle onClick={toggleSidebar} title="Open menu">
          <FaBars />
        </MobileToggle>
      )}
      
      {isMobile && open && (
        <Overlay onClick={() => {
          setOpen(false);
          setSidebarOpen(false);
        }} />
      )}
      
      <Container $open={open}>
        {!isMobile && (
          <ToggleButton 
            onClick={toggleSidebar} 
            $open={open} 
            title={open ? "Collapse sidebar" : "Expand sidebar"}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            {open ? <FaChevronLeft /> : <FaChevronRight />}
          </ToggleButton>
        )}
        
        <Header>
          <Logo $open={open}>
            <LogoIcon $open={open}>
              <FaUserCircle />
            </LogoIcon>
            {open && <LogoText>Student Portal</LogoText>}
          </Logo>
          {isMobile && (
            <CloseButton 
              onClick={() => {
                setOpen(false);
                setSidebarOpen(false);
              }} 
              aria-label="Close menu"
            >
              <FaTimes />
            </CloseButton>
          )}
        </Header>

        {open && userPhone && (
          <UserInfo>
            <UserAvatar>
              <FaUserCircle />
            </UserAvatar>
            <UserDetails>
              <UserName>Student</UserName>
              <UserPhone>{userPhone}</UserPhone>
            </UserDetails>
          </UserInfo>
        )}

        <Menu role="navigation" aria-label="Main navigation">
          {menu.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              $open={open}
              onClick={handleNavClick}
              title={!open ? item.name : undefined}
              activeClassName="active"
            >
              <IconWrapper aria-hidden="true">{item.icon}</IconWrapper>
              {open && <NavText>{item.name}</NavText>}
            </NavItem>
          ))}
        </Menu>

        <LogoutSection>
          <LogoutButton 
            onClick={handleLogoutClick} 
            $open={open} 
            title={!open ? "Logout" : undefined}
          >
            <IconWrapper aria-hidden="true">
              <FaSignOutAlt />
            </IconWrapper>
            {open && <NavText>Logout</NavText>}
          </LogoutButton>
        </LogoutSection>
      </Container>

      {showLogoutConfirm && (
        <LogoutModalOverlay>
          <LogoutModal role="dialog" aria-labelledby="logout-title" aria-modal="true">
            <ModalTitle id="logout-title">Confirm Logout</ModalTitle>
            <ModalText>Are you sure you want to logout from Student Portal?</ModalText>
            <LogoutActions>
              <LogoutCancel onClick={handleCancelLogout}>Cancel</LogoutCancel>
              <LogoutConfirm onClick={handleConfirmLogout}>Logout</LogoutConfirm>
            </LogoutActions>
          </LogoutModal>
        </LogoutModalOverlay>
      )}
    </>
  );
}

const slideIn = keyframes`
  from { 
    transform: translateX(-100%); 
    opacity: 0; 
  }
  to { 
    transform: translateX(0); 
    opacity: 1; 
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LogoIcon = styled.div`
  font-size: ${({ $open }) => ($open ? "28px" : "24px")};
  line-height: 1;
  transition: font-size 0.2s ease;
  color: #2563eb;
`;

const Container = styled.aside`
  width: ${({ $open }) => ($open ? "260px" : "95px")};
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 260px;
    transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(-100%)")};
    animation: ${slideIn} 0.3s ease-out;
  }

  &::-webkit-scrollbar { 
    width: 4px; 
  }
  &::-webkit-scrollbar-thumb { 
    background: #e5e7eb; 
    border-radius: 4px; 
  }
  &::-webkit-scrollbar-thumb:hover { 
    background: #d1d5db; 
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 10px;
  top: 24px;
  width: 40px;
  height: 40px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
  transition: all 0.2s;
  z-index: 10;
  font-size: 22px;

  &:hover {
    background: #1d4ed8;
    transform: scale(1.09);
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.2);
  }
  &:active { 
    transform: scale(0.94); 
  }

  @media (max-width: 768px) { 
    display: none; 
  }
`;

const Overlay = styled.div`
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: ${fadeIn} 0.3s ease;
  }
`;

const MobileToggle = styled.button`
  @media (max-width: 768px) {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 48px;
    height: 48px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 998;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transition: all 0.2s;

    &:hover {
      background: #1d4ed8;
      transform: translateY(-2px);
    }
    &:active { 
      transform: translateY(0); 
    }
  }
`;

const Header = styled.div`
  padding: 20px 16px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ $open }) => ($open ? "12px" : "0")};
  justify-content: ${({ $open }) => ($open ? "flex-start" : "center")};
  width: 100%;
`;

const LogoText = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
  margin: 0;
  white-space: nowrap;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

const UserInfo = styled.div`
  padding: 16px;
  margin: 16px 12px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.div`
  width: 44px;
  height: 44px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
  color: #2563eb;
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
`;

const UserPhone = styled.div`
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Menu = styled.nav`
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ $open }) => ($open ? "12px" : "0")};
  padding: 12px 14px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  justify-content: ${({ $open }) => ($open ? "flex-start" : "center")};

  &.active {
    background: #2563eb;
    color: #ffffff;
  }

  &:hover {
    background: #f8fafc;
    color: #2563eb;
    transform: translateX(4px);
  }

  &.active:hover {
    background: #1d4ed8;
    color: #ffffff;
    transform: none;
  }

  &:active { 
    transform: scale(0.98); 
  }
`;

const IconWrapper = styled.span`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const NavText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LogoutSection = styled.div`
  padding: 16px 12px;
  border-top: 1px solid #f3f4f6;
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ $open }) => ($open ? "12px" : "0")};
  padding: 12px 14px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #dc2626;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  justify-content: ${({ $open }) => ($open ? "flex-start" : "center")};

  &:hover {
    background: #fef2f2;
    color: #b91c1c;
    transform: translateX(4px);
  }
  &:active { 
    transform: scale(0.98); 
  }
`;

const LogoutModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const LogoutModal = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 32px 32px 24px;
  min-width: 320px;
  text-align: center;
`;

const ModalTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
`;

const ModalText = styled.p`
  margin: 0 0 24px 0;
  color: #6b7280;
  font-size: 16px;
`;

const LogoutActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const LogoutCancel = styled.button`
  background: #f3f4f6;
  color: #374151;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.18s;
  flex: 1;
  max-width: 120px;

  &:hover { 
    background: #e5e7eb; 
  }
`;

const LogoutConfirm = styled.button`
  background: #dc2626;
  color: #fff;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.18s;
  flex: 1;
  max-width: 120px;

  &:hover { 
    background: #b91c1c; 
  }
`;
