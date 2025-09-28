import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Alert } from '@mui/material';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiConfig } from '@/store'; // 这个导入现在应该可以工作了

// 注意：以下功能与backend项目相关，backend项目为后期开发内容

interface Ad {
  _id: string;
  title: string;
  description: string;
  url?: string;
  createdAt: string;
}

export const AdManager: React.FC = () => {
  const { t } = useTranslation();
  const { apiConfig } = useApiConfig(); // 这个现在应该可以工作了
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  // 注意：以下API调用与backend项目相关，backend项目为后期开发内容
  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 确定API基础URL
      let baseUrl = 'http://localhost:3001'; // 默认本地开发环境
      if (apiConfig?.primaryUrl) {
        baseUrl = apiConfig.primaryUrl.replace(/\/$/, '');
      } else if (apiConfig?.backupUrl) {
        baseUrl = apiConfig.backupUrl.replace(/\/$/, '');
      }
      
      const response = await fetch(`${baseUrl}/api/ads`);
      const result = await response.json();
      
      if (result.success) {
        setAds(result.data);
      } else {
        throw new Error(result.message || '获取广告失败');
      }
    } catch (err) {
      console.error('获取广告失败:', err);
      setError(err instanceof Error ? err.message : '获取广告失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="body2" align="center">
          {t('settings.loadingAds')} {/* 这个现在应该可以工作了 */}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={fetchAds} size="small">
          {t('common.refresh')}
        </Button>
      </Box>
    );
  }

  if (ads.length === 0) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="body2" align="center" color="textSecondary">
          {t('settings.noAds')} {/* 这个现在应该可以工作了 */}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 1 }}>
      {ads.map((ad) => (
        <Card key={ad._id} sx={{ mb: 1.5, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ py: 1.5, px: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 600, mb: 0.5 }}>
              {ad.title}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 1 }}>
              {ad.description}
            </Typography>
          </CardContent>
          {ad.url && (
            <CardActions sx={{ py: 1, px: 1.5, pt: 0 }}>
              <Button 
                size="small" 
                variant="outlined" 
                href={ad.url} 
                target="_blank"
                sx={{ fontSize: '0.75rem', minWidth: 'auto', px: 1 }}
              >
                {t('common.learnMore')} {/* 这个现在应该可以工作了 */}
              </Button>
            </CardActions>
          )}
        </Card>
      ))}
    </Box>
  );
};