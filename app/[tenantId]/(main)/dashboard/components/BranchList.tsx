"use client";

import React from "react";
import { useWidgetDataStore } from "@/stores/widget-data-store";
import PulseLoader from "react-spinners/PulseLoader";
import BranchCard from "./BranchCard";
import { WebWidgetData } from "@/types/tables";

// Transform BranchModel to BranchData - Bileşen dışına taşındı
const transformBranchData = (data: WebWidgetData) => {
    const currentValue = data.reportValue2 || 0;
    const previousValue = data.reportValue3 || 0;
    const difference = currentValue - previousValue;
    const percentageChange = previousValue !== 0 ? data.reportValue9 : null;

    return {
        id: (data.BranchID || '').toString(),
        name: data.reportValue1 || '',
        currentValue: currentValue.toString(),
        previousValue: previousValue.toString(),
        difference: difference.toString(),
        totalDaily: (data.reportValue4 || 0).toString(),
        dailyCustomers: (data.reportValue5 || 0).toString(),
        peopleCount: (data.reportValue5 || 0).toString(),
        percentageChange: percentageChange?.toString() ?? null
    };
};

const BranchList: React.FC = () => {
    const { branchDatas } = useWidgetDataStore();

    const transformedData = React.useMemo(() => 
        branchDatas?.map(data => data ? transformBranchData(data) : null).filter(Boolean) ?? [],
        [branchDatas]
    );

    const maxValue = React.useMemo(() => 
        Math.max(...(branchDatas?.map(data => data?.reportValue2 || 0) ?? [])),
        [branchDatas]
    );

    if (!branchDatas || branchDatas.length === 0) {
        return (
            <div className="col-span-full flex items-center justify-center py-8">
                <PulseLoader color="#6366f1" size={18} margin={4} speedMultiplier={0.8} />

            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {transformedData.map((branchData, index) => (
                    <BranchCard 
                        key={branchData.id} 
                        data={branchData} 
                        index={index} 
                        maxValue={maxValue} 
                    />
                ))}
            </div>
        </div>
    );
};

export default React.memo(BranchList);
