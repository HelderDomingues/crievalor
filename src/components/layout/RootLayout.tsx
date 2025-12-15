import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';

export const RootLayout = () => {
    return (
        <AnalyticsProvider>
            <Outlet />
        </AnalyticsProvider>
    );
};
