import React from 'react';
import styled from 'styled-components';

interface AlertProps {
  text: string;
  closable?: boolean;
  onClose?: () => void;
}
const AlertContainer = styled.div<{ $closable?: boolean }>`
  position: fixed;
  top: 10px; /* Adjust to ensure it's not too close to the top */
  left: 50%;
  transform: translateX(-50%);
  background-color: #e0ffe0; /* Changed to a light red color for better visibility */
  border: 1px solid #e0ffe0;
  padding: 10px;
  border-radius: 5px;
  color: #721c24; /* Darker text color for better contrast */
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000; /* Ensure it's above other content */
  max-width: 90%; /* Prevent overflow on small screens */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add shadow for better visibility */

  ${props => props.$closable && `padding-right: 40px;`}
`;

const AlertTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 0.9rem; /* Slightly larger title */
`;

const AlertText = styled.div`
  text-align: center;
  font-size: 1rem; /* Adjust font size for better readability */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #721c24; /* Match close button color with alert text */
  font-size: 1.5rem; /* Larger close button for easier clicking */
  transition: color 0.2s ease;

  &:hover {
    color: #f5c6cb; /* Change color on hover */
  }
`;


const Alert: React.FC<AlertProps> = ({ text, closable, onClose }) => {
    return (
      <AlertContainer $closable={closable}>
        {closable && <CloseButton onClick={onClose}>&times;</CloseButton>}
        <AlertTitle>Alert</AlertTitle>
        <AlertText>{text}</AlertText>
      </AlertContainer>
    );
  };

export default Alert;
