import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";

export default function Linechart({ data }) {

    const formatSpending = (value) => `${value} Kč`;

    return (
        <ResponsiveContainer width="100%" height="90%">
            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis>
                    <Label
                        value="Denní výdaje (Kč)"
                        angle={-90}
                        position="insideLeft"
                        style={{ textAnchor: 'middle' }}
                    />
                </YAxis>
                <Tooltip formatter={formatSpending} />
                
                <Area
                    type="monotone"
                    dataKey="dailySpending"
                    name="Denní výdaje"
                    stroke="rgb(182, 51, 46)"
                    fill="rgb(182, 51, 46)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
