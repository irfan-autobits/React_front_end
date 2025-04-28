// src/components/ui/GanttChart.js
import React from 'react';
import Highcharts from 'highcharts/highcharts-gantt';       // Bundled Gantt build
import HighchartsReact from 'highcharts-react-official';

export default function GanttChart({ title, categories, tasks, range }) {
  
  console.log({ categories, tasks });

  // 1️⃣ Convert ISO strings to ms timestamps
  const seriesData = tasks.map(t => ({
    name:  t.name,
    start: Date.parse(t.start),
    end:   Date.parse(t.end),
    y:     categories.indexOf(t.camera),
    color: t.type === 'feed' ? 'green' : 'blue'
  }));

  // 2️⃣ Build chart options
  const options = {
    chart: {
      height: (categories.length * 65 )+ 100,  // auto-height per row
    },
    title: { text: title, align: 'left' },
    xAxis: {
      type: 'datetime',
      min: Date.parse(range.min),
      max: Date.parse(range.max),
    },
    yAxis: {
      categories,
      reversed: true,
      title: { text: null }
    },
    series: [{
      name: title,
      data: seriesData,
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      }
    }],
    tooltip: {
      pointFormatter() {
        const fmtDate = d => Highcharts.dateFormat('%Y-%m-%d %H:%M', d);
        return `<b>${this.name}</b><br/>${fmtDate(this.start)} – ${fmtDate(this.end)}`;
      }
    },
    navigator: { enabled: true },    // optional: mini-map below
    scrollbar: { enabled: true },    // optional: scroll if wide
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType="ganttChart"
      options={options}
    />
  );
}
