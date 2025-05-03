import React, { useEffect } from 'react';
import Highcharts from 'highcharts/highcharts-gantt';
import HighchartsReact from 'highcharts-react-official';

export default function GanttChart({ title, categories, tasks, range }) {
  // ① Turn off UTC so chart uses client’s local TZ
  useEffect(() => {
    Highcharts.setOptions({
      time: { useUTC: false }
    });
  }, []);

  // ② Build series data with millisecond timestamps
  const seriesData = tasks.map(t => {
    const startMs = Date.parse(t.start);
    const endMs   = Date.parse(t.end);
    return {
      name:  t.name,
      start: startMs,
      end:   endMs,
      y:     categories.indexOf(t.camera),
      color: t.type === 'feed' ? 'green' : 'blue'
    };
  });

  // ③ Chart options
  const options = {
    chart: {
      type: 'gantt',
      height: (categories.length * 65) + 100
    },
    title: { text: title, align: 'left' },
    xAxis: {
      type: 'datetime',
      min: Date.parse(range.min),  // ms
      max: Date.parse(range.max),  // ms
    },
    yAxis: {
      categories,
      reversed: true,
      title: { text: null }
    },
    series: [{
      name: title,
      data: seriesData,
      dataLabels: { enabled: true, format: '{point.name}' }
    }],
    tooltip: {
      pointFormatter() {
        const fmt = d => Highcharts.dateFormat('%Y-%m-%d %H:%M', d);
        return `<b>${this.name}</b><br/>${fmt(this.start)} → ${fmt(this.end)}`;
      }
    },
    navigator: { enabled: true },  // built-in navigator
    scrollbar: { enabled: true }   // built-in scrollbar
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType="ganttChart"
      options={options}
    />
  );
}
