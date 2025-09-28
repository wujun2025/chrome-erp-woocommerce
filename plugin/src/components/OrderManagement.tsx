import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
  Grid,
  TextField,
  Button,
  Pagination
} from '@mui/material'
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useOrderState, useStoreConfig } from '@/store'
import { useTranslation } from '@/hooks/useTranslation'
import { apiService } from '@/services/api'
import type { Order, FilterParams } from '@/types'
import { format } from 'date-fns'

export const OrderManagement: React.FC = () => {
  const { t } = useTranslation()
  const { activeStore, stores } = useStoreConfig()
  const { orders, setOrders } = useOrderState()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const currentStore = stores.find(s => s.id === activeStore)

  const loadOrders = async (params?: FilterParams) => {
    if (!currentStore) {
      setError(t('messages.noStores'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      apiService.setStoreConfig(currentStore)
      const result = await apiService.getOrders({
        page,
        perPage: pageSize,
        search: searchTerm,
        ...params
      })

      if (result.success && result.data) {
        setOrders(result.data.data)
        setTotalOrders(result.data.total)
        setTotalPages(result.data.totalPages)
      } else {
        setError(result.error || t('messages.loadingOrders'))
      }
    } catch (error) {
      setError(t('messages.networkError'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentStore) {
      loadOrders()
    }
  }, [currentStore, page, pageSize])

  const handleSearch = () => {
    setPage(1)
    loadOrders()
  }

  const handleRefresh = () => {
    loadOrders()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'processing':
        return 'info'
      case 'pending':
        return 'warning'
      case 'on-hold':
        return 'default'
      case 'cancelled':
      case 'refunded':
      case 'failed':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    const statusKey = `order.${status}` as keyof typeof t
    return t(statusKey)
  }

  const formatCurrency = (amount: string, currency: string = 'USD') => {
    return `${currency} ${parseFloat(amount).toFixed(2)}`
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      type: 'number'
    },
    {
      field: 'number',
      headerName: t('order.number'),
      width: 120
    },
    {
      field: 'status',
      headerName: t('order.status'),
      width: 120,
      renderCell: (params) => {
        const status = params.value as string
        return (
          <Chip 
            label={getStatusLabel(status)} 
            color={getStatusColor(status)} 
            size="small" 
          />
        )
      }
    },
    {
      field: 'dateCreated',
      headerName: t('order.dateCreated'),
      width: 150,
      renderCell: (params) => {
        const date = new Date(params.value as string)
        return format(date, 'yyyy-MM-dd HH:mm')
      }
    },
    {
      field: 'billing',
      headerName: t('order.customer'),
      width: 200,
      renderCell: (params) => {
        const billing = params.value as Order['billing']
        return `${billing.firstName} ${billing.lastName}`
      }
    },
    {
      field: 'total',
      headerName: t('order.total'),
      width: 120,
      renderCell: (params) => {
        const order = params.row as Order
        return formatCurrency(order.total, order.currency)
      }
    },
    {
      field: 'paymentMethod',
      headerName: t('order.paymentMethod'),
      width: 150,
      renderCell: (params) => params.row.paymentMethodTitle || params.value
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: () => (
        <Box>
          <IconButton 
            size="small" 
            onClick={() => {/* TODO: Handle view order */}}
            title={t('order.viewOrder')}
          >
            <ViewIcon />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => {/* TODO: Handle edit order */}}
            title={t('order.editOrder')}
          >
            <EditIcon />
          </IconButton>
        </Box>
      )
    }
  ]

  if (!currentStore) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="textSecondary">
            {t('messages.noStores')}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          {t('order.title')}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => {/* TODO: Open filter dialog */}}
          >
            {t('common.filter')}
          </Button>
        </Box>
      </Box>

      {/* Search and Actions Bar */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder={t('filter.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleSearch}
                disabled={loading}
              >
                {t('common.search')}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
              >
                {t('common.refresh')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Orders Data Grid */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={orders}
            columns={columns}
            loading={loading}
            hideFooter
            autoHeight
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderColor: 'divider'
              },
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'grey.50',
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold'
                }
              }
            }}
            initialState={{
              sorting: {
                sortModel: [{ field: 'id', sort: 'desc' }]
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Summary */}
      <Box mt={2}>
        <Typography variant="body2" color="textSecondary" align="center">
          {t('pagination.total', { total: totalOrders })}
        </Typography>
      </Box>

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="textSecondary">
              {t('messages.noOrders')}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}