import React, { useCallback, useState, useEffect } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import "./dashboard.css";
import NoData from "./NoData";

export default function CustomActiveShapePieChart({ data }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const [pieChartHeight, setPieChartHeight] = useState(viewportHeight - viewportHeight * 0.6);
    const [innerRadius, setInnerRadius] = useState(90 * (viewportHeight / 1080));
    const [outerRadius, setOuterRadius] = useState(100 * (viewportHeight / 1080));
    const total = data.reduce((acc, item) => acc + item.value, 0);

    const onPieEnter = useCallback((_, index) => {
        setActiveIndex(index);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const newViewportHeight = window.innerHeight - 0.6 * window.innerHeight;
            setViewportHeight(newViewportHeight);
            setPieChartHeight(newViewportHeight * 0.8);

            setInnerRadius(90 * (window.innerHeight / 1080));
            setOuterRadius(100 * (window.innerHeight / 1080));

            console.log(innerRadius)
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const {
            cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value,
        } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? "start" : "end";

        const percentage = ((value / total) * 100).toFixed(2);

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                    {payload.name}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    style={{ outline: 'none' }}
                    stroke="none"
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                    style={{ outline: 'none' }}
                    stroke="none"
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
                    {` ${value} Kč`}
                </text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(${percentage}%)`}
                </text>
            </g>
        );
    };

    if (data.length === 0) {
        return <NoData />
    }

    return (
        <ResponsiveContainer width="100%" height={pieChartHeight} style={{ marginTop: "-5%" }}>
            <PieChart style={{ outline: 'none' }}>
                <Pie
                    style={{ outline: 'none' }}
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    fill="rgb(182, 51, 46)"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    paddingAngle={2}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
