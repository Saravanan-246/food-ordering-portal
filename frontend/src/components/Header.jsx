import React from "react";
import styled, { keyframes } from "styled-components";

export default function Header() {
  return (
    <Wrapper>
      <Container>
        <Title>
          Student <Highlight>Portal</Highlight>
        </Title>
        <Sparkles>
          <Sparkle style={{ top: "20%", left: "20%", animationDelay: "0s" }} />
          <Sparkle style={{ top: "60%", left: "75%", animationDelay: "1.2s" }} />
          <Sparkle style={{ top: "75%", left: "40%", animationDelay: "2s" }} />
        </Sparkles>
      </Container>
      <GlowEffect />
    </Wrapper>
  );
}

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const sparkleAnim = keyframes`
  0%, 100% { 
    opacity: 0; 
    transform: scale(0.3) translateY(0); 
  }
  50% { 
    opacity: 0.8; 
    transform: scale(1) translateY(-4px); 
  }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.2; transform: scale(0.95); }
  50% { opacity: 0.4; transform: scale(1.05); }
`;

const Wrapper = styled.header`
  width: 100%;
  padding: 1.5rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  border-radius: 1rem;
  box-shadow: 
    0 1rem 3rem rgba(0, 0, 0, 0.5), 
    inset 0 0.125rem 0 rgba(255, 255, 255, 0.08),
    0 0 0 1px rgba(148, 163, 184, 0.15);
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  max-width: 48rem;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3.125rem);
  font-weight: 800;
  background: linear-gradient(90deg, #cbd5e1 0%, #e2e8f0 30%, #f8fafc 50%, #e2e8f0 70%, #cbd5e1 100%);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 3s ease-in-out infinite;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Poppins', sans-serif;
  letter-spacing: -0.025em;
  text-align: center;
  margin: 0;
  filter: drop-shadow(0 0 1rem rgba(255, 255, 255, 0.2));
`;

const Highlight = styled.span`
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 30%, #93c5fd 50%, #60a5fa 70%, #3b82f6 100%);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 2.5s ease-in-out infinite reverse;
  font-weight: 900;
  letter-spacing: 0.05em;
`;

const Sparkles = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
`;

const Sparkle = styled.div`
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  background: radial-gradient(circle, #93c5fd 0%, #3b82f6 70%);
  border-radius: 50%;
  box-shadow: 0 0 1rem #60a5fa;
  animation: ${sparkleAnim} 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
  will-change: transform, opacity;
`;

const GlowEffect = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 60%);
  animation: ${pulseGlow} 4s ease-in-out infinite;
  z-index: 0;
  filter: blur(2rem);
`;

// Responsive tweaks
Wrapper.displayName = 'HeaderWrapper';
Title.displayName = 'HeaderTitle';
