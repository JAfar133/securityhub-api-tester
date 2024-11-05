// src/pages/MonitoringPage.js
import React, { useState } from 'react';
import { Pane, Button, toaster } from 'evergreen-ui';
import api from '../services/api';

const MonitoringPage = () => {
    const [healthInfo, setHealthInfo] = useState(null);

    const fetchHealth = async () => {
        try {
            const response = await api.get('/actuator/health');
            setHealthInfo(response.data);
            toaster.success('Fetched health info');
        } catch (error) {
            toaster.danger('Failed to fetch health info');
        }
    };

    return (
        <Pane>
            <Button onClick={fetchHealth} marginBottom={16}>
                Get Health Info
            </Button>
            {healthInfo && <pre>{JSON.stringify(healthInfo, null, 2)}</pre>}
        </Pane>
    );
};

export default MonitoringPage;
