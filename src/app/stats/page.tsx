'use client';

import React, { useEffect, useState } from 'react'; 
import Highcharts from 'highcharts'; 
import HighchartsReact from 'highcharts-react-official';
import supabase from "@/utils/supabase/client";

let d: any;

const LineChart = () => { 

    const [data, setData] = useState<{ formattedDate: string; created_at: any; value: any }[]>([]);

    const fetchDates = async () => {
      const { data: supabaseData, error } = await supabase
        .from('stats')
        .select('created_at, value');
  
      if (error) {
        console.error(error);
      } else {
        const formattedData = supabaseData.map((item) => {
          const createdAt = new Date(item.created_at);
          const formattedDate = `${createdAt.toLocaleString('default', { month: 'long' }).charAt(0).toUpperCase() + createdAt.toLocaleString('default', { month: 'long' }).slice(1)} ${createdAt.getDate()}, ${createdAt.getHours() + 3}:${createdAt.getMinutes().toString().padStart(2, '0')}`;
          return { ...item, formattedDate };
        });
        setData(formattedData);
      }
    };
  
    useEffect(() => {
      fetchDates();
    }, []);

    const options = {
        colors: ['rgba(255, 165, 0, 1)'],
        series: [{
          name: 'Игроки',
          data: data.map((item) => [item.formattedDate, item.value]),
          fillColor: 'rgba(255, 165, 0, 0.5)',
          lineColor: 'rgba(255, 165, 0, 1)',
          marker: {
            enabled: false,
        }
        }],
        tooltip: {
            backgroundColor: '#181818',
            borderColor: '#181818',
            borderWidth: 0,
            shadow: false,
            padding: 10,
            markerSymbol: null,
            marker: {
                enabled: false,
            },
            style: {
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              color: '#fff',
              fontWeight: '600',
            },
            formatter: function(this: { series: { data: { name: string }[] }, point: { index: number, y: number } }): string {
                return `<p style="color: #fff">${this.series.data[this.point.index].name}</p> <br/> <p style="color: #00df0a">Игроки: ${this.point.y}</p>`;
            }
          },
        chart: { type: 'area' },
        xAxis: {
            type: 'datetime',
            visible: false,
            labels: {
            format: '{value}',
            },
        },
        yAxis: {
            visible: false,
        },
        credits: { enabled: false },
        legend: { enabled: false },
        title: null
      };
return (
    <HighchartsReact highcharts={Highcharts} options={options} />
);

} 

export default LineChart;