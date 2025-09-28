import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Chip,
  Typography,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  Clear as ClearIcon
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useTranslation } from '@/hooks/useTranslation'
import type { FilterParams, ProductCategory, ProductTag } from '@/types'
import { zhCN, enUS } from 'date-fns/locale'

interface AdvancedFilterDialogProps {
  open: boolean
  onClose: () => void
  onApply: (filters: FilterParams) => void
  onClear: () => void
  categories?: ProductCategory[]
  tags?: ProductTag[]
  currentFilters?: FilterParams
}

export const AdvancedFilterDialog: React.FC<AdvancedFilterDialogProps> = ({
  open,
  onClose,
  onApply,
  onClear,
  categories = [],
  tags = [],
  currentFilters = {}
}) => {
  const { t, locale } = useTranslation()
  
  const [filters, setFilters] = useState<FilterParams>(currentFilters)

  const dateLocale = locale === 'zh-CN' ? zhCN : enUS

  const handleFilterChange = (key: keyof FilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleClear = () => {
    setFilters({})
    onClear()
  }

  const handleReset = () => {
    setFilters({})
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== null
    ).length
  }

  const productStatuses = [
    { value: 'publish', label: t('product.publish') },
    { value: 'draft', label: t('product.draft') },
    { value: 'pending', label: t('product.pending') },
    { value: 'private', label: t('product.private') }
  ]

  const stockStatuses = [
    { value: 'instock', label: t('product.inStock') },
    { value: 'outofstock', label: t('product.outOfStock') },
    { value: 'onbackorder', label: t('product.onBackorder') }
  ]

  const orderStatuses = [
    { value: 'pending', label: t('order.pending') },
    { value: 'processing', label: t('order.processing') },
    { value: 'on-hold', label: t('order.onHold') },
    { value: 'completed', label: t('order.completed') },
    { value: 'cancelled', label: t('order.cancelled') },
    { value: 'refunded', label: t('order.refunded') },
    { value: 'failed', label: t('order.failed') }
  ]

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '400px' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {t('filter.advanced')}
          </Typography>
          {getActiveFiltersCount() > 0 && (
            <Chip 
              label={`${getActiveFiltersCount()} ${t('common.filter')}`}
              color="primary"
              size="small"
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={dateLocale}>
          <Box sx={{ pt: 1 }}>
            {/* Basic Filters */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('filter.quickFilter')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('common.search')}
                      value={filters.search || ''}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder={t('filter.searchPlaceholder')}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>{t('product.status')}</InputLabel>
                      <Select
                        value={filters.status || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        label={t('product.status')}
                      >
                        <MenuItem value="">
                          <em>{t('common.select')}</em>
                        </MenuItem>
                        {productStatuses.map(status => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                        {/* Add order statuses for order filtering */}
                        {orderStatuses.map(status => (
                          <MenuItem key={`order-${status.value}`} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>{t('product.stockStatus')}</InputLabel>
                      <Select
                        value={filters.stockStatus || ''}
                        onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                        label={t('product.stockStatus')}
                      >
                        <MenuItem value="">
                          <em>{t('common.select')}</em>
                        </MenuItem>
                        {stockStatuses.map(status => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('product.sku')}
                      value={filters.sku || ''}
                      onChange={(e) => handleFilterChange('sku', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Price Range Filters */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('filter.priceRange')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label={t('filter.priceMin')}
                      value={filters.priceMin || ''}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label={t('filter.priceMax')}
                      value={filters.priceMax || ''}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                      }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Category and Tag Filters */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('filter.category')} & {t('filter.tag')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={categories}
                      getOptionLabel={(option) => option.name}
                      value={categories.find(cat => cat.id.toString() === filters.category) || null}
                      onChange={(_, value) => handleFilterChange('category', value?.id.toString())}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('filter.category')}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={tags}
                      getOptionLabel={(option) => option.name}
                      value={tags.find(tag => tag.id.toString() === filters.tag) || null}
                      onChange={(_, value) => handleFilterChange('tag', value?.id.toString())}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('filter.tag')}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Date Range Filters */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('filter.dateRange')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label={t('filter.dateFrom')}
                      value={filters.dateFrom ? new Date(filters.dateFrom) : null}
                      onChange={(value) => handleFilterChange('dateFrom', value?.toISOString())}
                      slotProps={{
                        textField: { fullWidth: true }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label={t('filter.dateTo')}
                      value={filters.dateTo ? new Date(filters.dateTo) : null}
                      onChange={(value) => handleFilterChange('dateTo', value?.toISOString())}
                      slotProps={{
                        textField: { fullWidth: true }
                      }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Sorting Options */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  排序选项
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>排序字段</InputLabel>
                      <Select
                        value={filters.orderBy || 'date'}
                        onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                        label="排序字段"
                      >
                        <MenuItem value="date">创建日期</MenuItem>
                        <MenuItem value="title">商品名称</MenuItem>
                        <MenuItem value="price">价格</MenuItem>
                        <MenuItem value="stock">库存</MenuItem>
                        <MenuItem value="sku">SKU</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>排序方向</InputLabel>
                      <Select
                        value={filters.order || 'desc'}
                        onChange={(e) => handleFilterChange('order', e.target.value as 'asc' | 'desc')}
                        label="排序方向"
                      >
                        <MenuItem value="desc">降序</MenuItem>
                        <MenuItem value="asc">升序</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleReset}
          startIcon={<ClearIcon />}
          color="inherit"
        >
          {t('common.reset')}
        </Button>
        <Button 
          onClick={handleClear}
          color="inherit"
        >
          {t('filter.clear')}
        </Button>
        <Button onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleApply} 
          variant="contained"
          color="primary"
        >
          {t('filter.apply')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}