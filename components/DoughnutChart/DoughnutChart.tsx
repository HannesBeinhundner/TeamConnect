import { Chart } from "chart.js";
import React, { useEffect } from "react";

interface ChartData {
    type: string;
    itemCount: number;
}

interface DoughnutChartProps {
    id: any;
    chartData: ChartData[];
}
const DoughnutChart: React.FC<DoughnutChartProps> = ({ id, chartData }) => {

    useEffect(() => {
        if (!document.getElementById(id)) return;
        const ctx = (document.getElementById(id) as HTMLCanvasElement).getContext('2d');
        if (!ctx) return;

        const data = chartData && chartData.length > 0 ? chartData : [{ type: 'No data yet', itemCount: 1 }];

        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map((type: ChartData) => type.type),
                datasets: [{
                    data: data.map((item: ChartData) => item.itemCount),
                    borderColor: [
                        "#007DFF", "#0057B2", "#cf2b2b", "#6F2931",
                        "#CC0000", "#66B2FF", "#003366", "#FF5C73", "#8D91A8", "42D7C8", "#AEF6FF", "#2883BF", "#FF0000", "#E64000", "#631929", "#F45F44", "#DBC6BB", "#8EFCFF", "#C4CFE5", "#FF8000",
                    ],
                    backgroundColor: [
                        "#007DFF", "#0057B2", "#cf2b2b", "#6F2931",
                        "#CC0000", "#66B2FF", "#003366", "#FF5C73", "#8D91A8", "42D7C8", "#AEF6FF", "#2883BF", "#FF0000", "#E64000", "#631929", "#F45F44", "#DBC6BB", "#8EFCFF", "#C4CFE5", "#FF8000",
                    ],
                    borderWidth: 2,
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        display: false,
                    }],
                    yAxes: [{
                        display: false,
                    }],
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        fontSize: 10,
                        boxWidth: 15,
                    },
                },
                responsive: true,
                maintainAspectRatio: false
            },
        });

        return () => {
            myChart.destroy();
        };
    }, [chartData]);

    return (
        <div style={{
            height: '200px'
        }}>
            <canvas id={id} style={{ width: '100%', height: '100%' }}></canvas>
        </div >
    )
}

export default DoughnutChart;