// src/pages/DevPage.js
import React from 'react';
import { Pane, Button, TextInputField, toaster } from 'evergreen-ui';
import api from '../services/api';

const DevPage = () => {
    const [ip, setIp] = React.useState('');
    const [scanResult, setScanResult] = React.useState(null);

    const startScanningIps = async () => {
        try {
            const response = await api.post('/dev/start-scanning-ips');
            toaster.success(response.data);
        } catch (error) {
            toaster.danger('Failed to start scanning');
        }
    };

    const scanByIp = async () => {
        try {
            const response = await api.post('/dev/scan-by-ip', null, { params: { ip } });
            setScanResult(response.data);
            toaster.success('Scan completed');
        } catch (error) {
            toaster.danger('Failed to scan IP');
        }
    };

    return (
        <Pane>
            <Button onClick={startScanningIps} marginBottom={16}>
                Start Scanning IPs
            </Button>
            <TextInputField
                label="IP Address"
                placeholder="Enter IP address"
                value={ip}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setIp(e.target.value)}
            />
            <Button onClick={scanByIp} marginBottom={16}>
                Scan IP
            </Button>
            {scanResult && <pre>{JSON.stringify(scanResult, null, 2)}</pre>}
        </Pane>
    );
};

export default DevPage;
