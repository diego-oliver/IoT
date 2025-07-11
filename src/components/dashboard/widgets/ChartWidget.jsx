import React, { useEffect } from 'react';
import ChartWrapper from '../../common/ChartWrapper';
import { useApi } from '../../../hooks/useApi';
import { getDashboardKpis } from '../../../api/endpoints';

const ChartWidget = () => {
  const { data: kpis, request: fetchKpis, isLoading } = useApi(getDashboardKpis);

  useEffect(() => {
    fetchKpis();
  }, []);

  const chartOption = {
    title: {
      text: 'Building Performance Overview',
      left: 'center',
      textStyle: {
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        fontSize: 10,
      },
    },
    series: [
      {
        name: 'Buildings',
        type: 'pie',
        radius: ['40%', '60%'],
        data: [
          { value: kpis?.total_buildings - (kpis?.active_devices || 0), name: 'Inactive Buildings' },
          { value: kpis?.active_devices || 0, name: 'Active Buildings' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <ChartWrapper
      option={chartOption}
      isLoading={isLoading}
      height={200}
    />
  );
};

export default ChartWidget;