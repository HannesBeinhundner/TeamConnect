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

        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartData.map((type: ChartData) => type.type),
                datasets: [{
                    data: chartData.map((item: ChartData) => item.itemCount),
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
            },
        });

        return () => {
            myChart.destroy();
        };
    }, [chartData]);

    return (
        <canvas id={id} style={{ width: '100%', maxWidth: '300px', height: '100%', maxHeight: '150px' }}></canvas>
    )
}

export default DoughnutChart;