import React from 'react';

// TODO: Replace this interface with actual API response type when backend is ready
export interface StatusBadgeProps {
  status: 'Active' | 'UNHEALTHY' | 'bad' | 'Completed' | 'Rejected';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'Active':
      return {
        bgColor: "#1dff0042",
        borderColor: "#006d0773",
        textColor: "#165f00",
      };
    case 'UNHEALTHY':
    case 'bad':
      return {
        bgColor: "#ff000042",
        borderColor: "#6d000073",
        textColor: "#5f0000",
      };
    case 'Completed':
      return {
        bgColor: "rgba(166, 255, 0, 0.26)",
        borderColor: "rgba(93, 109, 0, 0.45)",
        textColor: "#605400",
      };
    case 'Rejected':
      return {
        bgColor: "rgba(255, 0, 0, 0.26)",
        borderColor: "rgba(109, 0, 0, 0.45)",
        textColor: "#600000",
      };
    default:
      return {
        bgColor: "#1dff0042",
        borderColor: "#006d0773",
        textColor: "#165f00",
      };
  }
};

const getSizeConfig = (size: string) => {
  switch (size) {
    case 'small':
      return {
        height: 22,
        padding: "0 10px",
        fontSize: 13,
        dotSize: 9,
      };
    case 'large':
      return {
        height: 39,
        padding: "0 32px",
        fontSize: 20,
        dotSize: 14,
      };
    default: // medium
      return {
        height: 28,
        padding: "0 15px",
        fontSize: 16,
        dotSize: 12,
      };
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'small',
  className = ""
}) => {
  const statusConfig = getStatusConfig(status);
  const sizeConfig = getSizeConfig(size);

  return (
    <div
      className={`status-badge ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        height: sizeConfig.height,
        padding: sizeConfig.padding,
        borderRadius: 1000,
        background: statusConfig.bgColor,
        border: `1.5px solid ${statusConfig.borderColor}`,
        color: statusConfig.textColor,
        fontWeight: 600,
        fontSize: sizeConfig.fontSize,
      }}
    >
      <span
        style={{
          width: sizeConfig.dotSize,
          height: sizeConfig.dotSize,
          background: "#fff",
          borderRadius: sizeConfig.dotSize,
          border: `1.5px solid #108a0063`,
          marginRight: 5,
          display: "inline-block",
        }}
      />
      <span>
        {status}
      </span>
    </div>
  );
}; 