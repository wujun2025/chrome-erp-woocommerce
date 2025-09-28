import React from 'react'
import { Button, ButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'

// 定义统一的按钮样式
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '6px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none'
  },
  // 确保按钮在不同状态下的样式一致性
  '&.MuiButton-outlined': {
    borderColor: theme.palette.divider,
    '&:hover': {
      borderColor: theme.palette.action.hover
    }
  }
}))

// 定义不同尺寸的按钮样式
const buttonSizes = {
  small: {
    fontSize: '0.75rem',
    padding: '4px 8px'
  },
  medium: {
    fontSize: '0.875rem',
    padding: '6px 12px'
  },
  large: {
    fontSize: '1rem',
    padding: '8px 16px'
  }
}

interface CustomButtonProps extends ButtonProps {
  size?: 'small' | 'medium' | 'large'
}

export const CustomButton: React.FC<CustomButtonProps> = ({ 
  size = 'medium', 
  children, 
  ...props 
}) => {
  return (
    <StyledButton 
      size={size}
      sx={buttonSizes[size]}
      {...props}
    >
      {children}
    </StyledButton>
  )
}